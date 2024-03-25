import { Card as AntdCard } from "antd";
import React from "react";

import { createBehavior, createResource } from "@duckform/core";
import { DnFC } from "@duckform/react";
import * as AllLocales from "./locale";
import * as AllSchemas from "./schema";
import { createVoidFieldSchema } from "../Field";

export const Card: DnFC<React.ComponentProps<typeof AntdCard>> = (props) => {
  return (
    <AntdCard
      {...props}
      title={
        <span data-content-editable="x-component-props.title">
          {props.title}
        </span>
      }
    >
      {props.children}
    </AntdCard>
  );
};

Card.Behavior = createBehavior({
  name: "Card",
  extends: ["Field"],
  selector: (node) => node.props?.["x-component"] === "Card",
  designerProps: {
    droppable: true,
    propsSchema: createVoidFieldSchema(AllSchemas.Card),
  },
  designerLocales: AllLocales.Card,
});

Card.Resource = createResource({
  icon: "CardSource",
  elements: [
    {
      componentName: "Field",
      props: {
        type: "void",
        "x-component": "Card",
        "x-component-props": {
          title: "Title",
        },
      },
    },
  ],
});
