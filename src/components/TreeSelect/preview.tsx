import { createBehavior, createResource } from "@duckform/core";
import { DnFC } from "@duckform/react";
import { TreeSelect as FormilyTreeSelect } from "@formily/antd";
import React from "react";
import * as AllLocales from "./locale";
import * as AllSchemas from "./schema";
import { createFieldSchema } from "../Field";

export const TreeSelect: DnFC<React.ComponentProps<typeof FormilyTreeSelect>> =
  FormilyTreeSelect;

TreeSelect.Behavior = createBehavior({
  name: "TreeSelect",
  extends: ["Field"],
  selector: (node) => node.props?.["x-component"] === "TreeSelect",
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.TreeSelect),
  },
  designerLocales: AllLocales.TreeSelect,
});

TreeSelect.Resource = createResource({
  icon: "TreeSelectSource",
  elements: [
    {
      componentName: "Field",
      props: {
        title: "TreeSelect",
        "x-decorator": "FormItem",
        "x-component": "TreeSelect",
      },
    },
  ],
});
