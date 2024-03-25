import { createBehavior, createResource } from "@duckform/core";
import { DnFC } from "@duckform/react";
import { Select as FormilySelect } from "@formily/antd";
import React from "react";
import * as AllLocales from "./locale";
import * as AllSchemas from "./schema";
import { createFieldSchema } from "../Field";

export const Select: DnFC<React.ComponentProps<typeof FormilySelect>> =
  FormilySelect;

Select.Behavior = createBehavior({
  name: "Select",
  extends: ["Field"],
  selector: (node) => node.props?.["x-component"] === "Select",
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.Select),
  },
  designerLocales: AllLocales.Select,
});

Select.Resource = createResource({
  icon: "SelectSource",
  elements: [
    {
      componentName: "Field",
      props: {
        title: "Select",
        "x-decorator": "FormItem",
        "x-component": "Select",
      },
    },
  ],
});
