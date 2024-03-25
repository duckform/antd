import { createBehavior, createResource } from "@duckform/core";
import { DnFC } from "@duckform/react";
import { Switch as AntdSwitch } from "antd";
import React from "react";
import * as AllLocales from "./locale";
import * as AllSchemas from "./schema";
import { createFieldSchema } from "../Field";

export const Switch: DnFC<React.ComponentProps<typeof AntdSwitch>> = AntdSwitch;

Switch.Behavior = createBehavior({
  name: "Switch",
  extends: ["Field"],
  selector: (node) => node.props?.["x-component"] === "Switch",
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.Switch),
  },
  designerLocales: AllLocales.Switch,
});

Switch.Resource = createResource({
  icon: "SwitchSource",
  elements: [
    {
      componentName: "Field",
      props: {
        type: "boolean",
        title: "Switch",
        "x-decorator": "FormItem",
        "x-component": "Switch",
      },
    },
  ],
});
