import { createBehavior, createResource } from "@duckform/core";
import { DnFC } from "@duckform/react";
import { Cascader as FormilyCascader } from "@formily/antd";
import React from "react";
import * as AllLocales from "./locale";
import * as AllSchemas from "./schema";
import { createFieldSchema } from "../Field";

export const Cascader: DnFC<React.ComponentProps<typeof FormilyCascader>> =
  FormilyCascader;

Cascader.Behavior = createBehavior({
  name: "Cascader",
  extends: ["Field"],
  selector: (node) => node.props?.["x-component"] === "Cascader",
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.Cascader),
  },
  designerLocales: AllLocales.Cascader,
});

Cascader.Resource = createResource({
  icon: "CascaderSource",
  elements: [
    {
      componentName: "Field",
      props: {
        title: "Cascader",
        "x-decorator": "FormItem",
        "x-component": "Cascader",
      },
    },
  ],
});
