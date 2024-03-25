import { createBehavior, createResource } from "@duckform/core";
import { DesignModal } from "../../common/DesignModal";
import { createFieldSchema, createVoidFieldSchema } from "../Field";
import * as locales from "./locale";
import * as schemas from "./schema";
import { DnFC } from "@duckform/react";

export const ShadowModal: DnFC = DesignModal;

ShadowModal.Behavior = createBehavior({
  name: "ShadowModal",
  extends: ["Field"],
  selector: (node) => node.props?.["x-component"] === "ShadowModal",
  designerProps: {
    droppable: true,
    allowDrop: (target) => {
      // 只能在对象容器中使用
      let parent = target;
      while (parent.props?.type !== "object" && parent.props?.type === "void") {
        parent = parent.parent;
      }
      // if (parent.props.type !== "object") return false;
      return parent.props?.type === "object";
    },
    propsSchema: createVoidFieldSchema(schemas.ShadowModal),
  },
  designerLocales: locales.ShadowModal,
});

ShadowModal.Resource = createResource({
  icon: "CardSource",
  elements: [
    {
      componentName: "Field",
      props: {
        type: "void",
        title: "弹出编辑",
        "x-decorator": "ShadowForm",
        "x-component": "ShadowModal",
      },
    },
  ],
});
