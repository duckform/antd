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
import React, { useMemo, useState } from "react";

const dropInto = {
  id: "",
  to: "",
};

export const SortableItem = observer(
  (props: {
    id: string;
    node: TreeNode;
    takeNode: (id: string) => TreeNode | undefined;
    takePrev: (id: string) => TreeNode | undefined;
    takeNext: (id: string) => TreeNode | undefined;
  }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
      over,
      items,
    } = useSortable({ id: props.id });
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
            dropInto.to = "before";
            dropInto.id = props.id;
            return setOverState("before");
          }
          const preNode = props.takePrev(over.id.toString());
          if (!preNode) return setOverState("");
          if (!isLeft && preNode.id === props.id) {
            dropInto.to = "after";
            dropInto.id = props.id;
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
            dropInto.to = "after";
            dropInto.id = props.id;
            return setOverState("after");
          } else {
            const nextNode = props.takeNext(over.id.toString());
            if (!isRight && nextNode?.id === props.id) {
              dropInto.to = "before";
              dropInto.id = props.id;
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

    const style = useMemo(() => {
      const itemStyle: React.CSSProperties = {
        position: "relative",
        touchAction: "none",
        zIndex: 1,
        transform: `translate3d(${transform?.x || 0}px, ${
          transform?.y || 0
        }px, 0)`,
        transition: `${transform ? "all 200ms ease" : ""}`,
      };
      const dragStyle: React.CSSProperties = {
        transition,
        opacity: "0.8",
        transform: `translate3d(${transform?.x || 0}px, ${
          transform?.y || 0
        }px, 0)`,
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
    }, [isDragging, transform, transition]);

    return (
      <div
        style={{
          ...style,
        }}
        ref={setNodeRef}
        // style={style}
        {...attributes}
        {...listeners}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: 8,
          }}
        >
          <div>
            <span
              style={{
                color:
                  over?.id === props.id
                    ? "red"
                    : props.takePrev(over?.id?.toString())?.id === props.id
                      ? "green"
                      : props.takeNext(over?.id?.toString())?.id === props.id
                        ? "pink"
                        : null,
              }}
            >
              [{node.props.type}]
            </span>
            <span>/{overState}/</span>
            <span style={{ color: "rgba(0, 0, 0, 0.3)" }}>{node.id}</span>
          </div>
          <button
            type="button"
            onClick={(e) => {
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
            }}
          >
            add void
          </button>
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
        const { active, over, delta } = event;
        const isBefore = delta.x < 0;
        const fromNode = items.find((x) => x.id === active.id);
        const toNode = items.find((x) => x.id === over.id);
        console.log("dropito.id", dropInto);

        // if (active.id !== over.id) {
        //   if (isBefore) {
        //     toNode.insertBefore(fromNode.clone());
        //   } else {
        //     toNode.prepend(fromNode.clone());
        //   }
        //   fromNode.remove();
        // }
      };

    return items.length > 0 ? (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div style={{ border: "1px solid lightgreen" }}>
            {items.map((node) => (
              <SortableItem
                key={node.id}
                id={node.id}
                takePrev={takePrev}
                takeNext={takeNext}
                takeNode={takeNode}
                node={node}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    ) : null;
  },
);
