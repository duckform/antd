import { useDrag, useDrop } from "ahooks";
import { useRef, useState } from "react";
import { ISchemaTreeNode } from "../shared";
import "./index.less";

export type TreeLike = {
  key: string;
  dropBefore?: boolean;
  dropChildren?: boolean;
  children: TreeLike[];
};
const css: {
  wrapper: React.CSSProperties;
  box: React.CSSProperties;
  drageable: React.CSSProperties;
  disabled: React.CSSProperties;
} = {
  wrapper: {
    cursor: "pointer",
  },
  box: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  drageable: {
    height: "14px",
    transition: "opacity ease 0.3s",
    background: "#69b1ff",
  },
  disabled: {
    height: "14px",
    transition: "opacity ease 0.3s",
    background: "#ff7875",
  },
};

const draging = {
  current: null,
};

const DropableBox = (props: {
  dragKey: string;
  allowDrop?: (dragKey: string, dropKey: string) => [boolean, boolean];
  children: React.ReactNode;
  dropBefore?: boolean;
  dropChildren?: boolean;
  onDropInsert: (
    to: "before" | "children",
    source: string,
    target: string,
  ) => void;
}) => {
  const dropBefore = useRef(null);
  const dropAfter = useRef(null);
  const dragNode = useRef(null);
  const [hover, setHover] = useState(false);
  const [opacity, setOpacity] = useState({ before: 0, after: 0 });
  const [allowBefore, setAllowBefore] = useState(true);
  const [allowChildren, setAllowChildren] = useState(true);
  const allowRef = useRef({
    before: false,
    children: false,
  });

  useDrag(props.dragKey, dragNode, {
    onDragStart() {
      draging.current = props.dragKey;
    },
    onDragEnd() {
      draging.current = null;
    },
  });

  useDrop(dropBefore, {
    onDragEnter() {
      const isAllow = props.allowDrop?.(draging.current, props.dragKey)[0];
      setAllowBefore(isAllow);
      allowRef.current.before = isAllow;
      setHover(true);
      setOpacity((o) => {
        return {
          ...o,
          before: 0.8,
        };
      });
    },
    onDragLeave() {
      setHover(false);
      setOpacity((o) => {
        return {
          ...o,
          before: 0,
        };
      });
    },
    onText(text) {
      setHover(false);
      setOpacity({ after: 0, before: 0 });
      if (!allowRef.current.before) return;
      props?.onDropInsert?.("before", JSON.parse(text), props.dragKey);
    },
  });
  useDrop(dropAfter, {
    onDragEnter(event) {
      const isAllow = props.allowDrop?.(draging.current, props.dragKey)[1];
      setAllowChildren(isAllow);
      allowRef.current.children = isAllow;
      setOpacity((o) => {
        return {
          ...o,
          after: 0.8,
        };
      });
      setHover(true);
    },
    onDragLeave() {
      setHover(false);
      setOpacity((o) => {
        return {
          ...o,
          after: 0,
        };
      });
    },
    onText(text) {
      setHover(false);
      setOpacity({ after: 0, before: 0 });
      if (!allowRef.current.children) return;
      props?.onDropInsert?.("children", JSON.parse(text), props.dragKey);
    },
  });
  return (
    <div className={["dnd-box", hover ? "hover" : ""].join(" ")}>
      {props.dropBefore === false ? null : (
        <div
          ref={dropBefore}
          style={{
            ...(allowBefore ? css.drageable : css.disabled),
            opacity: opacity.before,
          }}
        ></div>
      )}
      <div style={css.wrapper} ref={dragNode}>
        <div style={css.box}>{props.children}</div>
      </div>
      {props.dropChildren === false ? null : (
        <div
          ref={dropAfter}
          style={{
            ...(allowChildren ? css.drageable : css.disabled),
            opacity: opacity.after,
          }}
        ></div>
      )}
    </div>
  );
};

export const DnDTree = (
  props: {
    data: ISchemaTreeNode[];
    render: (data: ISchemaTreeNode) => React.ReactNode;
    allowDropBefore?: (data: ISchemaTreeNode) => boolean;
    allowDropChildren?: (data: ISchemaTreeNode) => boolean;
    deepth?: number;
  } & Pick<
    React.ComponentProps<typeof DropableBox>,
    "allowDrop" | "onDropInsert"
  >,
) => {
  return props?.data?.map((child) => {
    return (
      <div
        key={child.id}
        style={{
          paddingLeft: `${(props.deepth ?? 0) * 10}px`,
        }}
      >
        <DropableBox
          onDropInsert={props.onDropInsert}
          allowDrop={props.allowDrop}
          dragKey={child.key}
          dropBefore={props.allowDropBefore?.(child)}
          dropChildren={props.allowDropChildren?.(child)}
        >
          {props.render(child as any)}
        </DropableBox>
        <DnDTree
          {...props}
          key={child.key}
          deepth={(props.deepth ?? 0) + 1}
          data={child.children}
        />
      </div>
    );
  });
};
