import { TreeNode } from "@duckform/core";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { jsonSchemaToTreeNode, jsonToJSONSchema } from "../json";
import { observer } from "@formily/reactive-react";
import { SortableBox } from "./sortable";
import { CodeOutlined, PartitionOutlined } from "@ant-design/icons";
import { Space, Steps } from "antd";
import { JSONEditor } from "./json-editor";

const QuickTreeNode = observer(
  (props: {
    json: any;
    tree: ReturnType<typeof useRef<TreeNode>>;
  }) => {
    const tree = useMemo(() => {
      const root = TreeNode.create(
        jsonSchemaToTreeNode(jsonToJSONSchema(props.json)),
      );
      props.tree.current = root;
      return root;
    }, [props.json]);

    return (
      <div style={{ width: "800px" }}>
        <SortableBox root={tree}></SortableBox>
      </div>
    );
  },
);

const steps = [
  {
    key: "code",
    title: "JSON",
    icon: <CodeOutlined></CodeOutlined>,
  },
  {
    key: "tree",
    title: "加工",
    icon: <PartitionOutlined></PartitionOutlined>,
  },
];

const init = `{
  hello: 'world', 
  obj: { a: 1, b: 2 }, 
  obj2: { b: 2 }, 
  arr: [1], 
  arr2: [
    { 
      x: 1, 
      y: '' 
    }
  ]
}`;
export const QuickEditor = (props: {
  tree: ReturnType<typeof useRef<TreeNode>>;
}) => {
  const [current, setCurrent] = useState(0);
  const [json, setJson] = useState<any>();

  return (
    <div>
      <Space>
        <Steps
          current={current}
          items={steps}
          size="small"
          onChange={setCurrent}
        ></Steps>
      </Space>

      {current === 0 ? (
        <JSONEditor initialValue={init} onChange={setJson}></JSONEditor>
      ) : (
        <QuickTreeNode json={json} tree={props.tree}></QuickTreeNode>
      )}
    </div>
  );
};
