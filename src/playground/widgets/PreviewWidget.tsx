import { TreeNode } from "@duckform/core";
import {
  ArrayCards,
  ArrayTable,
  Cascader,
  Checkbox,
  DatePicker,
  Editable,
  Form,
  FormCollapse,
  FormGrid,
  FormItem,
  FormLayout,
  FormTab,
  Input,
  NumberPicker,
  Password,
  PreviewText,
  Radio,
  Reset,
  Select,
  Space,
  Submit,
  Switch,
  TimePicker,
  Transfer,
  TreeSelect,
  Upload,
  FormStep,
} from "@formily/antd";
import { createForm } from "@formily/core";
import { createSchemaField } from "@formily/react";
import { Card, Button, Rate, Slider } from "antd";
import React, { useMemo } from "react";
import {
  QueryForm,
  QueryList,
  QueryTable,
  ShadowForm,
  ShadowModal,
  ShadowPopconfirm,
  ProArrayTable,
} from "@pro.formily/antd";
import { transformToSchema } from "../utils/transformer";
import { useFeatureScope } from "../features/ctx";

const Text: React.FC<{
  value?: string;
  content?: string;
  mode?: "normal" | "h1" | "h2" | "h3" | "p";
}> = ({ value, mode, content, ...props }) => {
  const tagName = mode === "normal" || !mode ? "div" : mode;
  return React.createElement(tagName, props, value || content);
};

const SchemaField = createSchemaField({
  components: {
    Space,
    FormGrid,
    FormLayout,
    FormTab,
    FormCollapse,
    ArrayTable,
    ArrayCards,
    FormItem,
    DatePicker,
    Checkbox,
    Cascader,
    Editable,
    Input,
    Text,
    NumberPicker,
    Switch,
    Password,
    PreviewText,
    Radio,
    Reset,
    Select,
    Submit,
    TimePicker,
    Transfer,
    TreeSelect,
    Upload,
    Card,
    Button,
    Slider,
    Rate,
    QueryForm,
    QueryList,
    QueryTable,
    ShadowForm,
    ShadowModal,
    ShadowPopconfirm,
    ProArrayTable,
    FormStep,
  },
});

export interface IPreviewWidgetProps {
  tree: TreeNode;
}

const getScope = (scope: ReturnType<typeof useFeatureScope>) => {
  const scopeVars = Object.keys(scope.vars).reduce<string[]>(
    (lines, varName) => {
      lines.push(`${varName}: ${scope.vars[varName]}`);
      return lines;
    },
    [],
  );
  const input = `var scope = {${scopeVars.join(",\n")}}`;
  console.log(input);
  // return {};
  return new Function(`${input}; return scope;`);
};

export const PreviewWidget: React.FC<
  React.PropsWithChildren<IPreviewWidgetProps>
> = (props) => {
  const scopeConfig = useFeatureScope();
  const form = useMemo(() => createForm(), []);
  const scope = getScope(scopeConfig);
  const { form: formProps, schema } = transformToSchema(props.tree);
  return (
    <Form {...formProps} form={form}>
      <SchemaField
        scope={{
          ...scope,
          log: console.log,
          FormStep,
        }}
        schema={schema}
      />
    </Form>
  );
};
