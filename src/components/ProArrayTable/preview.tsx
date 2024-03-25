import { createBehavior, createResource } from "@duckform/core";
import {
  DnFC,
  DroppableWidget,
  TreeNodeWidget,
  useDesigner,
  useNodeIdProps,
  useTreeNode,
} from "@duckform/react";
import { observer } from "@formily/react";
import { Space, Table, TableProps } from "antd";
import cls from "classnames";
import React, { useEffect, useRef } from "react";
import { LoadTemplate } from "../../common/LoadTemplate";
import { useDropTemplate } from "../../hooks";
import { createFieldSchema, createVoidFieldSchema } from "../Field";
import { actions, dropTemplate, init, query, shadowHelper } from "./helper";
import * as locales from "./locale";
import * as schemas from "./schema";
import "./styles.less";
import { mixin } from "./mixin";
import { Flex } from "@pro.formily/antd/dist/esm/pro-array-table/mixin.pro";

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

export const ProArrayTable: DnFC<TableProps<any>> = observer((props) => {
  const node = useTreeNode();
  const nodeId = useNodeIdProps();

  // useDropTemplate("ProArrayTable", dropTemplate);

  useEffect(() => {
    init(node);
  }, []);

  const columns = query.columns(node);
  const additions = query.addtions(node);

  const defaultRowKey = () => {
    return node.id;
  };

  const renderTable = () => {
    if (node.children.length === 0) return <DroppableWidget />;
    return (
      <div>
        <Flex end>
          {additions.map((child) => {
            return <TreeNodeWidget node={child} key={child.id} />;
          })}
        </Flex>
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
                  return children.length > 0 ? children : "Droppable";
                }}
              />
            );
          })}
          {columns.length === 0 && (
            <Table.Column render={() => <DroppableWidget />} />
          )}
        </Table>
      </div>
    );
  };

  useDropTemplate("ProArrayTable.Column", (source) => {
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
            onClick: () => actions.addSort(node),
          },
          {
            title: node.getMessage("addIndex"),
            icon: "AddIndex",
            onClick: () => actions.addIndex(node),
          },
          {
            title: node.getMessage("addColumn"),
            icon: "AddColumn",
            onClick: () => actions.addColumn(node),
          },
          {
            title: node.getMessage("addOperation"),
            icon: "AddOperation",
            onClick: () => actions.addOp(node),
          },
          {
            title: "添加 Addtion",
            icon: "AddOperation",
            onClick: () => actions.addProAddtion(node),
          },
          {
            title: "添加行编辑",
            icon: "AddOperation",
            onClick: () => actions.addRowPopup(node),
          },
        ]}
      />
    </div>
  );
});

const PREFIX = "ProArrayTable";
mixin(ProArrayTable);

ProArrayTable.Behavior = createBehavior(
  {
    name: PREFIX,
    extends: ["Field"],
    selector: (node) => node.props?.["x-component"] === PREFIX,
    designerProps: {
      droppable: true,
      propsSchema: createFieldSchema(schemas.ProArrayTable),
    },
    designerLocales: locales.ProArrayTable,
  },
  {
    name: `${PREFIX}.Column`,
    extends: ["Field"],
    selector: (node) => node.props!["x-component"] === `${PREFIX}.Column`,
    designerProps: {
      droppable: true,
      allowDrop: (node) => node?.props?.["x-component"] === PREFIX,
      propsSchema: createVoidFieldSchema(schemas.Column),
    },
    designerLocales: locales.Column,
  },
  {
    name: `${PREFIX}.DelegateAction`,
    extends: ["Field"],
    selector: (node) =>
      node.props!["x-component"] === `${PREFIX}.DelegateAction`,
    designerProps: {
      droppable: true,
      allowDrop: (node) => node?.props?.["x-component"] === PREFIX,
      propsSchema: createVoidFieldSchema(schemas.DelegateAction),
    },
    designerLocales: locales.DelegateAction,
  },
  {
    name: `${PREFIX}.Addition`,
    extends: ["Field"],
    selector: (node) => node.props!["x-component"] === `${PREFIX}.Addition`,
    designerProps: {
      droppable: true,
      allowDrop: (node) => node?.props?.["x-component"] === PREFIX,
      propsSchema: createVoidFieldSchema(schemas.Addition),
    },
    designerLocales: locales.Addition,
  },

  {
    name: `${PREFIX}.ProAddition`,
    extends: ["Field"],
    selector: (node) => node.props!["x-component"] === `${PREFIX}.ProAddition`,
    designerProps: {
      droppable: true,
      allowDrop: (node) => node?.props?.["x-component"] === PREFIX,
      // propsSchema: createVoidFieldSchema(schemas.ProArrayTable.ProAddition),
      propsSchema: createVoidFieldSchema(schemas.ProAddition),
    },
    designerLocales: locales.ProAddition,
  },
  {
    name: `${PREFIX}.Remove`,
    extends: ["Field"],
    selector: (node) => node.props!["x-component"] === `${PREFIX}.Remove`,
    designerProps: {
      droppable: true,
      allowDrop: (node) => node?.props?.["x-component"] === PREFIX,
      propsSchema: createVoidFieldSchema(schemas.Remove),
    },
    designerLocales: locales.Remove,
  },
  {
    name: `${PREFIX}.MoveUp`,
    extends: ["Field"],
    selector: (node) => node.props!["x-component"] === `${PREFIX}.MoveUp`,
    designerProps: {
      droppable: true,
      allowDrop: (node) => node?.props?.["x-component"] === PREFIX,
      // propsSchema: createVoidFieldSchema(schemas.ProArrayTable.MoveUp),
      propsSchema: createVoidFieldSchema(),
    },
    designerLocales: locales.MoveUp,
  },
  {
    name: `${PREFIX}.MoveDown`,
    extends: ["Field"],
    selector: (node) => node.props!["x-component"] === `${PREFIX}.MoveDown`,
    designerProps: {
      droppable: true,
      allowDrop: (node) => node?.props?.["x-component"] === PREFIX,
      // propsSchema: createVoidFieldSchema(schemas.ProArrayTable.MoveDown),
      propsSchema: createVoidFieldSchema(),
    },
    designerLocales: locales.MoveDown,
  },
);

ProArrayTable.Resource = createResource({
  icon: "ArrayTableSource",
  elements: [
    {
      componentName: "Field",
      props: {
        type: "array",
        "x-decorator": "FormItem",
        "x-component": "ProArrayTable",
      },
    },
  ],
});
