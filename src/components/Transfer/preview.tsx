import { createBehavior, createResource } from "@duckform/core";
import { DnFC } from "@duckform/react";
import { Transfer as FormilyTransfer } from "@formily/antd";
import React from "react";
import * as AllLocales from "./locale";
import * as AllSchemas from "./schema";
import { createFieldSchema } from "../Field";

export const Transfer: DnFC<React.ComponentProps<typeof FormilyTransfer>> =
  FormilyTransfer;

Transfer.Behavior = createBehavior({
  name: "Transfer",
  extends: ["Field"],
  selector: (node) => node.props?.["x-component"] === "Transfer",
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.Transfer),
  },
  designerLocales: AllLocales.Transfer,
});

Transfer.Resource = createResource({
  icon: "TransferSource",
  elements: [
    {
      componentName: "Field",
      props: {
        title: "Transfer",
        "x-decorator": "FormItem",
        "x-component": "Transfer",
      },
    },
  ],
});
