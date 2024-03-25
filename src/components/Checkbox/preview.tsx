import { createBehavior, createResource } from "@duckform/core";
import { DnFC } from "@duckform/react";
import { Checkbox as FormilyCheckbox } from "@formily/antd";
import React from "react";
import * as AllLocales from "./locale";
import * as AllSchemas from "./schema";
import { createFieldSchema } from "../Field";

export const Checkbox: DnFC<React.ComponentProps<typeof FormilyCheckbox>> =
  FormilyCheckbox;

Checkbox.Behavior = createBehavior({
  name: "Checkbox.Group",
  extends: ["Field"],
  selector: (node) => node.props?.["x-component"] === "Checkbox.Group",
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.Checkbox.Group),
  },
  designerLocales: AllLocales.CheckboxGroup,
});

Checkbox.Resource = createResource({
  icon: "CheckboxGroupSource",
  elements: [
    {
      componentName: "Field",
      props: {
        type: "Array<string | number>",
        title: "Checkbox Group",
        "x-decorator": "FormItem",
        "x-component": "Checkbox.Group",
        enum: [
          { label: "选项1", value: 1 },
          { label: "选项2", value: 2 },
        ],
      },
    },
  ],
});
