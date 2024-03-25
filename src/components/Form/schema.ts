import type { ISchema } from "@formily/react";
import { FormLayout } from "../FormLayout/schema";
import { CSSStyle } from "../../common/schemas";

export const Form: ISchema = {
  type: "object",
  properties: {
    "form-quick-group": {
      type: "void",
      "x-component": "CollapseItem",
      properties: {
        labelCol: {
          type: "number",
          "x-decorator": "FormItem",
          "x-component": "NumberPicker",
        },
        wrapperCol: {
          type: "number",
          "x-decorator": "FormItem",
          "x-component": "NumberPicker",
        },
        labelWidth: {
          "x-decorator": "FormItem",
          "x-component": "SizeInput",
        },
        wrapperWidth: {
          "x-decorator": "FormItem",
          "x-component": "SizeInput",
        },
        colon: {
          type: "boolean",
          "x-decorator": "FormItem",
          "x-component": "Switch",
          "x-component-props": {
            defaultChecked: true,
          },
        },
        size: {
          type: "string",
          enum: ["large", "small", "default", null!],
          "x-decorator": "FormItem",
          "x-component": "Select",
          "x-component-props": {
            defaultValue: "default",
          },
        },
        layout: {
          type: "string",
          enum: ["vertical", "horizontal", "inline", null!],
          "x-decorator": "FormItem",
          "x-component": "Select",
          "x-component-props": {
            defaultValue: "horizontal",
          },
        },
      },
    },
    "form-layout-group": {
      type: "void",
      "x-component": "CollapseItem",
      "x-component-props": { defaultExpand: false },
      properties: {
        ...(FormLayout.properties as any),
      },
    },
    "form-style-group": {
      type: "void",
      "x-component": "CollapseItem",
      "x-component-props": { defaultExpand: false },
      properties: {
        style: CSSStyle,
      },
    },
  },
};
