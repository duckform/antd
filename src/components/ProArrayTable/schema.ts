import { ISchema } from "@formily/react";

export const ProArrayTable: ISchema = {
  type: "object",
  properties: {
    bordered: {
      type: "boolean",
      "x-decorator": "FormItem",
      "x-component": "Switch",
      "x-component-props": {
        defaultChecked: true,
      },
    },
    showHeader: {
      type: "boolean",
      "x-decorator": "FormItem",
      "x-component": "Switch",
      "x-component-props": {
        defaultChecked: true,
      },
    },
    enableSelection: {
      type: "boolean",
      "x-decorator": "FormItem",
      "x-component": "Switch",
      "x-component-props": {
        defaultChecked: false,
      },
    },
    rowSelection: {
      type: "object",
      "x-reactions": {
        dependencies: [".enableSelection"],
        fulfill: {
          state: {
            display: "{{$deps[0] ? 'visible': 'none' }}",
          },
        },
      },
      properties: {
        type: {
          enum: ["radio", "checkbox"],
          "x-decorator": "FormItem",
          "x-component": "Radio.Group",
          "x-component-props": {
            defaultValue: "",
            optionType: "button",
          },
        },
      },
    },
    sticky: {
      type: "boolean",
      "x-decorator": "FormItem",
      "x-component": "Switch",
    },
    size: {
      type: "string",
      enum: ["large", "small", "middle"],
      "x-decorator": "FormItem",
      "x-component": "Select",
      "x-component-props": {
        defaultValue: "small",
      },
    },
    tableLayout: {
      type: "string",
      enum: ["auto", "fixed"],
      "x-decorator": "FormItem",
      "x-component": "Radio.Group",
      "x-component-props": {
        defaultValue: "auto",
        optionType: "button",
      },
    },
  },
};

export const Column: ISchema = {
  type: "object",
  properties: {
    title: {
      type: "string",
      "x-decorator": "FormItem",
      "x-component": "Input",
    },
    align: {
      type: "string",
      enum: ["left", "right", "center"],
      "x-decorator": "FormItem",
      "x-component": "Radio.Group",
      "x-component-props": {
        defaultValue: "left",
        optionType: "button",
      },
    },
    colSpan: {
      type: "number",
      "x-decorator": "FormItem",
      "x-component": "NumberPicker",
    },
    width: {
      type: "number",
      "x-decorator": "FormItem",
      "x-component": "NumberPicker",
    },
    fixed: {
      type: "string",
      enum: ["left", "right", false],
      "x-decorator": "FormItem",
      "x-component": "Radio.Group",
      "x-component-props": {
        optionType: "button",
      },
    },
  },
};

export const DelegateAction: ISchema = {
  type: "object",
  properties: {
    okText: {
      type: "string",
      "x-decorator": "FormItem",
      "x-component": "Input",
      default: "保存",
    },
    cancelText: {
      type: "string",
      "x-decorator": "FormItem",
      "x-component": "Input",
      default: "取消修改",
    },
  },
};
export const ProAddition: ISchema = {
  type: "object",
  properties: {
    okText: {
      type: "string",
      "x-decorator": "FormItem",
      "x-component": "Input",
      default: "创建",
    },
    cancelText: {
      type: "string",
      "x-decorator": "FormItem",
      "x-component": "Input",
      default: "取消创建",
    },
  },
};

export const Addition: ISchema = {
  type: "object",
  properties: {
    method: {
      type: "string",
      enum: ["push", "unshift"],
      "x-decorator": "FormItem",
      "x-component": "Radio.Group",
      "x-component-props": {
        defaultValue: "push",
        optionType: "button",
      },
    },
    defaultValue: {
      type: "string",
      "x-decorator": "FormItem",
      "x-component": "ValueInput",
    },
  },
};

export const Remove: ISchema = {
  type: "object",
  properties: {
    confirm: {
      type: "string",
      "x-decorator": "FormItem",
      "x-component": "Switch",
    },
  },
};
