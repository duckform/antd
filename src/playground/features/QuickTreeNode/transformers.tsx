import { TreeNode } from "@duckform/core";
import { JSONSchemaLite } from "../json/utils";

type Transformer = {
  accepts: JSONSchemaLite["type"][];
  // match?: (node: TreeNode) => boolean;
  transform?: (node: TreeNode) => TreeNode;
  reset?: (node: TreeNode) => TreeNode;
};

const getNodeProps = (
  node: TreeNode,
  key: "x-component" | "x-component-props" | "type" | "title" | (string & {}),
) => node?.props?.[key];

/** 
 * TODO: 二维数组?
 demo at https://github.com/alibaba/formily/issues/4024
 不得不说, qucktype 还是强, 
 @demo
  {
    "arr": [
      [1]
    ]
  }
  // 因为体积太大而没用的
  @see https://app.quicktype.io/
  // 现在用的
  @see https://redocly.com/tools/json-to-json-schema/
 */

const ArrayTable: Transformer = {
  accepts: ["array"],
  // match: (node: TreeNode) => {
  //   return (
  //     getNodeProps(node, "x-component") === "ArrayTable" &&
  //     getNodeProps(node.children?.[0], "type") === "object"
  //   );
  // },
  transform: (node: TreeNode) => {
    const arrayItems = node.children?.[0];
    if (!arrayItems) return node;

    const done = arrayItems?.children?.find?.(
      (x) => getNodeProps(x, "x-component") === "ArrayTable.Column",
    );
    if (done) return node;

    const children = arrayItems.children ?? [];

    const columns = children.map((item) => {
      const column = new TreeNode(
        {
          componentName: "Field",
          props: {
            type: "void",
            "x-component": "ArrayTable.Column",
            "x-component-props": {
              title: item.props.name ?? item.props.title ?? "列标题",
            },
          },
        },
        arrayItems,
      );
      column.append(item.clone());
      item.remove();
      return column;
    });
    const index = new TreeNode(
      {
        componentName: "Field",
        props: {
          type: "void",
          "x-component": "ArrayTable.Column",
          "x-component-props": {
            title: "顺序",
          },
        },
        children: [
          {
            componentName: "Field",
            props: {
              type: "void",
              "x-component": "ArrayTable.Index",
            },
          },
        ],
      },
      arrayItems,
    );
    const actions = new TreeNode(
      {
        componentName: "Field",
        props: {
          type: "void",
          "x-component": "ArrayTable.Column",
          "x-component-props": {
            title: "操作",
          },
        },
        children: ["MoveUp", "MoveDown", "Remove"].map((Action) => {
          return {
            componentName: "Field",
            props: {
              type: "void",
              "x-component": `ArrayTable.${Action}`,
            },
          };
        }),
      },
      arrayItems,
    );

    columns.unshift(index);
    columns.push(actions);

    arrayItems.setChildren(...columns);

    const addition = new TreeNode(
      {
        componentName: "Field",
        props: {
          type: "void",
          title: "添加条目",
          "x-component": "ArrayTable.Addition",
        },
      },
      node,
    );
    // reset children
    node.setChildren(arrayItems, addition);

    return node;
  },
  reset: (node: TreeNode) => {
    // if (!ArrayTable.match(node)) return node;
    const arrayItems = node.children?.[0];
    console.log(`🚀 ~ arrayItems:`, arrayItems);
    const done = arrayItems.children?.find?.(
      (x) => getNodeProps(x, "x-component") === "ArrayTable.Column",
    );
    if (!done) return node;

    const items = arrayItems?.children ?? [];

    const unwrapColumns = items.reduce<TreeNode[]>((list, column) => {
      const properties = column.children ?? [];
      // 约定 ArrayTable. 开头的组件都是 ArrayTable 的辅助组件
      const clean = properties.filter(
        (n) => !/^ArrayTable\./.test(getNodeProps(n, "x-component")),
      );
      list.push(...clean);
      return list;
    }, []);

    const itemsWrapNode = new TreeNode({
      componentName: "Field",
      props: {
        type: "object",
      },
    });

    itemsWrapNode.prepend(...unwrapColumns);

    // todo: 验证 , 通过reset 同时也应该去掉了 properties 上的 addition
    node.setChildren(itemsWrapNode);
  },
};

const ArrayCards: Transformer = {
  accepts: ["array"],
  // match: (node: TreeNode) => {
  //   return getNodeProps(node, "x-component") === "ArrayCards";
  // },
  transform: (node: TreeNode) => {
    const arrayItems = node.children?.[0];
    const done = arrayItems?.children?.find?.((x) =>
      /^ArrayCards\./.test(getNodeProps(x, "x-component")),
    );
    if (done) return node;

    let items = arrayItems;

    if (!/object|array/.test(getNodeProps(arrayItems, "type"))) {
      // @see https://antd.formilyjs.org/zh-CN/components/array-cards
      // JSON Schema 案例 字符串数组
      items = new TreeNode(
        {
          componentName: "Field",
          props: {
            type: "void",
          },
        },
        node,
      );
      items.append(arrayItems.clone());
    }

    const actions = ["MoveUp", "MoveDown", "Remove"].map((Action) => {
      return new TreeNode(
        {
          componentName: "Field",
          props: {
            type: "void",
            "x-component": `ArrayCards.${Action}`,
          },
        },
        arrayItems,
      );
    });

    const addition = new TreeNode({
      componentName: "Field",
      props: {
        type: "void",
        title: "添加条目",
        "x-component": "ArrayCards.Addition",
      },
    });

    items.prepend(
      new TreeNode({
        componentName: "Field",
        props: {
          type: "void",
          "x-component": "ArrayCards.Index",
        },
      }),
    );
    items.append(...actions);

    node.setChildren(items, addition);

    return node;
  },
  reset: (node: TreeNode) => {
    // if (!ArrayCards.match(node)) return node;
    const arrayItems = node.children?.[0];
    const done = arrayItems?.children?.find?.(
      (x) => !/^ArrayCards\./.test(getNodeProps(x, "x-component")),
    );
    if (!done) return node;

    let items = arrayItems;

    const children = arrayItems?.children ?? [];
    const clean = children.filter(
      (n) => !/^ArrayCards\./.test(getNodeProps(n, "x-component")),
    );

    if (getNodeProps(items, "type") === "void") {
      items = clean[0];
    } else {
      items.setChildren(...clean);
    }
    node.setChildren(items);
  },
};

const ArrayItems: Transformer = {
  accepts: ["array"],
  // match: (node: TreeNode) => {
  //   return getNodeProps(node, "x-component") === "ArrayItems";
  // },
  transform: (node: TreeNode) => {
    const arrayItems = node.children?.[0];
    const done = arrayItems?.children?.find?.((x) =>
      /^ArrayItems\./.test(getNodeProps(x, "x-component")),
    );
    if (done) return node;

    let items = arrayItems;

    if (/object|array/.test(getNodeProps(arrayItems, "type"))) {
      // @see https://antd.formilyjs.org/zh-CN/components/array-cards
      // JSON Schema 案例 字符串数组
      items = new TreeNode(
        {
          componentName: "Field",
          props: {
            type: "void",
          },
        },
        node,
      );
      items.append(arrayItems.clone());
    }

    const actions = ["MoveUp", "MoveDown", "Remove"].map((Action) => {
      return new TreeNode(
        {
          componentName: "Field",
          props: {
            type: "void",
            "x-component": `ArrayItems.${Action}`,
          },
        },
        arrayItems,
      );
    });

    const addition = new TreeNode({
      componentName: "Field",
      props: {
        type: "void",
        title: "添加条目",
        "x-component": "ArrayItems.Addition",
      },
    });

    items.prepend(
      new TreeNode({
        componentName: "Field",
        props: {
          type: "void",
          "x-component": "ArrayItems.Index",
        },
      }),
    );
    items.append(...actions);

    node.setChildren(items, addition);

    return node;
  },
  reset: (node: TreeNode) => {
    // if (!ArrayItems.match(node)) return node;
    const arrayItems = node.children?.[0];
    const done = arrayItems?.children?.find?.((x) =>
      /^ArrayItems\./.test(getNodeProps(x, "x-component")),
    );
    if (done) return node;

    let items = arrayItems;

    const children = arrayItems?.children ?? [];
    const clean = children.filter((n) =>
      /^ArrayItems\./.test(n.props?.["x-component"]),
    );

    if (getNodeProps(items, "type") === "void") {
      items = clean[0];
    } else {
      items.setChildren(...clean);
    }
    node.setChildren(items);
  },
};

const FormGrid: Transformer = {
  accepts: ["void", "object"],
  // match: (node) => {
  //   return getNodeProps(node, "x-component") === "FormGrid";
  // },
  transform: (node) => {
    const props = node.props["x-components-props"];
    node.props["x-components-props"] = {
      ...props,
      _memo: props,
      minColumns: 1,
      maxColumns: 3,
    };
    return node;
  },
  reset: (node) => {
    // if (!FormGrid.match(node)) return node;
    const props = node.props["x-components-props"];
    node.props["x-components-props"] = { ...props._memo };
    return node;
  },
};

export const transformers = {
  ArrayTable,
  ArrayCards,
  ArrayItems,
  FormGrid,
  Input: {
    accepts: ["string", "number", "boolean", "object"],
  },
} satisfies Record<string, Transformer>;

export const getTransformer = (node: TreeNode): Transformer | undefined => {
  const maybe = Object.keys(transformers).find((Component) => {
    return getNodeProps(node, "x-component") === Component;
  });
  return transformers[maybe];
};

export const getComponentList = (node: TreeNode) => {
  const list = Object.keys(transformers).reduce((list, Component) => {
    const accapt = transformers[Component].accepts.includes(
      getNodeProps(node, "type"),
    );
    if (accapt) {
      list.push(Component);
    }
    return list;
  }, []);
  return list;
};
