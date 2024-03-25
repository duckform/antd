import { createBehavior, createResource } from "@duckform/core";
import { DnFC } from "@duckform/react";
import { Radio as FormilyRadio } from "@formily/antd";
import React from "react";
import * as AllLocales from "./locale";
import * as AllSchemas from "./schema";
import { createFieldSchema } from "../Field";

export const Radio: DnFC<React.ComponentProps<typeof FormilyRadio>> =
  FormilyRadio;

Radio.Behavior = createBehavior({
  name: "Radio.Group",
  extends: ["Field"],
  selector: (node) => node.props?.["x-component"] === "Radio.Group",
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.Radio.Group),
  },
  designerLocales: AllLocales.RadioGroup,
});

Radio.Resource = createResource({
  icon: "RadioGroupSource",
  elements: [
    {
      componentName: "Field",
      props: {
        type: "string | number",
        title: "Radio Group",
        "x-decorator": "FormItem",
        "x-component": "Radio.Group",
        enum: [
          { label: "选项1", value: 1 },
          { label: "选项2", value: 2 },
        ],
      },
    },
  ],
});
