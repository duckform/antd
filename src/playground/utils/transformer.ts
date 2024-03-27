import { ITreeNode } from "@duckform/core";
import { clone, uid } from "@duckform/core/shared";
import { ISchema, Schema } from "@formily/json-schema";

export interface ITransformerOptions {
  designableFieldName?: string;
  designableFormName?: string;
}

export interface IFormilySchema {
  schema?: ISchema;
  form?: Record<string, any>;
}

const createOptions = (options: ITransformerOptions): ITransformerOptions => {
  return {
    designableFieldName: "Field",
    designableFormName: "Form",
    ...options,
  };
};

const findNode = (node: ITreeNode, finder?: (node: ITreeNode) => boolean) => {
  if (!node) return;
  const found = finder?.(node);
  if (found) return node;
  if (!node.children) return;
  for (let i = 0; i < node.children.length; i++) {
    if (findNode(node.children[i], finder)) return node.children[i];
  }
  return;
};

const eachSchema = (
  schema: ISchema,
  iter: (schema: ISchema, key: string, parents: ISchema[]) => void | false,
  key = "",
  parents: ISchema[] = [],
) => {
  const next = iter(schema, key, parents);
  if (next !== false) {
    if (schema.type === "array" && schema.items) {
      eachSchema(schema.items as ISchema, iter, "items", [...parents, schema]);
    }
    if (schema.properties) {
      Object.keys(schema.properties).forEach((key) => {
        eachSchema(schema.properties[key], iter, key, [...parents, schema]);
      });
    }
  }
};
const stopDeepin = false;
const saveToSchema = (root: ISchema) => {
  eachSchema(root, (schema, key, parents) => {
    if (!schema) return;

    if (schema?.["x-decorator"] === "ShadowForm") {
      const shadowSchema = schema.properties;
      schema["x-decorator-props"] = {
        ...schema["x-decorator-props"],
        schema: {
          type: "void",
          properties: shadowSchema,
        },
      };
      schema.properties = undefined;
      return stopDeepin;
    } else if (schema?.["x-component"] === "ProArrayTable.ProAddition") {
      const shadowSchema = schema.properties;
      schema["x-component-props"] = {
        ...schema["x-component-props"],
        schema: {
          type: "void",
          properties: shadowSchema,
        },
      };
      schema.properties = undefined;
      return stopDeepin;
    } else if (schema?.["x-component"] === "ProArrayTable.DelegateAction") {
      const table = parents.reduceRight((found, parent) => {
        if (found) return found;
        if (
          parent.type === "array" &&
          parent["x-component"] === "ProArrayTable"
        ) {
          return parent;
        }
      }, null);

      const props = schema["x-component-props"];
      // 添加对应弹窗
      table.properties[key] = {
        type: "void",
        name: key,
        ["x-designable-id"]: schema["x-designable-id"],
        "x-component": "ProArrayTable.ShadowModal",
        "x-component-props": {
          // okText, cancelText, title
          okText: props.okText,
          cancelText: props.cancelText,
          title: props.title,
          schema: {
            type: "void",
            properties: schema.properties,
          },
        },
      } as ISchema;
      // 修正当前属性, 即 ProArrayTable.DelegateActin as Decorator
      schema["x-decorator"] = schema["x-component"];
      schema["x-component"] = "Button";
      schema["x-component-props"] = {
        ...props,
        type: "link",
        children: schema.title,
      };
      delete schema.properties;
      return stopDeepin;
    }
  });
};

const readToTreeNode = (root: ISchema) => {
  eachSchema(root, (schema, key, parents) => {
    if (schema?.["x-decorator"] === "ShadowForm") {
      schema.properties = schema?.["x-decorator-props"]?.schema?.properties;
      delete schema?.["x-decorator-props"]?.schema;
      return stopDeepin;
    } else if (schema?.["x-component"] === "ProArrayTable.ProAddition") {
      schema["x-component"] = "ProArrayTable.ProAddition";
      schema.properties = schema?.["x-component-props"]?.schema?.properties;
      const props = schema["x-component-props"] ?? {};
      delete props.children;
      delete props.type;
      return stopDeepin;
    } else if (schema?.["x-decorator"] === "ProArrayTable.DelegateAction") {
      schema["x-component"] = "ProArrayTable.DelegateAction";
      delete schema["x-decorator"];
      return stopDeepin;
    } else if (schema?.["x-component"] === "ProArrayTable.ShadowModal") {
      const table = parents.reduceRight((found, parent) => {
        if (found) return found;
        if (
          parent.type === "array" &&
          parent["x-component"] === "ProArrayTable"
        ) {
          return parent;
        }
      }, null);
      let target: ISchema;
      eachSchema(table.items as ISchema, (child, subKey) => {
        if (target) return stopDeepin;
        // 对于数组 items 的遍历在 properties 之前,
        //  所以这里用 ["x-component"] 对比
        if (
          child["x-component"] === "ProArrayTable.DelegateAction" &&
          key === subKey
        ) {
          target = child;
          return stopDeepin;
        }
      });
      if (target) {
        const props = schema?.["x-component-props"] ?? {};
        target.properties = props?.schema?.properties;
        delete props.schema;
        const targetProps = target["x-component-props"] || {};
        delete targetProps.children;
        delete targetProps.type;
        target["x-designable-id"] = schema["x-designable-id"];
        target["x-component-props"] = {
          ...targetProps,
          ...props,
        };

        // 删掉这个节点
        delete parents[parents.length - 1].properties[key];
      }
    }
  });
};

export const transformToSchema = (
  node: ITreeNode,
  options?: ITransformerOptions,
): IFormilySchema => {
  const realOptions = createOptions(options!);
  const root = findNode(node, (child) => {
    return child.componentName === realOptions.designableFormName;
  });
  const schema = {
    type: "object",
    properties: {},
  };
  if (!root) return { schema };
  const createSchema = (node: ITreeNode, schema: ISchema = {}) => {
    if (node !== root) {
      Object.assign(schema, clone(node.props));
    }
    schema["x-designable-id"] = node.id;
    if (schema.type === "array") {
      if (node.children?.[0]) {
        if (
          node.children[0].componentName === realOptions.designableFieldName
        ) {
          schema.items = createSchema(node.children[0]);
          schema["x-index"] = 0;
        }
      }
      node.children?.slice(1).forEach((child, index) => {
        if (child.componentName !== realOptions.designableFieldName) return;
        const key = child.props?.["name"] || child.id;
        schema.properties = schema.properties || {};
        (schema.properties as any)[key] = createSchema(child);
        (schema.properties as any)[key]["x-index"] = index;
      });
    } else {
      node.children?.forEach((child, index) => {
        if (child.componentName !== realOptions.designableFieldName) return;
        const key = child.props?.["name"] || child.id;
        schema.properties = schema.properties || {};
        (schema.properties as any)[key] = createSchema(child);
        (schema.properties as any)[key]["x-index"] = index;
      });
    }
    return schema;
  };
  const formilySchema = createSchema(root, schema);
  saveToSchema(formilySchema);
  return { form: clone(root.props), schema: formilySchema };
};

export const transformToTreeNode = (
  formily: IFormilySchema = {},
  options?: ITransformerOptions,
) => {
  const realOptions = createOptions(options!);
  const root: ITreeNode = {
    componentName: realOptions.designableFormName,
    props: formily.form,
    children: [],
  };

  readToTreeNode(formily.schema);

  const schema = new Schema(formily.schema!);
  const cleanProps = (props: any) => {
    if (props["name"] === props["x-designable-id"]) {
      delete props.name;
    }
    delete props["version"];
    delete props["_isJSONSchemaObject"];
    return props;
  };

  const appendTreeNode = (parent: ITreeNode, schema: Schema) => {
    if (!schema) return;
    const current = {
      id: schema["x-designable-id"] || uid(),
      componentName: realOptions.designableFieldName,
      props: cleanProps(schema.toJSON(false)),
      children: [],
    };
    parent.children?.push(current);
    if (schema.items && !Array.isArray(schema.items)) {
      appendTreeNode(current, schema.items);
    }
    schema.mapProperties((schema) => {
      schema["x-designable-id"] = schema["x-designable-id"] || uid();
      appendTreeNode(current, schema);
    });
  };
  schema.mapProperties((schema) => {
    schema["x-designable-id"] = schema["x-designable-id"] || uid();
    appendTreeNode(root, schema);
  });
  return root;
};
