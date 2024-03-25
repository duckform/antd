import React, { useEffect, useMemo, useState } from "react";

import { CodeOutlined } from "@ant-design/icons";
import {
  GeneralField,
  isDataField,
  onFieldInit,
  onFieldReact,
} from "@formily/core";
import { useField } from "@formily/react";
import { Button, Select, Tooltip } from "antd";
import { useFeatureScope } from "../ctx";

const helper = {
  change(field: GeneralField, options?: any[], isInit = false) {
    if (!isDataField(field)) return;
    field.data = field.data || {};
    if (!field.data.__backup) {
      field.data.__backup = {};
    }
    if (!("value" in field.data.__backup)) {
      // backup component and component props
      field.data.__backup.value = field.value;
    }
    if (!field.data.__backup.componentType) {
      field.data.__backup.componentType = field.componentType;
    }
    if (!field.data.__backup.componentProps) {
      field.data.__backup.componentProps = field.componentProps;
    }

    const shouldResetValue = !isInit && field.componentType !== Select;

    if (shouldResetValue) {
      field.value = undefined;
    }
    field.componentType = Select;
    field.componentProps = {
      placeholder: "选择 Scope 变量",
      status: "warning",
      options: options ?? [],
      defaultValue: field.value,
      onSelect: (v: any) => {
        field.setValue(v);
      },
    };
  },
  restore(field: GeneralField) {
    if (!isDataField(field)) return;
    if (!field.data?.__backup) return;

    const { componentProps, componentType, value } = field.data.__backup;
    if (helper.isScopeExpField(field)) {
      field.value = field.initialValue;
    } else if (field.value !== value) {
      field.value = value;
    }
    if (field.componentType !== componentType) {
      field.componentType = componentType;
    }
    if (field.componentProps !== componentProps) {
      field.componentProps = componentProps;
    }
  },
  isScopeExpField(field: GeneralField) {
    if (!isDataField(field)) return null;
    if (/^\{\{\w+\}\}$/.test(field.value)) return true;
    return null;
  },
};

const LabelWithScope = (props: {
  label: string;
}) => {
  const scope = useFeatureScope();
  const field = useField();
  const [scopeEnable, setScopeEnable] = useState(helper.isScopeExpField(field));

  const show = useMemo(() => {
    return isDataField(field);
  }, [field]);

  const vars: React.ComponentProps<typeof Select>["options"] = useMemo(() => {
    const options = Object.keys(scope.vars).map((varName) => {
      const vvar = `{{${varName}}}`;
      return {
        key: varName,
        label: (
          <Tooltip title={scope.vars[varName]}>
            <div>{vvar}</div>
          </Tooltip>
        ),
        value: vvar,
      };
    });
    return options;
  }, [scope.vars]);

  useEffect(() => {
    if (!isDataField(field)) return;
    if (scopeEnable) {
      helper.change(field, vars);
    } else if (scopeEnable === false) {
      helper.restore(field);
    }
  }, [scopeEnable, field, vars]);

  return show ? (
    <span>
      <Button
        type="text"
        size="small"
        icon={
          <CodeOutlined
            onClick={() => setScopeEnable((x) => !x)}
            style={{
              color: scopeEnable ? "#FAAD14" : "#000",
            }}
          ></CodeOutlined>
        }
      ></Button>
      {props.label}
    </span>
  ) : (
    props.label
  );
};

export const useScopeEffects = () => {
  onFieldInit("*", (field) => {
    if (field.decorator?.[0] !== "FormItem") return;
    if (!isDataField(field)) return;
    if (helper.isScopeExpField(field)) {
      helper.change(field, undefined, true);
    }
  });
  onFieldReact("*", (field) => {
    if (!isDataField(field)) return;
    if (field.decorator?.[0] !== "FormItem") return;
    field.data = field.data || {};
    if (field.data.__scope_injected) return;
    const label = field.decorator[1]?.label ?? field.title;
    field.decorator[1].label = <LabelWithScope label={label} />;
    field.data.__scope_injected = true;
  });
};
