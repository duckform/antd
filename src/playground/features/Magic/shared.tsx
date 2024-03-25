import { ITreeNode } from "@duckform/core";

/**
 *  json -> JSON Schema -> ISchemaTreeNode -> ITreeNode
 */

export interface ISchemaTreeNode extends ITreeNode {
  key: string;
  props: ITreeNode["props"] & {
    type: "array" | "object" | "boolean" | "string" | "number" | "void";
    title?: string;
    name?: string;
    ["x-decorator"]?: string;
    ["x-decorator-props"]?: Record<string, any>;
    ["x-component"]?: string;
    ["x-component-props"]?: Record<string, any>;
    ["x-component-options"]?: string[];
  };
  children?: ISchemaTreeNode[];
  revert?: ISchemaTreeNode;
  state: Record<string, any>;
}

export const updateKeyDeep = (
  node: ISchemaTreeNode,
  rootKey: string,
  neoKey: string,
) => {
  const key = node.key.replace(rootKey, neoKey);
  node.key = key;
  if (node.children) {
    node.children.forEach((child) => {
      updateKeyDeep(child, rootKey, neoKey);
    });
  }
};

export const each = (
  node: ISchemaTreeNode,
  cb: (inode: ISchemaTreeNode, parent: ISchemaTreeNode) => void | false,
  parent?: ISchemaTreeNode,
) => {
  const next = cb(node, parent);
  if (next === false) return;
  if (Array.isArray(node.children)) {
    node.children.forEach((child) => each(child, cb, node));
  }
};
const REG_OMIT_VOID = /(\w+)(\.void\d+)+$/;
/**
 * .replace(/(\w+)(\.void)+$/, (m , a) => a)
 * 'a.void' -> 'a'
 * 'a.void.void' -> 'a'
 * 'bb.a.void' -> 'bb.a'
 * 'bb.a.void.void' -> 'bb.a'
 * 'void.bb.a.void.void' -> 'void.bb.a'
 */
export const omitVoids = (x: string | string[]) =>
  (Array.isArray(x) ? x.join(".") : x).replace(REG_OMIT_VOID, (_, a) => a);
