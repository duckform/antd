import { createBehavior, createResource } from "@duckform/core";
import { DnFC } from "@duckform/react";
import cls from "classnames";
import React from "react";
import * as AllLocales from "./locale";
import * as AllSchemas from "./schema";
import { createVoidFieldSchema } from "../Field";
import "./styles.less";

export interface IDesignableTextProps {
  value?: string;
  content?: string;
  mode?: "normal" | "h1" | "h2" | "h3" | "p";
  style?: React.CSSProperties;
  className?: string;
}

export const Text: DnFC<IDesignableTextProps> = (props) => {
  const tagName = props.mode === "normal" || !props.mode ? "div" : props.mode;
  return React.createElement(
    tagName,
    {
      ...props,
      className: cls(props.className, "dn-text"),
      "data-content-editable": "x-component-props.content",
    },
    props.content,
  );
};

Text.Behavior = createBehavior({
  name: "Text",
  extends: ["Field"],
  selector: (node) => node.props?.["x-component"] === "Text",
  designerProps: {
    propsSchema: createVoidFieldSchema(AllSchemas.Text),
  },
  designerLocales: AllLocales.Text,
});

Text.Resource = createResource({
  icon: "TextSource",
  elements: [
    {
      componentName: "Field",
      props: {
        type: "string",
        "x-component": "Text",
      },
    },
  ],
});
