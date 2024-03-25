import { GlobalRegistry } from "@duckform/core";
import { useDesigner } from "@duckform/react";
import { observer } from "@formily/react";
import { Button, Radio, Space } from "antd";
import { useEffect } from "react";
import { loadInitialSchema } from "../utils";
import { MagicWidget } from "./MagicWidget";
import { allowDropBefore, allowDropChildren, transform } from "../magic";
import { GithubOutlined } from "@ant-design/icons";

export const ActionsWidget = observer(() => {
  const designer = useDesigner();
  useEffect(() => {
    loadInitialSchema(designer);
  }, []);
  const supportLocales = ["zh-cn", "en-us"];
  useEffect(() => {
    if (!supportLocales.includes(GlobalRegistry.getDesignerLanguage())) {
      GlobalRegistry.setDesignerLanguage("zh-cn");
    }
  }, []);
  return (
    <Space>
      <Radio.Group
        value={GlobalRegistry.getDesignerLanguage()}
        optionType="button"
        options={[
          { label: "English", value: "en-us" },
          { label: "简体中文", value: "zh-cn" },
        ]}
        onChange={(e) => {
          GlobalRegistry.setDesignerLanguage(e.target.value);
        }}
      />
      <MagicWidget
        transform={transform}
        allowDropBefore={allowDropBefore}
        allowDropChildren={allowDropChildren}
      ></MagicWidget>
      <a
        href="https://github.com/duckform/antd"
        target="_blank"
        rel="noreferrer"
      >
        <Button icon={<GithubOutlined></GithubOutlined>}></Button>
      </a>
    </Space>
  );
});
