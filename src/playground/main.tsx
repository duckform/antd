import {
  GlobalRegistry,
  KeyCode,
  Shortcut,
  createDesigner,
} from "@duckform/core";
import {
  ComponentTreeWidget,
  CompositePanel,
  Designer,
  DesignerToolsWidget,
  HistoryWidget,
  OutlineTreeWidget,
  ResourceWidget,
  SettingsPanel,
  StudioPanel,
  ToolbarPanel,
  ViewPanel,
  ViewToolsWidget,
  ViewportPanel,
  Workspace,
  WorkspacePanel,
} from "@duckform/react";
import { SettingsForm, setNpmCDNRegistry } from "@duckform/react/settings-form";
import { Button } from "antd";
import "antd/dist/antd.less";
import React, { useMemo, useState } from "react";
import { FeatureProvider } from "./features/ctx";
import "./style.less";

import { ApiOutlined, CodeOutlined } from "@ant-design/icons";
import { useLocalStorageState } from "ahooks";
import {
  ArrayCards,
  ArrayTable,
  Card,
  Cascader,
  Checkbox,
  DatePicker,
  Field,
  Form,
  FormCollapse,
  FormGrid,
  FormLayout,
  FormTab,
  Input,
  NumberPicker,
  ObjectContainer,
  Password,
  ProArrayTable,
  Radio,
  Rate,
  Select,
  ShadowModal,
  Slider,
  Space,
  Switch,
  Text,
  TimePicker,
  Transfer,
  TreeSelect,
  Upload,
  FormStep,
} from "../preset";
import { ApiEditor, ApiList } from "./features/ApiEditor";
import { ScopeEditor, ScopePanel } from "./features/ScopeEditor";
import { useScopeEffects } from "./features/ScopeLabelEffects";
import { saveSchema } from "./utils";
import {
  ActionsWidget,
  LogoWidget,
  MarkupSchemaWidget,
  PreviewWidget,
  SchemaEditorWidget,
} from "./widgets";

// setNpmCDNRegistry("//unpkg.com");
setNpmCDNRegistry("https://cdn.jsdelivr.net/npm");

GlobalRegistry.registerDesignerLocales({
  "zh-CN": {
    sources: {
      Inputs: "输入控件",
      Layouts: "布局组件",
      Arrays: "自增组件",
      Displays: "展示组件",
    },
  },
  "en-US": {
    sources: {
      Inputs: "Inputs",
      Layouts: "Layouts",
      Arrays: "Arrays",
      Displays: "Displays",
    },
  },
});

const PANEL_CODES = {
  SCOPE: 3,
  API: 4,
};

export const App = () => {
  const [panel, setPanel] = useState<number>(0);
  const [shared, setShared] = useLocalStorageState("dn_apis_store");
  console.log({ Input });
  const engine = useMemo(
    () =>
      createDesigner({
        shortcuts: [
          new Shortcut({
            codes: [
              [KeyCode.Meta, KeyCode.S],
              [KeyCode.Control, KeyCode.S],
            ],
            handler(ctx) {
              saveSchema(ctx.engine);
            },
          }),
        ],
        rootComponentName: "Form",
      }),
    [],
  );

  return (
    <FeatureProvider getInit={() => shared as any} onChange={setShared}>
      <Designer engine={engine}>
        <StudioPanel
          logo={<LogoWidget />}
          actions={<ActionsWidget></ActionsWidget>}
        >
          <CompositePanel
            activeKey={panel}
            onChange={(p) => setPanel(p as number)}
          >
            <CompositePanel.Item title="panels.Component" icon="Component">
              <ResourceWidget
                title="Pro"
                sources={[ShadowModal, ProArrayTable]}
              />
              <ResourceWidget
                title="sources.Inputs"
                sources={[
                  Input,
                  Password,
                  NumberPicker,
                  Rate,
                  Slider,
                  Select,
                  TreeSelect,
                  Cascader,
                  Transfer,
                  Checkbox,
                  Radio,
                  DatePicker,
                  TimePicker,
                  Upload,
                  Switch,
                  ObjectContainer,
                ]}
              />
              <ResourceWidget
                title="sources.Layouts"
                sources={[
                  Card,
                  FormGrid,
                  FormTab,
                  FormStep,
                  FormLayout,
                  FormCollapse,
                  Space,
                ]}
              />
              <ResourceWidget
                title="sources.Arrays"
                sources={[ArrayCards, ArrayTable]}
              />
              <ResourceWidget title="sources.Displays" sources={[Text]} />
            </CompositePanel.Item>
            <CompositePanel.Item title="panels.OutlinedTree" icon="Outline">
              <OutlineTreeWidget />
            </CompositePanel.Item>
            <CompositePanel.Item title="panels.History" icon="History">
              <HistoryWidget />
            </CompositePanel.Item>
            <CompositePanel.Item
              title="作用域编辑器"
              icon={<CodeOutlined></CodeOutlined>}
            >
              <ScopePanel></ScopePanel>
            </CompositePanel.Item>
            <CompositePanel.Item
              title="API编辑器"
              icon={<ApiOutlined></ApiOutlined>}
            >
              <ApiList></ApiList>
            </CompositePanel.Item>
          </CompositePanel>
          {panel === PANEL_CODES.SCOPE ? (
            <ScopeEditor></ScopeEditor>
          ) : panel === PANEL_CODES.API ? (
            <ApiEditor></ApiEditor>
          ) : (
            <React.Fragment>
              <Workspace id="form">
                <WorkspacePanel>
                  <ToolbarPanel>
                    <DesignerToolsWidget />
                    <ViewToolsWidget
                      use={["DESIGNABLE", "JSONTREE", "MARKUP", "PREVIEW"]}
                    />
                  </ToolbarPanel>
                  <ViewportPanel style={{ height: "100%" }}>
                    <ViewPanel type="DESIGNABLE">
                      {() => (
                        <ComponentTreeWidget
                          components={{
                            Form,
                            Field,
                            Input,
                            Select,
                            TreeSelect,
                            Cascader,
                            Radio,
                            Checkbox,
                            Slider,
                            Rate,
                            NumberPicker,
                            Transfer,
                            Password,
                            DatePicker,
                            TimePicker,
                            Upload,
                            Switch,
                            Text,
                            Card,
                            ArrayCards,
                            ArrayTable,
                            Space,
                            FormTab,
                            FormStep,
                            FormCollapse,
                            FormGrid,
                            FormLayout,
                            ObjectContainer,
                            Button,
                            ShadowModal,
                            ProArrayTable,
                          }}
                        />
                      )}
                    </ViewPanel>
                    <ViewPanel type="JSONTREE" scrollable={false}>
                      {(tree, onChange) => (
                        <SchemaEditorWidget tree={tree} onChange={onChange} />
                      )}
                    </ViewPanel>
                    <ViewPanel type="MARKUP" scrollable={false}>
                      {(tree) => <MarkupSchemaWidget tree={tree} />}
                    </ViewPanel>
                    <ViewPanel type="PREVIEW">
                      {(tree) => <PreviewWidget tree={tree} />}
                    </ViewPanel>
                  </ViewportPanel>
                </WorkspacePanel>
              </Workspace>
              <SettingsPanel title="panels.PropertySettings">
                <SettingsForm
                  effects={useScopeEffects}
                  uploadAction="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                />
              </SettingsPanel>
            </React.Fragment>
          )}
        </StudioPanel>
      </Designer>
    </FeatureProvider>
  );
};
