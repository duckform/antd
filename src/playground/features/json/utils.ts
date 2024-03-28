import type { ITreeNode } from "@duckform/core";

export const propsTypeNarrowing = (
  t: JSONSchemaLite["type"],
): ITreeNode["props"]["type"] => {
  return t === "null" ? "void" : t === "integer" ? "number" : t;
};
export const isRef = (x: any): x is ReferenceObject => {
  return Boolean((x as any)?.$ref);
};

export const isArray = (x: any): x is ArraySubtype => {
  return Boolean((x as any)?.type === "array");
};

export const isObject = (x: any): x is ObjectSubtype => {
  return Boolean((x as any)?.type === "object");
};

export const resolveRefs = (
  def: SchemaObject | ReferenceObject,
  root: Record<string, SchemaObject | ReferenceObject>,
) => {
  if (isRef(def)) {
    const key = def.$ref.replace("#/definitions/", "");

    return resolveRefs(root[key], root);
  } else if (isArray(def)) {
    def.items = resolveRefs(def.items, root);
  } else if (isObject(def)) {
    const properties = def.properties
      ? Object.keys(def.properties).reduce((tree, key) => {
          tree[key] = resolveRefs(def.properties[key], root);
          return tree;
        }, {})
      : {};
    const additionalProperties =
      typeof def.additionalProperties === "object"
        ? resolveRefs(def.additionalProperties as any, root)
        : {};

    const clone = {
      properties: additionalProperties,
      required: def.required,
      title: def.title,
    };
    // 解嵌套
    if (additionalProperties?.type === "object") {
      clone.properties = additionalProperties.properties;
      clone.title = clone.title ?? additionalProperties.title;
      clone.required = clone.required ?? additionalProperties.required;
    }

    def.properties = { ...properties, ...clone.properties };
    def.required = clone.required;
    def.title = clone.title;
    delete def.additionalProperties;
  }
  return def;
};

export interface ReferenceObject {
  $ref: string;
  [key: `x-${string}`]: any;
}

export interface JSONSchemaLite {
  title?: string;
  type:
    | "void"
    | "string"
    | "number"
    | "integer"
    | "array"
    | "boolean"
    | "null"
    | "object";
  // if dates and times
  format?: string;
  required?: boolean | string[];
  items?: JSONSchemaLite;
  properties?: {
    [name: string]: JSONSchemaLite;
  };
  [external: `x-${string}`]: any;
}

// origin

type SchemaObject = {
  example?: any;
  title?: string;
  default?: unknown;
  description?: string;
  const?: unknown;
  format?: string;
  oneOf?: (SchemaObject | ReferenceObject)[];
  allOf?: (SchemaObject | ReferenceObject)[];
  anyOf?: (SchemaObject | ReferenceObject)[];
  nullable?: boolean;
  required?: string[];
  [key: `x-${string}`]: any;
} & (
  | StringSubtype
  | NumberSubtype
  | IntegerSubtype
  | ArraySubtype
  | BooleanSubtype
  | NullSubtype
  | ObjectSubtype
);
interface StringSubtype {
  type: "string";
  enum?: (string | ReferenceObject)[];
}
interface NumberSubtype {
  type: "number";
  minimum?: number;
  maximum?: number;
  enum?: (number | ReferenceObject)[];
}
interface IntegerSubtype {
  type: "integer";
  minimum?: number;
  maximum?: number;
  enum?: (number | ReferenceObject)[];
}
interface ArraySubtype {
  type: "array";
  items?: SchemaObject | ReferenceObject;
  enum?: (SchemaObject | ReferenceObject)[];
}
interface BooleanSubtype {
  type: "boolean";
  enum?: (boolean | ReferenceObject)[];
}
interface NullSubtype {
  type: "null";
}
interface ObjectSubtype {
  type: "object";
  properties?: {
    [name: string]: SchemaObject | ReferenceObject;
  };
  required?: string[];
  additionalProperties?:
    | boolean
    | Record<string, never>
    | SchemaObject
    | ReferenceObject;
  allOf?: (SchemaObject | ReferenceObject)[];
  anyOf?: (SchemaObject | ReferenceObject)[];
  enum?: (SchemaObject | ReferenceObject)[];
}
