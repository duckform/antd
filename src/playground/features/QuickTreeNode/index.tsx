import { TreeNode } from "@duckform/core";
import React, { useEffect, useMemo } from "react";
import { jsonSchemaToTreeNode, jsonToJSONSchema } from "../json";
import { observer } from "@formily/reactive-react";
import { SortableBox } from "./sortable";

export const QuickTreeNode = observer(
  (props: {
    json: any;
  }) => {
    const tree = useMemo(() => {
      const root = TreeNode.create(
        jsonSchemaToTreeNode(jsonToJSONSchema(props.json)),
      );
      // TODO: fill default components
      console.log(`🚀 ~ tree ~ root:`, root);
      return root;
    }, [props.json]);

    return (
      <div style={{ width: "400px" }}>
        <SortableBox root={tree}></SortableBox>
      </div>
    );
  },
);
