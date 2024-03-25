import { createBehavior, createResource } from "@duckform/core";
import { DnFC } from "@duckform/react";
import { FormLayout as FormilyFormLayout } from "@formily/antd";
import React from "react";
import { withContainer } from "../../common/Container";
import * as AllLocales from "./locale";
import * as AllSchemas from "./schema";
import { createVoidFieldSchema } from "../Field";

export const FormLayout: DnFC<React.ComponentProps<typeof FormilyFormLayout>> =
  withContainer(FormilyFormLayout);

FormLayout.Behavior = createBehavior({
  name: "FormLayout",
  extends: ["Field"],
  selector: (node) => node.props?.["x-component"] === "FormLayout",
  designerProps: {
    droppable: true,
    propsSchema: createVoidFieldSchema(AllSchemas.FormLayout),
  },
  designerLocales: AllLocales.FormLayout,
});

FormLayout.Resource = createResource({
  icon: "FormLayoutSource",
  elements: [
    {
      componentName: "Field",
      props: {
        type: "void",
        "x-component": "FormLayout",
      },
    },
  ],
});
