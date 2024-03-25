import { usePrefix } from "@duckform/react";
import { FormLayout, FormTab, Submit } from "@formily/antd";
import { createForm, onFieldReact } from "@formily/core";
import { FormProvider } from "@formily/react";
import { model, toJS } from "@formily/reactive";
import { observer } from "@formily/reactive-react";
import { Card, Collapse, Divider, Empty, Menu, Space } from "antd";
import "antd/es/input/style/index";
import { useMemo } from "react";
import { InputAddon } from "../InputAddon";
import { SchemaField, schema, watchPathParams } from "./schema";
import "./styles.less";
import { useFeatureApi } from "../ctx";

export type ApiEditorProps = {};

export const ApiList: React.FC = observer(() => {
  const prefix = usePrefix("api-editor");
  const api = useFeatureApi();

  return (
    <div className={prefix}>
      <Space direction="vertical" className="group-list">
        <InputAddon
          placeholder="添加Api分组 ⏎"
          onEnter={api.addGroup}
        ></InputAddon>
        <Collapse>
          {api.groups.map((group) => {
            return (
              <Collapse.Panel
                header={group}
                extra={
                  <InputAddon
                    size="small"
                    onClick={(e) => e.stopPropagation()}
                    placeholder="添加 Api ⏎"
                    addonAfter={false}
                    onEnter={(next) => {
                      const current = api.store[group];
                      if (!next || current?.[next]) return;
                      current[next.trim()] = {} as any;
                    }}
                  ></InputAddon>
                }
                key={group}
              >
                <Menu
                  mode="vertical"
                  onClick={({ key }) => {
                    api.active = key;
                  }}
                  style={{
                    margin: 0,
                    padding: 0,
                    borderRight: 0,
                    overflowY: "auto",
                    overflowX: "hidden",
                  }}
                  items={
                    api.store[group]
                      ? Object.keys(api.store[group]).map((key) => {
                          return { label: key, key: `${group}.${key}` };
                        })
                      : []
                  }
                ></Menu>
              </Collapse.Panel>
            );
          })}
        </Collapse>
      </Space>
    </div>
  );
});

export const ApiEditor: React.FC = observer(() => {
  const prefix = usePrefix("api-editor");
  const api = useFeatureApi();
  const form = useMemo(() => {
    return createForm({
      initialValues: toJS(api.current),
      effects(form) {
        onFieldReact("grid.url", (field) => {
          watchPathParams(form, field);
        });
      },
    });
  }, [api.current]);

  const formTab = FormTab.createFormTab();
  const scope = useMemo(() => {
    return { formTab };
  }, [form, formTab]);

  return (
    <div className={prefix}>
      {api.current ? (
        <FormProvider form={form}>
          <Card
            size="small"
            className="editor-wrapper"
            bodyStyle={{ flex: 1 }}
            title={
              api.active ? `编辑接口定义 ${api.active}` : "请选择要编辑的接口"
            }
            extra={
              <Submit
                onSubmit={(values) => {
                  Object.assign(api.current, toJS(values));
                }}
              >
                保存接口信息
              </Submit>
            }
          >
            <FormLayout>
              <SchemaField scope={scope} schema={schema}></SchemaField>
            </FormLayout>
          </Card>
        </FormProvider>
      ) : (
        <Empty
          className="editor-wrapper"
          description="请在左侧选择接口"
        ></Empty>
      )}
    </div>
  );
});
