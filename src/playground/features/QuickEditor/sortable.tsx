import {
  DndContext,
  PointerSensor,
  closestCorners,
  useDndMonitor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TreeNode } from "@duckform/core";
import { observer } from "@formily/reactive-react";
import React, { useEffect, useState } from "react";
import { getComponentList, getTransformer } from "./transformers";
import { Button, Popconfirm, Popover, Select, Space, Tag } from "antd";
import {
  DeleteOutlined,
  MenuOutlined,
  PlusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const DropingInto = {
  id: "",
  to: "",
};
const getColor = (x: string) => {
  switch (x) {
    case "string":
      return "green";
    case "number":
      return "geekblue";
    case "boolean":
      return "yellow";
    case "object":
      return "purple";
    case "array":
      return "magenta";
    default:
      return "default";
  }
};
const NodeEditor = observer(
  (props: {
    id: string;
    node: TreeNode;
  }) => {
    const node = props.node;
    const options = getComponentList(node).map((item) => {
      return {
        label: item,
        value: item,
        key: item,
      };
    });
    useEffect(() => {
      if (!node.props["x-component"] && options.length > 0) {
        onSelectComponent(options[0].value);
      }
    }, []);
    const onSelectComponent = (component: string) => {
      const Component = node.props["x-component"];
      if (Component) {
        const reseter = getTransformer(node);
        if (reseter?.reset) {
          reseter.reset(node);
        }
      }
      node.props["x-component"] = component;
      const transformer = getTransformer(node);
      if (transformer?.transform) {
        transformer.transform(node);
      }
    };

    const addVoid = () => {
      node.prepend(
        new TreeNode(
          {
            componentName: "Field",
            props: {
              type: "void",
            },
          },
          node,
        ),
      );
    };

    const addWrappedVoid = () => {
      const children = node.children;
      const wrapper = new TreeNode(
        {
          componentName: "Field",
          props: {
            type: "void",
          },
        },
        node,
      );
      wrapper.setChildren(...children);
      node.setChildren(wrapper);
    };

    const remove = () => {
      node.remove();
    };

    const removeWrapper = () => {
      const parent = node.parent;
      const children = node.children;
      const slibings = node.siblings;
      const index = node.index;
      slibings.splice(index, 0, ...children);
      parent.setChildren(...slibings);
    };

    return (
      <Space style={{ display: "flex" }}>
        <Select
          options={options}
          style={{ width: "200px" }}
          value={node?.props?.["x-component"] ?? ""}
          onSelect={onSelectComponent}
        ></Select>
        {/object|void/.test(node.props.type) ? (
          <Space>
            <Popover
              title="添加 void 节点"
              content={
                <Space>
                  <Button type="link" onClick={addVoid}>
                    添加 Void 节点
                  </Button>
                  <Button type="link" onClick={addWrappedVoid}>
                    添加 Void 容器
                  </Button>
                </Space>
              }
            >
              <Button type="link" icon={<PlusOutlined></PlusOutlined>}></Button>
            </Popover>
          </Space>
        ) : (
          <Button></Button>
        )}
        <Popover
          title="删除"
          content={
            <Space>
              <Popconfirm
                title="确定要删除当前节点吗? 所有子节点会一并被删除!!"
                onConfirm={remove}
                okText="是的, 我确定"
              >
                <Button type="link">删除节点</Button>
              </Popconfirm>

              <Button type="link" onClick={removeWrapper}>
                删除节点保留子节点
              </Button>
            </Space>
          }
        >
          <Button type="link" icon={<DeleteOutlined></DeleteOutlined>}></Button>
        </Popover>
      </Space>
    );
  },
);

const useDragStyle = (
  sortinfo: ReturnType<typeof useSortable>,
  node: TreeNode,
) => {
  const { transform, transition, isDragging } = sortinfo;

  const itemStyle: React.CSSProperties = {
    position: "relative",
    touchAction: "none",
    zIndex: 1,
    transform: `translate3d(${transform?.x || 0}px, ${transform?.y || 0}px, 0)`,
    transition: `${transform ? "all 200ms ease" : ""}`,
  };
  const dragStyle: React.CSSProperties = {
    transition,
    opacity: "0.8",
    transform: `translate3d(${transform?.x || 0}px, ${transform?.y || 0}px, 0)`,
  };

  const computedStyle = isDragging
    ? {
        ...itemStyle,
        ...dragStyle,
        paddingLeft: node.depth * 16,
        paddingBottom: 8,
      }
    : {
        ...itemStyle,
        paddingLeft: node.depth * 16,
        paddingBottom: 8,
      };

  return computedStyle;
};

export const SortableItem = observer(
  (props: {
    id: string;
    node: TreeNode;
    takeNode: (id: string) => TreeNode | undefined;
    takePrev: (id: string) => TreeNode | undefined;
    takeNext: (id: string) => TreeNode | undefined;
  }) => {
    const sortInfo = useSortable({
      id: props.id,
    });
    const { attributes, listeners, setNodeRef, items } = sortInfo;
    const [overState, setOverState] = useState("");
    const node = props.node;

    useDndMonitor({
      onDragMove: ({ active, over }) => {
        if (!active || !over) return setOverState("");
        if (active.id === over.id) return setOverState("");
        const activeIndex = items.findIndex((x) => active.id === x);
        const overIndex = items.findIndex((x) => over.id === x);
        const isBefore = overIndex < activeIndex;
        // 之前和之后表现是不一样的
        if (isBefore) {
          const activeRect = active.rect.current.translated;
          const activeNode = props.takeNode(active.id.toString());

          const overRect = over.rect;
          const overNode = props.takeNode(over.id.toString());

          if (!overNode || !activeNode) return setOverState("");
          const activeLeft = activeRect.left - activeNode.depth * 16;
          const overLeft = overRect.left - overNode.depth * 16;
          const left = activeLeft - overLeft;

          const isLeft = left < 0;
          if (isLeft && over.id === props.id) {
            DropingInto.to = "before";
            DropingInto.id = props.id;
            return setOverState("before");
          }
          const preNode = props.takePrev(over.id.toString());
          if (!preNode) return setOverState("");
          if (!isLeft && preNode.id === props.id) {
            DropingInto.to = "after";
            DropingInto.id = props.id;
            setOverState("after");
          } else {
            setOverState("");
          }
        } else {
          const activeRect = active.rect.current.translated;
          const activeNode = props.takeNode(active.id.toString());

          const overRect = over.rect;
          const overNode = props.takeNode(over.id.toString());

          if (!overNode || !activeNode) return setOverState("");
          const activeLeft = activeRect.left - activeNode.depth * 16;
          const overLeft = overRect.left - overNode.depth * 16;
          const left = activeLeft - overLeft;
          const isRight = left > 0;
          if (isRight && over.id === props.id) {
            DropingInto.to = "after";
            DropingInto.id = props.id;
            return setOverState("after");
          } else {
            const nextNode = props.takeNext(over.id.toString());
            if (!isRight && nextNode?.id === props.id) {
              DropingInto.to = "before";
              DropingInto.id = props.id;
              return setOverState("before");
            } else {
              setOverState("");
            }
          }
        }
      },
      onDragEnd: (event) => {
        setOverState("");
      },
      onDragCancel: (event) => {
        setOverState("");
      },
    });

    const style = useDragStyle(sortInfo, props.node);

    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              height: 4,
              marginLeft: -8,
              width: "100%",
              background: overState === "before" ? "green" : "transparent",
            }}
          ></div>
          <Space>
            <Button type="text" icon={<MenuOutlined></MenuOutlined>}></Button>
            {node.props.name ?? ""}
            <Tag color={getColor(node.props.type)}>{node.props.type}</Tag>
          </Space>
          <div
            style={{
              height: 4,
              width: "100%",
              marginLeft: 20,
              background: overState === "after" ? "blue" : "transparent",
            }}
          ></div>
        </div>
      </div>
    );
  },
);

export const SortableBox = observer(
  (props: {
    root: TreeNode;
  }) => {
    const root = props.root;
    const items = root ? root.descendants : [];
    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          // delay: 300,
          distance: 0.01,
        },
      }),
    );

    const takeNode = (id: string) => items.find((x) => x.id === id);
    const takePrev = (id: string) => {
      const idx = items.findIndex((x) => x.id === id);
      if (idx < 0) return undefined;
      const prev = items[idx - 1];
      return prev;
    };
    const takeNext = (id: string) => {
      const idx = items.findIndex((x) => x.id === id);
      const next = items[idx + 1];
      return next;
    };

    const handleDragEnd: React.ComponentProps<typeof DndContext>["onDragEnd"] =
      (event) => {
        const { active, over } = event;
        if (!active || !over) return;
        if (active.id === over.id) return;
        const fromNode = items.find((x) => x.id === active.id);
        const toNode = items.find((x) => x.id === DropingInto.id);
        const isBefore = DropingInto.to === "before";

        if (isBefore) {
          toNode.insertBefore(fromNode.clone());
        } else {
          toNode.prepend(fromNode.clone());
        }
        fromNode.remove();
      };

    return items.length > 0 ? (
      <div>
        <div>
          <Space>
            ROOT
            <Tag color={getColor(root.props.type)}>{root.props.type}</Tag>
            <NodeEditor id={root.id} node={root}></NodeEditor>
          </Space>
        </div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {items.map((node) => (
              <div key={node.id} style={{ display: "flex" }}>
                <SortableItem
                  key={node.id}
                  id={node.id}
                  takePrev={takePrev}
                  takeNext={takeNext}
                  takeNode={takeNode}
                  node={node}
                />
                <NodeEditor id={node.id} node={node}></NodeEditor>
              </div>
            ))}
          </SortableContext>
        </DndContext>
      </div>
    ) : null;
  },
);
