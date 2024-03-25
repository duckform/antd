import { TreeNode, createBehavior, createResource } from "@duckform/core";
import {
  DnFC,
  DroppableWidget,
  TreeNodeWidget,
  useNodeIdProps,
  useTreeNode,
} from "@duckform/react";
import { ArrayBase as AntdArrayBase } from "@formily/antd";
import { observer } from "@formily/react";
import { Table, TableProps } from "antd";
import cls from "classnames";
import React from "react";
import { LoadTemplate } from "../../common/LoadTemplate";
import { useDropTemplate } from "../../hooks";
import * as locales from "./locale";
import * as schemas from "./schema";
import {
  createEnsureTypeItemsNode,
  findNodeByComponentPath,
  hasNodeByComponentPath,
  queryNodesByComponentPath,
} from "../../shared";
import { createArrayBehavior } from "../../common/ArrayBase";
import { createVoidFieldSchema } from "../Field";
import "./styles.less";
const ArrayBase = AntdArrayBase as Required<typeof AntdArrayBase> &
  typeof AntdArrayBase;

const ensureObjectItemsNode = createEnsureTypeItemsNode("object");

const HeaderCell: React.FC = (props: any) => {
  return (
    <th
      {...props}
      data-designer-node-id={props.className.match(/data-id\:([^\s]+)/)?.[1]}
    >
      {props.children}
    </th>
  );
};

const BodyCell: React.FC = (props: any) => {
  return (
    <td
      {...props}
      data-designer-node-id={props.className.match(/data-id\:([^\s]+)/)?.[1]}
    >
      {props.children}
    </td>
  );
};

export const ArrayTable: DnFC<TableProps<any>> = observer((props) => {
  const node = useTreeNode();
  const nodeId = useNodeIdProps();
  useDropTemplate("ArrayTable", (source) => {
    const sortHandleNode = new TreeNode({
      componentName: "Field",
      props: {
        type: "void",
        "x-component": "ArrayTable.Column",
        "x-component-props": {
          title: "Title",
        },
      },
      children: [
        {
          componentName: "Field",
          props: {
            type: "void",
            "x-component": "ArrayTable.SortHandle",
          },
        },
      ],
    });
    const indexNode = new TreeNode({
      componentName: "Field",
      props: {
        type: "void",
        "x-component": "ArrayTable.Column",
        "x-component-props": {
          title: "Title",
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
    });
    const columnNode = new TreeNode({
      componentName: "Field",
      props: {
        type: "void",
        "x-component": "ArrayTable.Column",
        "x-component-props": {
          title: "Title",
        },
      },
      children: source.map((node) => {
        node.props!["title"] = undefined;
        return node;
      }),
    });

    const operationNode = new TreeNode({
      componentName: "Field",
      props: {
        type: "void",
        "x-component": "ArrayTable.Column",
        "x-component-props": {
          title: "Title",
        },
      },
      children: [
        {
          componentName: "Field",
          props: {
            type: "void",
            "x-component": "ArrayTable.Remove",
          },
        },
        {
          componentName: "Field",
          props: {
            type: "void",
            "x-component": "ArrayTable.MoveDown",
          },
        },
        {
          componentName: "Field",
          props: {
            type: "void",
            "x-component": "ArrayTable.MoveUp",
          },
        },
      ],
    });
    const objectNode = new TreeNode({
      componentName: "Field",
      props: {
        type: "object",
      },
      children: [sortHandleNode, indexNode, columnNode, operationNode],
    });
    const additionNode = new TreeNode({
      componentName: "Field",
      props: {
        type: "void",
        title: "Addition",
        "x-component": "ArrayTable.Addition",
      },
    });
    return [objectNode, additionNode];
  });
  const columns = queryNodesByComponentPath(node, [
    "ArrayTable",
    "*",
    "ArrayTable.Column",
  ]);
  const additions = queryNodesByComponentPath(node, [
    "ArrayTable",
    "ArrayTable.Addition",
  ]);
  const defaultRowKey = () => {
    return node.id;
  };

  const renderTable = () => {
    if (node.children.length === 0) return <DroppableWidget />;
    return (
      <ArrayBase disabled>
        <Table
          size="small"
          bordered
          {...props}
          scroll={{ x: "100%" }}
          className={cls("ant-formily-array-table", props.className)}
          style={{ marginBottom: 10, ...props.style }}
          rowKey={defaultRowKey}
          dataSource={[{ id: "1" }]}
          pagination={false}
          components={{
            header: {
              cell: HeaderCell,
            },
            body: {
              cell: BodyCell,
            },
          }}
        >
          {columns.map((node) => {
            const children = node.children.map((child) => {
              return <TreeNodeWidget node={child} key={child.id} />;
            });
            const props = node.props!["x-component-props"];
            return (
              <Table.Column
                {...props}
                title={
                  <div data-content-editable="x-component-props.title">
                    {props.title}
                  </div>
                }
                dataIndex={node.id}
                className={`data-id:${node.id}`}
                key={node.id}
                render={(value, record, key) => {
                  return (
                    <ArrayBase.Item key={key} index={key} record={null!}>
                      {children.length > 0 ? children : "Droppable"}
                    </ArrayBase.Item>
                  );
                }}
              />
            );
          })}
          {columns.length === 0 && (
            <Table.Column render={() => <DroppableWidget />} />
          )}
        </Table>
        {additions.map((child) => {
          return <TreeNodeWidget node={child} key={child.id} />;
        })}
      </ArrayBase>
    );
  };

  useDropTemplate("ArrayTable.Column", (source) => {
    return source.map((node) => {
      node.props!["title"] = undefined;
      return node;
    });
  });

  return (
    <div {...nodeId} className="dn-array-table">
      {renderTable()}
      <LoadTemplate
        actions={[
          {
            title: node.getMessage("addSortHandle"),
            icon: "AddSort",
            onClick: () => {
              if (
                hasNodeByComponentPath(node, [
                  "ArrayTable",
                  "*",
                  "ArrayTable.Column",
                  "ArrayTable.SortHandle",
                ])
              )
                return;
              const tableColumn = new TreeNode({
                componentName: "Field",
                props: {
                  type: "void",
                  "x-component": "ArrayTable.Column",
                  "x-component-props": {
                    title: "Title",
                  },
                },
                children: [
                  {
                    componentName: "Field",
                    props: {
                      type: "void",
                      "x-component": "ArrayTable.SortHandle",
                    },
                  },
                ],
              });
              ensureObjectItemsNode(node).prepend(tableColumn);
            },
          },
          {
            title: node.getMessage("addIndex"),
            icon: "AddIndex",
            onClick: () => {
              if (
                hasNodeByComponentPath(node, [
                  "ArrayTable",
                  "*",
                  "ArrayTable.Column",
                  "ArrayTable.Index",
                ])
              )
                return;
              const tableColumn = new TreeNode({
                componentName: "Field",
                props: {
                  type: "void",
                  "x-component": "ArrayTable.Column",
                  "x-component-props": {
                    title: "Title",
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
              });
              const sortNode = findNodeByComponentPath(node, [
                "ArrayTable",
                "*",
                "ArrayTable.Column",
                "ArrayTable.SortHandle",
              ]);
              if (sortNode) {
                sortNode.parent.insertAfter(tableColumn);
              } else {
                ensureObjectItemsNode(node).prepend(tableColumn);
              }
            },
          },
          {
            title: node.getMessage("addColumn"),
            icon: "AddColumn",
            onClick: () => {
              const operationNode = findNodeByComponentPath(node, [
                "ArrayTable",
                "*",
                "ArrayTable.Column",
                (name) => {
                  return (
                    name === "ArrayTable.Remove" ||
                    name === "ArrayTable.MoveDown" ||
                    name === "ArrayTable.MoveUp"
                  );
                },
              ]);
              const tableColumn = new TreeNode({
                componentName: "Field",
                props: {
                  type: "void",
                  "x-component": "ArrayTable.Column",
                  "x-component-props": {
                    title: "Title",
                  },
                },
              });
              if (operationNode) {
                operationNode.parent.insertBefore(tableColumn);
              } else {
                ensureObjectItemsNode(node).append(tableColumn);
              }
            },
          },
          {
            title: node.getMessage("addOperation"),
            icon: "AddOperation",
            onClick: () => {
              const oldOperationNode = findNodeByComponentPath(node, [
                "ArrayTable",
                "*",
                "ArrayTable.Column",
                (name) => {
                  return (
                    name === "ArrayTable.Remove" ||
                    name === "ArrayTable.MoveDown" ||
                    name === "ArrayTable.MoveUp"
                  );
                },
              ]);
              const oldAdditionNode = findNodeByComponentPath(node, [
                "ArrayTable",
                "ArrayTable.Addition",
              ]);
              if (!oldOperationNode) {
                const operationNode = new TreeNode({
                  componentName: "Field",
                  props: {
                    type: "void",
                    "x-component": "ArrayTable.Column",
                    "x-component-props": {
                      title: "Title",
                    },
                  },
                  children: [
                    {
                      componentName: "Field",
                      props: {
                        type: "void",
                        "x-component": "ArrayTable.Remove",
                      },
                    },
                    {
                      componentName: "Field",
                      props: {
                        type: "void",
                        "x-component": "ArrayTable.MoveDown",
                      },
                    },
                    {
                      componentName: "Field",
                      props: {
                        type: "void",
                        "x-component": "ArrayTable.MoveUp",
                      },
                    },
                  ],
                });
                ensureObjectItemsNode(node).append(operationNode);
              }
              if (!oldAdditionNode) {
                const additionNode = new TreeNode({
                  componentName: "Field",
                  props: {
                    type: "void",
                    title: "Addition",
                    "x-component": "ArrayTable.Addition",
                  },
                });
                ensureObjectItemsNode(node).insertAfter(additionNode);
              }
            },
          },
        ]}
      />
    </div>
  );
});

ArrayBase.mixin(ArrayTable);

ArrayTable.Behavior = createBehavior(
  createArrayBehavior("ArrayTable", schemas.ArrayTable, locales.ArrayTable),
  {
    name: "ArrayTable.Column",
    extends: ["Field"],
    selector: (node) => node.props!["x-component"] === "ArrayTable.Column",
    designerProps: {
      droppable: true,
      allowDrop: (node) =>
        node.props!["type"] === "object" &&
        node.parent?.props?.["x-component"] === "ArrayTable",
      propsSchema: createVoidFieldSchema(schemas.ArrayTable.Column),
    },
    designerLocales: locales.ArrayTableColumn,
  },
);

ArrayTable.Resource = createResource({
  icon: "ArrayTableSource",
  elements: [
    {
      componentName: "Field",
      props: {
        type: "array",
        "x-decorator": "FormItem",
        "x-component": "ArrayTable",
      },
    },
  ],
});
