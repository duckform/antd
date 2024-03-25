import { usePrefix } from "@duckform/react";
import { MonacoInput } from "@duckform/settings-form";
import { observer } from "@formily/reactive-react";
import { Card, Menu } from "antd";
import { useEffect, useId, useRef, useState } from "react";
import { InputAddon } from "../InputAddon";
import { useFeatureScope } from "../ctx";
import { helpCode } from "./helpCode";
import "./styles.less";

const monacoProps: React.ComponentProps<typeof MonacoInput> = {
  width: "100%",
  height: "100%",
  language: "javascript.expression",
  helpCode: helpCode,
  options: {
    minimap: { enabled: false },
  },
};

export type ScopeEditorProps = {};

export const ScopePanel: React.FC = observer(() => {
  const prefix = usePrefix("scope-editor");
  const scope = useFeatureScope();

  const saveVar = (next: string) => {
    if (!next) return;
    scope.vars[next] = "";
    scope.active = next;
  };

  return (
    <div className={prefix}>
      <div className="name-list">
        <InputAddon placeholder="添加新变量 ⏎" onEnter={saveVar}></InputAddon>
        <Menu
          mode="vertical"
          style={{
            paddingRight: 4,
            borderRight: 0,
            overflowY: "auto",
            overflowX: "hidden",
          }}
          selectedKeys={[scope.active]}
          onSelect={({ selectedKeys }) => {
            scope.active = selectedKeys[0];
          }}
          items={scope.options}
        ></Menu>
      </div>
    </div>
  );
});

export const ScopeEditor: React.FC = observer(() => {
  const prefix = usePrefix("scope-editor");
  const scope = useFeatureScope();
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  return (
    <div className={prefix}>
      <Card
        className="coder-wrapper"
        bodyStyle={{ flex: 1 }}
        title={`编辑变量定义 ${scope.active}`}
      >
        <MonacoInput
          key={scope.active}
          {...monacoProps}
          value={scope.current}
          onChange={(neo) => {
            if (!mounted.current) {
              console.log("reject by unmounted");
              return;
            }
            scope.setCurrent(neo);
          }}
        ></MonacoInput>
      </Card>
    </div>
  );
});
