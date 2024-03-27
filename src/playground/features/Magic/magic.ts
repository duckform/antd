import { JSONSchemaLite } from "./json-schema";
import { Engine, TreeNode } from "@duckform/core";
import { uid } from "@duckform/core/shared";
import { ISchemaTreeNode, omitVoids, each, updateKeyDeep } from "./shared";

/**
 *  json -> JSON Schema -> ISchemaTreeNode -> ITreeNode
 */

const typeNarrowing = (
  t: JSONSchemaLite["type"],
): ISchemaTreeNode["props"]["type"] => {
  return t === "null" ? "void" : t === "integer" ? "number" : t;
};
export const buildSchemaTree = (
  schema: JSONSchemaLite,
  name?: string,
  parent?: ISchemaTreeNode,
): ISchemaTreeNode => {
  const node: ISchemaTreeNode = {
    key: `${parent?.key ? `${parent.key}.` : ""}${name ?? "root"}`,
    id: uid(),
    componentName: "Field",
    props: {
      type: typeNarrowing(schema.type),
      name: name === "__items__" ? undefined : name,
      title: schema.title ?? name === "__items__" ? undefined : name,
      required: schema.required,
    },
    state: {},
  };

  if (schema.items) {
    node.children = [buildSchemaTree(schema.items, "__items__", node)];
  }
  if (schema.properties) {
    node.children = Object.keys(schema.properties).reduce((neo, key) => {
      neo.push(buildSchemaTree(schema.properties[key], key, node));
      return neo;
    }, node.children ?? []);
  }
  node.revert = JSON.parse(JSON.stringify(node));

  return node;
};

export const addVoidTo = (node: ISchemaTreeNode) => {
  let acc = 0;
  const prefix = `${node.key}.void`;

  while (node.children.find((x) => x.key === `${prefix}${acc}`)) {
    acc = acc + 1;
  }
  node.children.unshift({
    id: uid(),
    key: `${prefix}.void${acc}`,
    children: [],
    componentName: "Field",
    props: {
      type: "void",
    },
    state: {},
    revert: null,
  });
};

export const onDropInsert = (
  tree: ISchemaTreeNode[],
  to: "before" | "children",
  fromKey: string,
  toKey: string,
) => {
  const root = tree[0];
  let fromNode: ISchemaTreeNode;
  let fromParentNode: ISchemaTreeNode;
  const fromKeys = fromKey.split(".");
  const fromParentKey = fromKeys.slice(0, -1).join(".");

  let toNode: ISchemaTreeNode;
  let toParentNode: ISchemaTreeNode;
  const toKeys = toKey.split(".");
  const toParentKey = toKeys.slice(0, -1).join(".");

  each(root, (node) => {
    if (fromNode && fromParentNode && toNode && toParentNode) return false;
    if (node.key === fromKey) {
      fromNode = node;
    }
    if (node.key === fromParentKey) {
      fromParentNode = node;
    }
    if (node.key === toKey) {
      toNode = node;
    }
    if (node.key === toParentKey) {
      toParentNode = node;
    }
  });
  // remove origin
  fromParentNode.children = fromParentNode.children.filter((node, idx) => {
    return node.key !== fromKey;
  });
  if (to === "before") {
    // update key
    updateKeyDeep(fromNode, fromParentKey, toParentKey);
    // move to neo

    toParentNode.children.unshift(fromNode);
  } else {
    updateKeyDeep(fromNode, fromParentKey, toKey);
    toNode.children.unshift(fromNode);
  }
  // console.log({ to, dropKey, dragKey });
};

export const allowDrop =
  (tree: ISchemaTreeNode) =>
  (dragKey: string, dropKey: string): [boolean, boolean] => {
    // 自己不能拖动
    if (dropKey === dragKey) {
      // console.log("[false, falsse] by self ", { dragKey, dropKey });
      return [false, false];
    }
    const dragKeys = dragKey.split(".");
    const dragParentKeys = dragKeys.slice(0, -1);
    const dropKeys = dropKey.split(".");
    const dropParentKeys = dropKeys.slice(0, -1);

    let dragNode: ISchemaTreeNode;
    let dropNode: ISchemaTreeNode;

    each(tree, (node) => {
      if (dragNode && dropNode) return false;
      if (node.key === dragKey) {
        dragNode = node;
      }
      if (node.key === dropKey) {
        dropNode = node;
      }
    });
    // node 没找到不能拖动
    const isNotFound = !dragNode || !dropNode;
    if (isNotFound) {
      // console.log("[false, false] by node not found. ", { dragKey, dropKey });
      return [false, false];
    }

    const isParent = dragParentKeys.join(".") === dropKey;
    const isVoidParent = omitVoids(dragParentKeys) === omitVoids(dropKey);

    if (isParent) {
      // console.log("[false, true] by parent. ", { dragKey, dropKey });
      return [false, true];
    }
    if (isVoidParent) {
      // console.log("[false, true] by void parent. ", { dragKey, dropKey });
      return [false, true];
    }

    const isSlibing = dragParentKeys.join(".") === dropParentKeys.join(".");
    const isVoidSlibing =
      omitVoids(dragParentKeys) === omitVoids(dropParentKeys);
    if (isSlibing) {
      // console.log("[true, false] by slibings. ", {
      //   dragKey,
      //   dropKey,
      // });
      return [true, false];
    }

    if (isVoidSlibing) {
      // console.log("[true, false] by void slibings. ", { dragKey, dropKey });
      return [true, false];
    }

    // console.log("[false, false] by default. ", { dragKey, dropKey });
    return [false, false];
  };
