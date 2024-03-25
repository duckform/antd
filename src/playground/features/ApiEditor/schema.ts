import {
  ArrayTable,
  FormGrid,
  FormItem,
  FormTab,
  Input,
  Radio,
  Select,
} from "@formily/antd";
import {
  ArrayField,
  Form,
  GeneralField,
  VoidField,
  isDataField,
} from "@formily/core";
import { createSchemaField } from "@formily/react";

export const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    FormGrid,
    Select,
    Radio,
    ArrayTable,
    FormTab,
  },
});

export const watchPathParams = (form: Form, field: GeneralField) => {
  if (!isDataField(field)) return;
  const url = field.value;
  if (!url) return;
  const match = url.match(/({\w+})/g);
  const keys = match ? match.map((item) => item.replace(/[{}]/g, "")) : [];

  if (keys.length > 0) {
    const pathTab = form.query("tabs.path").take() as VoidField;
    pathTab.display = "visible";
    setTimeout(() => {
      const pathField = form.query("tabs.path.path").take() as ArrayField;
      if (!pathField) return;

      const list = pathField.value as {
        key: string;
        desc: string;
        example: string;
      }[];

      const neo = keys.map((key) => {
        const has = list.find((x) => x.key === key);
        return has
          ? has
          : {
              key: key,
              desc: `路径参数 ${key}`,
              example: `string`,
            };
      });

      pathField.value = neo;
      console.log(`🚀 ~ setTimeout ~ list:`, list);
    });
  }
};

export const schema: React.ComponentProps<typeof SchemaField>["schema"] = {
  type: "object",
  properties: {
    grid: {
      type: "void",
      "x-component": "FormGrid",
      "x-component-props": {
        minColumns: 1,
      },
      properties: {
        method: {
          type: "string",
          enum: ["GET", "POST", "PUT", "DELETE"],
          "x-decorator": "FormItem",
          "x-component": "Select",
          "x-decorator-props": {
            gridSpan: 1,
          },
          default: "GET",
        },
        url: {
          type: "string",
          "x-decorator": "FormItem",
          "x-decorator-props": {
            gridSpan: 10,
          },
          "x-component": "Input",
          "x-component-props": {
            placeholder: "请输入 URL",
          },
        },
      },
    },
    desc: {
      type: "string",
      title: "接口描述",
      "x-decorator": "FormItem",
      "x-component": "Input",
    },
    tabs: {
      type: "void",
      "x-component": "FormTab",
      "x-component-props": {
        formTab: "{{formTab}}",
      },
      properties: {
        headers: {
          type: "void",
          "x-component": "FormTab.TabPane",
          "x-component-props": { tab: "请求头 Headers" },
          properties: {
            headers: {
              type: "array",
              "x-decorator": "FormItem",
              "x-component": "ArrayTable",
              "x-component-props": { bordered: false },
              items: {
                type: "object",
                properties: {
                  key: {
                    type: "void",
                    "x-component": "ArrayTable.Column",
                    "x-component-props": {
                      title: "请求头名称",
                    },
                    properties: {
                      key: {
                        type: "string",
                        "x-component": "Input",
                      },
                    },
                  },
                  desc: {
                    type: "void",
                    "x-component": "ArrayTable.Column",
                    "x-component-props": {
                      title: "描述",
                    },
                    properties: {
                      desc: {
                        type: "string",
                        "x-component": "Input",
                      },
                    },
                  },
                  example: {
                    type: "void",
                    "x-component": "ArrayTable.Column",
                    "x-component-props": {
                      title: "例值",
                    },
                    properties: {
                      example: {
                        type: "string",
                        "x-component": "Input",
                      },
                    },
                  },
                  remove: {
                    type: "void",
                    "x-component": "ArrayTable.Column",
                    "x-component-props": {
                      title: "操作",
                    },
                    properties: {
                      remove: {
                        type: "void",
                        "x-component": "ArrayTable.Remove",
                      },
                    },
                  },
                },
              },
              properties: {
                add: {
                  type: "void",
                  "x-component": "ArrayTable.Addition",
                  title: "添加请求头",
                },
              },
            },
          },
        },
        path: {
          "x-display": "none",
          type: "void",
          "x-component": "FormTab.TabPane",
          "x-component-props": { tab: "路径参数 Path" },
          properties: {
            path: {
              type: "array",
              "x-decorator": "FormItem",
              "x-component": "ArrayTable",
              "x-component-props": { bordered: false },
              items: {
                type: "object",
                properties: {
                  key: {
                    type: "void",
                    "x-component": "ArrayTable.Column",
                    "x-component-props": {
                      title: "参数名称",
                    },
                    properties: {
                      key: {
                        type: "string",
                        "x-read-pretty": true,
                        "x-component": "Input",
                      },
                    },
                  },
                  desc: {
                    type: "void",
                    "x-component": "ArrayTable.Column",
                    "x-component-props": {
                      title: "描述",
                    },
                    properties: {
                      desc: {
                        type: "string",
                        "x-component": "Input",
                      },
                    },
                  },
                  example: {
                    type: "void",
                    "x-component": "ArrayTable.Column",
                    "x-component-props": {
                      title: "例值",
                    },
                    properties: {
                      example: {
                        type: "string",
                        "x-component": "Input",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        params: {
          type: "void",
          "x-component": "FormTab.TabPane",
          "x-component-props": { tab: "请求参数 Params" },
          properties: {
            params: {
              type: "array",
              "x-decorator": "FormItem",
              "x-component": "ArrayTable",
              "x-component-props": { bordered: false },
              items: {
                type: "object",
                properties: {
                  key: {
                    type: "void",
                    "x-component": "ArrayTable.Column",
                    "x-component-props": {
                      title: "参数名称",
                    },
                    properties: {
                      key: {
                        type: "string",
                        "x-component": "Input",
                      },
                    },
                  },
                  type: {
                    type: "void",
                    "x-component": "ArrayTable.Column",
                    "x-component-props": {
                      title: "参数类型",
                    },
                    properties: {
                      type: {
                        type: "string",
                        enum: [
                          "string",
                          "boolean",
                          "number",
                          "object",
                          "array",
                        ],
                        "x-component": "Select",
                        default: "string",
                      },
                    },
                  },
                  desc: {
                    type: "void",
                    "x-component": "ArrayTable.Column",
                    "x-component-props": {
                      title: "描述",
                    },
                    properties: {
                      desc: {
                        type: "string",
                        "x-component": "Input",
                      },
                    },
                  },
                  example: {
                    type: "void",
                    "x-component": "ArrayTable.Column",
                    "x-component-props": {
                      title: "例值",
                    },
                    properties: {
                      example: {
                        type: "string",
                        "x-component": "Input",
                      },
                    },
                  },
                  remove: {
                    type: "void",
                    "x-component": "ArrayTable.Column",
                    "x-component-props": {
                      title: "操作",
                    },
                    properties: {
                      remove: {
                        type: "void",
                        "x-component": "ArrayTable.Remove",
                      },
                    },
                  },
                },
              },
              properties: {
                add: {
                  type: "void",
                  "x-component": "ArrayTable.Addition",
                  title: "添加请求参数",
                },
              },
            },
          },
        },
        body: {
          type: "void",
          "x-component": "FormTab.TabPane",
          "x-component-props": { tab: "请求体参数 Body" },
          properties: {
            body: {
              type: "array",
              "x-decorator": "FormItem",
              "x-component": "ArrayTable",
              "x-component-props": { bordered: false },
              items: {
                type: "object",
                properties: {
                  key: {
                    type: "void",
                    "x-component": "ArrayTable.Column",
                    "x-component-props": {
                      title: "参数名称",
                    },
                    properties: {
                      key: {
                        type: "string",
                        "x-decorator": "FormItem",
                        "x-component": "Input",
                      },
                    },
                  },
                  type: {
                    type: "void",
                    "x-component": "ArrayTable.Column",
                    "x-component-props": {
                      title: "参数类型",
                    },
                    properties: {
                      type: {
                        type: "string",
                        enum: [
                          "string",
                          "boolean",
                          "number",
                          "object",
                          "array",
                        ],
                        "x-component": "Select",
                        default: "string",
                      },
                    },
                  },
                  desc: {
                    type: "void",
                    "x-component": "ArrayTable.Column",
                    "x-component-props": {
                      title: "描述",
                    },
                    properties: {
                      desc: {
                        type: "string",
                        "x-component": "Input",
                      },
                    },
                  },
                  example: {
                    type: "void",
                    "x-component": "ArrayTable.Column",
                    "x-component-props": {
                      title: "例值",
                    },
                    properties: {
                      example: {
                        type: "string",
                        "x-component": "Input",
                      },
                    },
                  },
                  remove: {
                    type: "void",
                    "x-component": "ArrayTable.Column",
                    "x-component-props": {
                      title: "操作",
                    },
                    properties: {
                      remove: {
                        type: "void",
                        "x-component": "ArrayTable.Remove",
                      },
                    },
                  },
                },
              },
              properties: {
                add: {
                  type: "void",
                  "x-component": "ArrayTable.Addition",
                  title: "添加请求体参数",
                },
              },
            },
          },
        },
      },
    },
  },
};
