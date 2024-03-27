import { ISchemaTreeNode, each, omitVoids } from "../shared";

export const defaultAllowDropChildren = (node: ISchemaTreeNode) => {
  // object 和 void 可以 drop children
  const ok = node.props.type === "object" || node.props.type === "void";
  // 有 children 直接放到 chidlren 前面就好了
  return ok && node.children.length <= 0;
};

export const defaultAllowDropBefore = (node: ISchemaTreeNode) => {
  if (node.key === "root") return false;
  return true;
};

export const defaultAllowDrop =
  (tree?: ISchemaTreeNode) =>
  (dragKey: string, dropKey: string): [boolean, boolean] => {
    // 自己不能拖动
    if (dropKey === dragKey) {
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
      return [false, false];
    }

    const isParent = dragParentKeys.join(".") === dropKey;
    const isVoidParent = omitVoids(dragParentKeys) === omitVoids(dropKey);

    if (isParent) {
      return [false, true];
    }
    if (isVoidParent) {
      return [false, true];
    }

    const isSlibing = dragParentKeys.join(".") === dropParentKeys.join(".");
    const isVoidSlibing =
      omitVoids(dragParentKeys) === omitVoids(dropParentKeys);
    if (isSlibing) {
      return [true, false];
    }

    if (isVoidSlibing) {
      return [true, false];
    }

    return [false, false];
  };
