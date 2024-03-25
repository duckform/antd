import { ISchema } from "@formily/react";

export const Text: ISchema = {
  type: "object",
  properties: {
    content: {
      type: "string",
      "x-decorator": "FormItem",
      "x-component": "Input.TextArea",
    },
    mode: {
      type: "string",
      "x-decorator": "FormItem",
      "x-component": "Select",
      "x-component-props": {
        defaultValue: "normal",
      },
      enum: ["h1", "h2", "h3", "p", "normal"],
    },
  },
};

export const TextArea = {
  "zh-CN": {
    title: "多行输入",
    settings: {
      "x-component-props": {
        maxLength: "最大长度",
        autoSize: {
          title: "自适应高度",
          tooltip: "可设置为 true | false 或对象：{ minRows: 2, maxRows: 6 }",
        },
        showCount: "是否展示字数",
      },
    },
  },
  "en-US": {
    title: "TextArea",
    settings: {
      "x-component-props": {
        maxLength: "Max Length",
        autoSize: "Auto Size",
        showCount: "Show Count",
      },
    },
  },
};
