import { uid } from "@duckform/shared";
import { ISchemaTreeNode, updateKeyDeep } from "./features/Magic/shared";
import { message } from "antd";

const copy = (x: any) => {
  return {
    ...x,
    props: {
      ...x.props,
    },
    revert: null,
    state: {},
  };
};

const getComponentOf = (node: any) => {
  switch (node.props.type) {
    case "object":
      return [null, "Card", "FormGrid", "FormTab", "FormCollapse", "Space"];
    case "void":
      return [null, "Card", "FormGrid", "FormTab", "FormCollapse", "Space"];
    case "array":
      return [
        "ArrayCards",
        "ArrayTable",
        "ProArrayTable",
        "Cascader",
        "Select",
        "TreeSelect",
        "DatePicker.RangePicker",
        "TimePicker.RangePicker",
      ];
    case "boolean":
      return ["Switch", "Radio", "Checkbox"];
    case "string":
      return [
        "Input",
        "Password",
        "DatePicker",
        "TimePicker",
        "Slider",
        "Select",
        "TreeSelect",
        "Upload",
      ];
    case "number":
      return [
        "NumberPicker",
        "Input",
        "Rate",
        "Slider",
        "Select",
        "TreeSelect",
      ];
    // case "datetime":
    // return ["Switch", ["Radio", "Checkbox"]];
    default:
      return [];
  }
};

export const allowDropChildren = (node: ISchemaTreeNode) => {
  // object 和 void 可以 drop children
  const ok = node.props.type === "object" || node.props.type === "void";
  // 有 children 直接放到 chidlren 前面就好了
  return ok && node.children.length <= 0;
};

export const allowDropBefore = (node: ISchemaTreeNode) => {
  if (node.key === "root") return false;
  return true;
};

const withDefaults = (node: ISchemaTreeNode) => {
  const options = getComponentOf(node);
  node.props["x-component"] = node.props["x-component"] ?? options[0];
  node.props["x-component-options"] =
    node.props["x-component-options"] ?? options;
};

const guessFormItem = (node: ISchemaTreeNode) => {
  if (!/array|void|object/.test(node.props.type)) {
    node.props["x-decorator"] = "FormItem";
  }
};

export const transform = (
  node: ISchemaTreeNode,
  by: string,
): ISchemaTreeNode => {
  const state = node.state;
  // console.log("by", by, node.key, state);
  if (state.visited) {
    return node;
  }

  withDefaults(node);
  if (by === "init") {
    guessFormItem(node);
  }
  const component = node.props["x-component"];
  const type = node.props.type;

  if (type === "array") {
    const childType = node.children[0]?.props.type;
    const simpleChild =
      childType !== "object" && childType !== "array" && childType !== "void";

    if (component === "Select") {
      node.children = [];
      node.props["x-component-props"] = {
        mode: "multiple",
        labelInValue: simpleChild,
      };
    } else if (
      /ArrayCards|ArrayItems|ArrayCollapse|ArrayTabs/.test(component)
    ) {
      // delete node.props["x-decorator"];
      node.props["x-component-props"] = {
        title: node.props.title,
      };
      const items = node.children[0];
      // wrap simle with void
      if (simpleChild) {
        delete items.props.name;
        const item = copy(items);
        items.props.type = "void";
        items.key = items.key.replace(/\.\w+$/, "void");
        item.id = uid();
        const child = item;
        child.state.visited = true;
        const children = [child];
        items.children = children;
        items.state.visited = true;
      }
    } else if (component === "ArrayTable") {
      // delete node.props["x-decorator"];
      if (simpleChild) {
        node.props["x-component"] = "ArrayCards";
        return node;
      }
      const items = node.children[0];
      items.children = items.children.map((item, idx) => {
        // remove last .items
        const prefix = item.key.replace(/\.\w+$/, "");
        const columnKey = `${prefix}.void${idx}`;
        const voidColumn: ISchemaTreeNode = {
          id: uid(),
          key: columnKey,
          componentName: "Field",
          props: {
            type: "void",
            "x-component": "ArrayTable.Column",
            "x-component-props": {
              title: item.props.title,
            },
          },
          state: {},
          children: [],
        };
        const oldKey = item.key;
        item.key = oldKey.replace(prefix, columnKey);
        updateKeyDeep(item, oldKey, columnKey);
        const child = item;
        voidColumn.children.push(child);
        voidColumn.state.visited = true;

        return voidColumn;
      });
    }
  } else if (type === "object") {
    if (node.props["x-component"] === "FormGrid") {
      // message.warning("FormItem 会导致 FormGrid 失效")
      // delete node.props["x-decorator"];
      node.props["x-component-props"] = {
        maxColumns: 2,
        minColumns: 2,
      };
    }
  }
  node.state.visited = true;
  return node;
};
