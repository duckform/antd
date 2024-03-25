import { EditOutlined, QuestionOutlined } from "@ant-design/icons";
import { TreeNode } from "@duckform/core";
import {
  DnFC,
  DroppableWidget,
  useDesigner,
  useTreeNode,
} from "@duckform/react";
import { observer } from "@formily/reactive-react";
import { Button, Modal, Space, Tooltip } from "antd";
import React, { useEffect, useState } from "react";

const Flex: React.FC<React.PropsWithChildren> = (props) => {
  return (
    <div {...props} style={style.flex}>
      {props.children}
    </div>
  );
};

const style = {
  button: {
    display: "inline-block",
  },
  smallBody: {
    padding: 4,
    paddingTop: 10,
  } as React.CSSProperties,
  fullWidth: {
    marginLeft: "370px",
    marginRight: "310px",
  } as React.CSSProperties,
  flex: {
    display: "flex",
  } as React.CSSProperties,
  flexEnd: {
    display: "flex",
    justifyContent: "flex-end",
  } as React.CSSProperties,
};

const printNode = (node: TreeNode) => {
  console.log(JSON.stringify(node.props, null, 2), node.children);
};

const getTitleFromParent = (node: TreeNode) => {
  let acc = node;
  const getTitle = (n: TreeNode) =>
    n?.props?.title || n?.props?.["x-component-props"]?.title;

  let title: string = getTitle(acc);

  while (acc && !title) {
    acc = acc.parent;
    title = getTitle(acc);
  }
  return title;
};

const cloneChildren = (node: TreeNode) => {
  let parent = node.parent;
  if (!parent) return;
  while (parent.props?.type !== "object" && parent.props?.type === "void") {
    parent = parent.parent;
  }
  if (parent.props.type !== "object") return;
  const clones: TreeNode[] = [];

  parent.eachChildren((child) => {
    // skip parent
    if (child.id === parent.id) return;
    // self
    if (child.id === node.id) return false;
    // void
    if (child.props.type === "void") return;

    const copy = child.clone(node);
    if (!copy.props?.title) {
      copy.props.title = getTitleFromParent(child.parent);
    }
    clones.push(copy);
    return true;
  });

  node.setChildren(...clones);
};

export const DesignModal: DnFC<
  React.PropsWithChildren<{
    title: string;
    okText: string;
    cancelText: string;
  }>
> = observer((props) => {
  const [open, setOpen] = useState(false);
  const designer = useDesigner();
  const node = useTreeNode();
  useEffect(() => {
    if (!open) return;
    // auto focus
    designer.workbench.activeWorkspace.operation.selection.select(node.id);
    if (node.children.length === 0) {
      cloneChildren(node);
    }
  }, [open]);

  return (
    <div
      data-designer-node-id={props["data-designer-node-id"]}
      style={style.button}
    >
      <Modal
        closeIcon={false}
        onCancel={() => {
          setOpen(false);
        }}
        style={style.fullWidth}
        width="auto"
        bodyStyle={style.smallBody}
        destroyOnClose
        maskStyle={{
          position: "absolute",
        }}
        getContainer={() =>
          document.querySelector(".dn-pc-simulator >.dn-viewport")
        }
        open={open}
        footer={null}
      >
        <DroppableWidget>
          <Flex>
            <h3
              style={style.smallBody}
              data-content-editable="x-component-props.title"
            >
              {props.title}
            </h3>
            <EditOutlined></EditOutlined>
          </Flex>
          {props.children}
          <Space style={style.flexEnd}>
            <Flex>
              <Button
                type="text"
                data-content-editable="x-component-props.cancelText"
              >
                {props.cancelText}
              </Button>
              <EditOutlined></EditOutlined>
            </Flex>
            <Flex>
              <Button
                type="link"
                data-content-editable="x-component-props.okText"
              >
                {props.okText}
              </Button>
              <EditOutlined></EditOutlined>
            </Flex>
          </Space>
        </DroppableWidget>
        <Space style={{ ...style.flexEnd, marginTop: 20 }}>
          <Button type="primary" onClick={() => setOpen(false)}>
            完成编辑
          </Button>
        </Space>
      </Modal>
      <div style={style.button}>
        <span data-content-editable="title">{node.props?.title}</span>
        <Button
          onClick={() => setOpen(true)}
          type="link"
          icon={<EditOutlined></EditOutlined>}
        >
          <Tooltip title="建议先设置对象字段属性名称">
            <QuestionOutlined></QuestionOutlined>
          </Tooltip>
        </Button>
      </div>
    </div>
  );
});
