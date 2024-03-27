import { createBehavior, createResource } from "@duckform/core";
import { DnFC, usePrefix } from "@duckform/react";
import { Form as FormilyForm } from "@formily/antd";
import { createForm } from "@formily/core";
import { observer } from "@formily/react";
import React, { useMemo } from "react";
import * as CommonSchemas from "../../common/schemas";
import { Form as FormSchema } from "./schema";
import { FormLayout as FormLayoutSchema } from "../FormLayout/schema";
import * as Locales from "./locale";
import "./styles.less";
import { uid } from "@duckform/core/shared";

export const Form: DnFC<React.ComponentProps<typeof FormilyForm>> = observer(
  (props) => {
    const prefix = usePrefix("designable-form");
    const form = useMemo(
      () =>
        createForm({
          designable: true,
        }),
      [],
    );
    return (
      <FormilyForm
        {...props}
        style={{ ...props.style }}
        className={prefix}
        form={form}
      >
        {props.children}
      </FormilyForm>
    );
  },
);

Form.Behavior = createBehavior({
  name: "Form",
  selector: (node) => node.componentName === "Form",
  designerProps(node) {
    return {
      draggable: !node.isRoot,
      cloneable: !node.isRoot,
      deletable: !node.isRoot,
      droppable: true,
      propsSchema: FormSchema,
      // {
      //   type: "object",
      //   properties: {
      //     ...(FormLayoutSchema.properties as any),
      //     style: CommonSchemas.CSSStyle,
      //   },
      // },
      defaultProps: {
        labelCol: 6,
        wrapperCol: 12,
      },
    };
  },
  designerLocales: Locales.Form,
});

Form.Resource = createResource({
  title: { "zh-CN": "表单", "en-US": "Form" },
  icon: "FormLayoutSource",
  elements: [
    {
      componentName: "Field",
      props: {
        type: "object",
        "x-component": "Form",
      },
    },
  ],
});
