import { ISchema } from "@formily/react";

export const ShadowModal: ISchema = {
  type: "object",
  properties: {
    title: {
      type: "string",
      "x-decorator": "FormItem",
      "x-component": "Input",
      default: "弹窗层编辑",
    },
    okText: {
      type: "string",
      "x-decorator": "FormItem",
      "x-component": "Input",
      default: "好的",
    },
    cancelText: {
      type: "string",
      "x-decorator": "FormItem",
      "x-component": "Input",
      default: "放弃",
    },
  },
};
