import { createBehavior, createResource } from "@duckform/core";
import { DnFC } from "@duckform/react";
import { Rate as AntdRate } from "antd";
import React from "react";
import * as AllLocales from "./locale";
import * as AllSchemas from "./schema";
import { createFieldSchema } from "../Field";

export const Rate: DnFC<React.ComponentProps<typeof AntdRate>> = AntdRate;

Rate.Behavior = createBehavior({
  name: "Rate",
  extends: ["Field"],
  selector: (node) => node.props?.["x-component"] === "Rate",
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.Rate),
  },
  designerLocales: AllLocales.Rate,
});

Rate.Resource = createResource({
  icon: "RateSource",
  elements: [
    {
      componentName: "Field",
      props: {
        type: "number",
        title: "Rate",
        "x-decorator": "FormItem",
        "x-component": "Rate",
      },
    },
  ],
});
