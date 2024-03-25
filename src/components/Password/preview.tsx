import { createBehavior, createResource } from "@duckform/core";
import { DnFC } from "@duckform/react";
import { Password as FormilyPassword } from "@formily/antd";
import React from "react";
import * as AllLocales from "./locale";
import * as AllSchemas from "./schema";
import { createFieldSchema } from "../Field";

export const Password: DnFC<React.ComponentProps<typeof FormilyPassword>> =
  FormilyPassword;

Password.Behavior = createBehavior({
  name: "Password",
  extends: ["Field"],
  selector: (node) => node.props?.["x-component"] === "Password",
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.Password),
  },
  designerLocales: AllLocales.Password,
});

Password.Resource = createResource({
  icon: "PasswordSource",
  elements: [
    {
      componentName: "Field",
      props: {
        title: "Password",
        "x-decorator": "FormItem",
        "x-component": "Password",
      },
    },
  ],
});
