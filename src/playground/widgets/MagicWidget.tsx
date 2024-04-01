import {
  QuestionCircleOutlined,
  SwapOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { TreeNode } from "@duckform/core";
import {
  NodeTitleWidget,
  OutlineTreeWidget,
  useDesigner,
} from "@duckform/react";
import { observer } from "@formily/react";
import {
  Breadcrumb,
  Button,
  Drawer,
  Popover,
  Radio,
  Space,
  Tooltip,
} from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { QuickEditor } from "../features/QuickEditor";

const schemaTreeToTreeNode = (node: TreeNode) => {
  delete node.props.state;
  delete node.props.required;
  delete node.props["x-component-options"];
  if (node.children) {
    node.children.forEach((t) => schemaTreeToTreeNode(t));
  }
};

const insertToParent = (
  parent: TreeNode,
  tree: TreeNode,
  includeRoot?: boolean,
) => {
  schemaTreeToTreeNode(tree);
  let root: TreeNode[];
  if (!includeRoot) {
    root = tree.children.map((item) => TreeNode.create(item, parent));
  } else {
    root = [TreeNode.create(tree, parent)];
  }

  parent.append(...root);
};

const takeNode = (node: TreeNode) => {
  if (node.componentName === "$$ResourceNode$$") {
    return node.children[0];
  }
  return node;
};
const takeParents = (node: TreeNode): string[] => {
  let last = takeNode(node);
  const names = [last.getMessage("title") || last.componentName];
  while (last.parent) {
    last = last.parent;
    names.push(last.getMessage("title") || last.componentName);
  }
  return names.filter(Boolean).reverse();
};

export const MagicWidget = observer(() => {
  const designer = useDesigner();
  const [currentNode, setCurrentNode] = useState<TreeNode | null>(null);
  useEffect(() => {
    const dispose = designer.subscribe((payload) => {
      if (payload.type === "select:node") {
        setCurrentNode(payload.data?.source?.[0]);
      }
    });
    return dispose;
  }, [designer]);

  const names = useMemo(() => {
    if (!currentNode) return [""];
    return takeParents(currentNode);
  }, [currentNode]);

  const tree = useRef<TreeNode>();

  const boxing = useRef(true);

  const [magicOpen, setMagicOpen] = useState(false);

  const canAppend = useMemo(() => {
    const nodeType = currentNode?.props?.type;
    return nodeType === "void" || nodeType === "object";
  }, [currentNode]);

  return (
    <React.Fragment>
      <Button
        type="primary"
        icon={<ThunderboltOutlined></ThunderboltOutlined>}
        onClick={() => {
          setMagicOpen(true);
        }}
      >
        快速创建
      </Button>

      <Drawer
        width="960px"
        title="⚡快速创建"
        open={magicOpen}
        bodyStyle={{ padding: 16 }}
        onClose={() => setMagicOpen(false)}
        extra={
          <Space>
            <Button
              type="link"
              onClick={() => {
                console.log("tree.current", tree.current);
                insertToParent(
                  designer.getCurrentTree().root,
                  tree.current,
                  boxing.current,
                );
                setMagicOpen(false);
              }}
              icon={<ThunderboltOutlined></ThunderboltOutlined>}
            >
              添加到根节点
            </Button>
            {currentNode ? (
              <Button
                type={canAppend ? "link" : "text"}
                disabled={!canAppend}
                onClick={() => {
                  insertToParent(currentNode, tree.current, boxing.current);
                  setMagicOpen(false);
                }}
                icon={
                  canAppend ? (
                    <ThunderboltOutlined></ThunderboltOutlined>
                  ) : (
                    <Tooltip title="只有 void / object 对象可以追加子节点 ">
                      <QuestionCircleOutlined></QuestionCircleOutlined>
                    </Tooltip>
                  )
                }
              >
                添加到 <b>[{names[names.length - 1]}]</b>
              </Button>
            ) : null}
          </Space>
        }
      >
        <Space style={{ display: "flex", justifyContent: "space-between" }}>
          <Popover
            trigger={["click"]}
            placement="bottomLeft"
            title="重新选择"
            destroyTooltipOnHide
            content={
              <OutlineTreeWidget
                renderTitle={(iter) => {
                  const isActive = iter.id === currentNode?.id;
                  return (
                    <div style={{ color: isActive ? "#1890ff" : "" }}>
                      <NodeTitleWidget node={iter}></NodeTitleWidget>
                    </div>
                  );
                }}
              ></OutlineTreeWidget>
            }
          >
            <div
              style={{
                display: "flex",
                paddingLeft: 16,
                paddingTop: 16,
                gap: 8,
              }}
            >
              <SwapOutlined></SwapOutlined>
              <Breadcrumb>
                {names.map((item, idx) => (
                  <Breadcrumb.Item key={`${item}${idx}`}>
                    {item}
                  </Breadcrumb.Item>
                ))}
              </Breadcrumb>
            </div>
          </Popover>
          <Radio.Group
            optionType="button"
            buttonStyle="solid"
            defaultValue={boxing.current}
            onChange={(e) => {
              boxing.current = e.target.value;
            }}
            options={[
              { label: "包含根对象节点", value: true },
              { label: "排除根对象节点", value: false },
            ]}
          ></Radio.Group>
        </Space>
        <QuickEditor tree={tree}></QuickEditor>
      </Drawer>
    </React.Fragment>
  );
});
