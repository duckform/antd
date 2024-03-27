import { ITreeNode, TreeNode } from "@duckform/core";
import { MonacoInput } from "@duckform/react/settings-form";
import React from "react";
import { transformToSchema, transformToTreeNode } from "../utils/transformer";
import { useFeatureScope } from "../features/ctx";

export interface ISchemaEditorWidgetProps {
  tree: TreeNode;
  onChange?: (tree: ITreeNode) => void;
}

export const SchemaEditorWidget: React.FC<
  React.PropsWithChildren<ISchemaEditorWidgetProps>
> = (props) => {
  const scope = useFeatureScope();
  const scopeVars = Object.keys(scope.vars).reduce<string[]>(
    (lines, varName) => {
      lines.push(`${varName}: ${scope.vars[varName]}`);
      return lines;
    },
    [],
  );
  return (
    <div
      style={{
        height: "100%",
      }}
    >
      <div
        style={{
          height: 200,
          overflow: "hidden",
        }}
      >
        <MonacoInput
          height={"200px"}
          value={`const scope = {${scopeVars.join(",\n")}}`}
          language="javascript"
        />
      </div>
      <MonacoInput
        {...props}
        value={JSON.stringify(transformToSchema(props.tree), null, 2)}
        onChange={(value) => {
          props.onChange?.(transformToTreeNode(JSON.parse(value)));
        }}
        language="javascript"
      />
    </div>
  );
};
