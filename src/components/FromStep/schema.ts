import { ISchema } from "@formily/react";

export const FormStep: ISchema & { StepPane?: ISchema } = {
  type: "object",
  properties: {
    // animated: {
    //   type: "boolean",
    //   "x-decorator": "FormItem",
    //   "x-component": "Switch",
    // },
    // centered: {
    //   type: "boolean",
    //   "x-decorator": "FormItem",
    //   "x-component": "Switch",
    // },
    // size: {
    //   type: "string",
    //   enum: ["large", "small", "default", null!],
    //   "x-decorator": "FormItem",
    //   "x-component": "Select",
    //   "x-component-props": {
    //     defaultValue: "default",
    //   },
    // },
    // type: {
    //   type: "string",
    //   "x-decorator": "FormItem",
    //   "x-component": "Radio.Group",
    //   "x-component-props": {
    //     defaultValue: "line",
    //     optionType: "button",
    //   },
    // },
  },
};

FormStep.StepPane = {
  type: "object",
  properties: {
    title: {
      type: "string",
      "x-decorator": "FormItem",
      "x-component": "Input",
    },
  },
};
