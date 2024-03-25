import { createBehavior, createResource } from "@duckform/core";
import { DnFC } from "@duckform/react";
import { NumberPicker as FormilyNumberPicker } from "@formily/antd";
import React from "react";
import * as AllLocales from "./locale";
import * as AllSchemas from "./schema";
import { createFieldSchema } from "../Field";

export const NumberPicker: DnFC<
  React.ComponentProps<typeof FormilyNumberPicker>
> = FormilyNumberPicker;

NumberPicker.Behavior = createBehavior({
  name: "NumberPicker",
  extends: ["Field"],
  selector: (node) => node.props?.["x-component"] === "NumberPicker",
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.NumberPicker),
  },
  designerLocales: AllLocales.NumberPicker,
});

NumberPicker.Resource = createResource({
  icon: "NumberPickerSource",
  elements: [
    {
      componentName: "Field",
      props: {
        type: "number",
        title: "NumberPicker",
        "x-decorator": "FormItem",
        "x-component": "NumberPicker",
      },
    },
  ],
});
