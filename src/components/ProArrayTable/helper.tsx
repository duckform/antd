import { ITreeNode, TreeNode } from "@duckform/core";
import {
  createEnsureTypeItemsNode,
  findNodeByComponentPath,
  hasNodeByComponentPath,
  queryNodesByComponentPath,
} from "../../shared";
import { uid } from "@duckform/core/shared";

const PREFIX = "ProArrayTable";

const ensureObjectItemsNode = createEnsureTypeItemsNode("object");

const createColumnWith = (title = "列标题", children: ITreeNode[] = []) => {
  return new TreeNode({
    componentName: "Field",
    props: {
      type: "void",
      "x-component": `${PREFIX}.Column`,
      "x-component-props": {
        title: title,
      },
    },
    children,
  });
};

const createSortHandler = () => {
  return createColumnWith("排序", [
    {
      componentName: "Field",
      props: {
        type: "void",
        "x-component": `${PREFIX}.SortHandle`,
      },
    },
  ]);
};

const createIndexHandler = () => {
  return createColumnWith("序号", [
    {
      componentName: "Field",
      props: {
        type: "void",
        "x-component": `${PREFIX}.Index`,
      },
    },
  ]);
};

const createOpHandler = (ops: Array<"MoveUp" | "MoveDown" | "Remove">) => {
  return createColumnWith(
    "操作",
    ops.map((op) => {
      return {
        componentName: "Field",
        props: {
          type: "void",
          "x-component": `${PREFIX}.${op}`,
        },
      };
    }),
  );
};

const createAddtionHandler = () => {
  return new TreeNode({
    componentName: "Field",
    props: {
      type: "void",
      title: "Addition",
      "x-component": `${PREFIX}.Addition`,
    },
  });
};

const createProAdditionHandler = () => {
  return new TreeNode({
    componentName: "Field",
    props: {
      type: "void",
      title: "Addition",
      "x-component": `${PREFIX}.ProAddition`,
    },
  });
};

const createShadowHandler = (uid: string) => {
  const key = `shadow_${uid}`;
  const delegate = new TreeNode({
    componentName: "Field",
    props: {
      type: "void",
      name: key,
      title: `编辑`,
      "x-component": `${PREFIX}.DelegateAction`,
      "x-component-props": {
        title: `编辑_${uid}`,
      },
    },
  });
  const popup = new TreeNode({
    componentName: "Field",
    props: {
      type: "void",
      name: key,
      "x-component": `${PREFIX}.ShadowModal`,
      "x-component-props": {
        schema: {},
      },
    },
  });

  return { delegate, popup };
};

export const dropTemplate = (source: TreeNode[]) => {
  const columnNode = createColumnWith(
    "列",
    source.map((node) => {
      if (node.props.title) {
        node.props.title = undefined;
      }
      return node;
    }),
  );
  return [columnNode];
};

export const init = (parent: TreeNode) => {
  if (parent.children.length > 0) return;

  const addition = createAddtionHandler();
  const shadow = createShadowHandler(uid());
  const ops = createOpHandler(["MoveUp", "MoveDown", "Remove"]);
  const column = createColumnWith();
  const index = createIndexHandler();
  const sort = createSortHandler();
  ops.children.unshift(shadow.delegate);

  parent.props["x-component-props"] = parent.props["x-component-props"] || {};
  parent.props["x-component-props"].sortable = true;
  ensureObjectItemsNode(parent).prepend(column, ops);
  ensureObjectItemsNode(parent).prepend(sort, index);

  // array childrenp[0] 会被作为 items, 所以不能用 prepend
  parent.append(addition);
  parent.append(shadow.popup);
};

export const query = {
  columns: (node: TreeNode) =>
    queryNodesByComponentPath(node, [`${PREFIX}`, "*", `${PREFIX}.Column`]),
  addtions: (node: TreeNode) =>
    queryNodesByComponentPath(node, [
      `${PREFIX}`,
      (name) => /ProArrayTable\.(Pro)?Addition/.test(name),
    ]),
};

export const actions = {
  addSort(node: TreeNode) {
    const has = hasNodeByComponentPath(node, [
      PREFIX,
      "*",
      `${PREFIX}.Column`,
      `${PREFIX}.SortHandle`,
    ]);
    if (!has) {
      const sort = createSortHandler();
      ensureObjectItemsNode(node).prepend(sort);
      node.props["x-components-props"] = node.props["x-components-props"] || {};
      node.props["x-components-props"].sortable = true;
    }
  },
  addIndex(node: TreeNode) {
    const has = hasNodeByComponentPath(node, [
      PREFIX,
      "*",
      `${PREFIX}.Column`,
      `${PREFIX}.Index`,
    ]);
    if (!has) {
      const index = createIndexHandler();
      ensureObjectItemsNode(node).prepend(index);
    }
  },
  addColumn(node: TreeNode) {
    const op = findNodeByComponentPath(node, [
      PREFIX,
      "*",
      `${PREFIX}.Column`,
      (name) => /ProArrayTable\.(Remove|MoveDown|MoveUp)/.test(name),
    ]);
    const col = createColumnWith();
    if (op) {
      op.parent.insertBefore(col);
    } else {
      ensureObjectItemsNode(node).append(col);
    }
  },
  addOp(node: TreeNode) {
    const op = findNodeByComponentPath(node, [
      PREFIX,
      "*",
      `${PREFIX}.Column`,
      (name) => /ProArrayTable\.(Remove|MoveDown|MoveUp)/.test(name),
    ]);
    if (op) return;
    const next = createOpHandler(["MoveDown", "MoveUp", "Remove"]);
    ensureObjectItemsNode(node).append(next);
  },
  addProAddtion(node: TreeNode) {
    const has = findNodeByComponentPath(node, [
      PREFIX,
      `${PREFIX}.ProAddition`,
    ]);
    if (has) return;
    const next = createProAdditionHandler();
    node.append(next);
  },
  addRowPopup(node: TreeNode) {
    const shadow = createShadowHandler(uid());
    const op = findNodeByComponentPath(node, [
      PREFIX,
      "*",
      `${PREFIX}.Column`,
      (name, node) => {
        return node.props["x-component"] === `${PREFIX}.DelegateAction`;
      },
      // `${Prefix}.DelegateAction`,
    ]);
    if (!op) {
      const act = createColumnWith("操作", [shadow.delegate]);
      ensureObjectItemsNode(node).append(act);
    } else {
      op.parent.prepend(shadow.delegate);
    }
    node.append(shadow.popup);
  },
};

const findParentArrayTable = (node: TreeNode) => {
  let parent = node;
  while (parent && parent.props["x-component"] !== PREFIX) {
    parent = parent.parent;
  }
  return parent;
};
export const shadowHelper = {
  // 查找删除节点钟有没有 delegate
  findDelegates(node: TreeNode) {
    if (!node) return [];
    const delegates = node.findAll((child) => {
      return child.props["x-component"] === `${PREFIX}.DelegateAction`;
    });
    return delegates;
  },
  // 根据 delegate 删除对应的弹窗
  removePairShadowModal(delegates: TreeNode[]) {
    delegates.forEach((act) => {
      const table = findParentArrayTable(act);
      table.eachChildren((sub) => {
        if (sub.props["x-component"] === `${PREFIX}.ShadowModal`) {
          if (act.props.name && sub.props?.name === act.props.name) {
            sub.remove();
          }
        }
      });
    });
  },
};
