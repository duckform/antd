export const Text = {
  "zh-CN": {
    title: "文本",
    settings: {
      "x-component-props": {
        content: "文本内容",
        mode: {
          title: "文本类型",
          dataSource: ["H1", "H2", "H3", "Paragraph", "Normal"],
        },
      },
    },
  },
  "en-US": {
    title: "Text",
    settings: {
      "x-component-props": {
        content: "Text Content",
        mode: {
          title: "Text Mode",
          dataSource: ["H1", "H2", "H3", "Paragraph", "Normal"],
        },
      },
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
