import { createBehavior, createResource } from "@duckform/core";
import { DnFC } from "@duckform/react";
import { Slider as AntdSlider } from "antd";
import React from "react";
import * as AllLocales from "./locale";
import * as AllSchemas from "./schema";
import { createFieldSchema } from "../Field";

export const Slider: DnFC<React.ComponentProps<typeof AntdSlider>> = AntdSlider;

Slider.Behavior = createBehavior({
  name: "Slider",
  extends: ["Field"],
  selector: (node) => node.props?.["x-component"] === "Slider",
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.Slider),
  },
  designerLocales: AllLocales.Slider,
});

Slider.Resource = createResource({
  icon: "SliderSource",
  elements: [
    {
      componentName: "Field",
      props: {
        type: "number",
        title: "Slider",
        "x-decorator": "FormItem",
        "x-component": "Slider",
      },
    },
  ],
});
