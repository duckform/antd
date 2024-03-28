import { JSONSchemaLite, propsTypeNarrowing } from "./utils";
import type { ITreeNode } from "@duckform/core";
import { uid } from "@duckform/core/shared";
import { convert } from "@redocly/json-to-json-schema";

/**
 *  json -> JSON Schema -> ITreeNode
 */

export const jsonToJSONSchema = (json: any): JSONSchemaLite => {
  const schema = convert(json, {
    targetSchema: "draft-05-oas",
    includeExamples: false,
    inferRequired: false,
  });
  return schema as any;
};

export const jsonSchemaToTreeNode = (
  schema: JSONSchemaLite,
  name?: string,
): ITreeNode => {
  const node: ITreeNode = {
    id: uid(),
    componentName: "Field",
    props: {
      type: propsTypeNarrowing(schema.type),
      name: name,
      title: schema.title ?? name,
      required: schema.required,
    },
  };

  if (schema.items) {
    node.children = [jsonSchemaToTreeNode(schema.items)];
  }
  if (schema.properties) {
    node.children = Object.keys(schema.properties).reduce((neo, key) => {
      neo.push(jsonSchemaToTreeNode(schema.properties[key], key));
      return neo;
    }, node.children ?? []);
  }

  return node;
};
