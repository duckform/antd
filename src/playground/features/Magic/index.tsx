import {
  CodeOutlined,
  DeleteOutlined,
  PartitionOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Empty,
  Input,
  Popconfirm,
  Radio,
  Select,
  Space,
  Steps,
  Switch,
  Tag,
  Tooltip,
} from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DnDTree } from "./DnDTree";
import { JSONSchemaLite, toJSONSchema } from "./json-schema";
import { addVoidTo, allowDrop, buildSchemaTree, onDropInsert } from "./magic";
import { ISchemaTreeNode } from "./shared";

const removeById = (id: string, tree: ISchemaTreeNode[]) => {
  if (!tree) return;
  return tree.map((child, idx) => {
    if (child.id === id) {
      tree.splice(idx, 1);
    } else {
      return removeById(id, child.children);
    }
  });
};

const setPropsOf = (setter: any) => {
  return (neo) =>
    setter((old) => ({
      ...old,
      props: {
        ...old.props,
        ...neo,
      },
    }));
};

const boxOptions: React.ComponentProps<typeof Radio.Group>["options"] = [
  {
    label: "排除根节点",
    value: "unbox",
  },
  {
    label: "包含根节点",
    value: "boxed",
  },
];

interface SchemaNodeProps {
  data: ISchemaTreeNode;
  transform?: (node: ISchemaTreeNode, by: string) => ISchemaTreeNode;
  requestUpdate: () => void;
  remove: (id: string) => void;
  boxing?: "unbox" | "boxed";
  onBoxingChange?: (box: "unbox" | "boxed") => void;
}

const useSchemaNode = (props: SchemaNodeProps) => {
  const [node, setNode] = useState(props.transform(props.data, "init"));
  const name = useMemo(() => node.props.name, [node.props.name]);
  const title = useMemo(() => node.props.title, [node.props.title]);
  const component = useMemo(
    () => node.props["x-component"],
    [node.props["x-component"]],
  );
  const decorator = useMemo(
    () => node.props["x-decorator"],
    [node.props["x-decorator"]],
  );

  useEffect(() => {
    // stop init
    if (!component) return;
    setNode((n) => {
      // revert if exist
      const clone = n.revert ? JSON.parse(JSON.stringify(n.revert)) : n.revert;
      const origin = n.revert ?? n;
      origin.props["x-component"] = component;
      origin.props["x-decorator"] = decorator;
      n.state.visited = false;
      const neo = props.transform(
        { ...n, ...origin, state: n.state },
        "component change",
      );
      // rewrite
      const next = Object.assign(n, neo);
      n.revert = clone;

      return next;
    });
    setTimeout(() => {
      // 反模式
      Object.assign(props.data, node);
      props.requestUpdate();
    });
  }, [component, decorator]);

  const setProps = useMemo(() => {
    return setPropsOf(setNode);
  }, []);

  const setName = useCallback(
    (e: any) => {
      const neo = e.target ? (e.target as HTMLInputElement).value : e;
      setProps({ name: neo });
    },
    [setProps],
  );
  const setTitle = useCallback(
    (e: any) => {
      const neo = e.target ? (e.target as HTMLInputElement).value : e;
      setProps({ title: neo });
    },
    [setProps],
  );

  const setComponent = useCallback(
    (neo: string) => {
      setProps({ ["x-component"]: neo });
    },
    [setProps],
  );
  const setDecorator = useCallback(
    (neo: string) => {
      setProps({ ["x-decorator"]: neo });
    },
    [setProps],
  );

  const options = useMemo(() => {
    const opts = node.props["x-component-options"] ?? [];
    return opts.map((item) => {
      return {
        key: item,
        label: item,
        value: item,
      };
    });
  }, [node.props["x-component-options"]]);

  const addVoid = useCallback(() => {
    addVoidTo(node);
    props.requestUpdate();
  }, [node]);

  const setters = useMemo(() => {
    return {
      name: setName,
      title: setTitle,
      component: setComponent,
      decorator: setDecorator,
      addVoid,
      remove: () => props.remove(node.id),
    };
  }, [setName, addVoid, setTitle, setComponent, decorator, setDecorator]);

  const vals = useMemo(() => {
    return { name, decorator, component, options, title };
  }, [name, decorator, component, title, options]);
  return [node, setters, vals] as const;
};

const SchemaNode = (props: SchemaNodeProps) => {
  const [node, setters, vals] = useSchemaNode(props);
  const noName = useMemo(() => {
    // 只做一次判断
    return !node.props.name ?? node.key === "root";
  }, []);

  const isRoot = node.key === "root";
  const canChangeComponent = !isRoot || props.boxing === "boxed";

  const switcher = useMemo(() => {
    return (
      <Switch
        checkedChildren="FormItem"
        unCheckedChildren="--"
        checked={!!vals.decorator}
        onChange={(b) => {
          if (b) {
            setters.decorator("FormItem");
          } else {
            setters.decorator(undefined);
          }
        }}
      ></Switch>
    );
  }, [vals.decorator]);

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        justifyContent: "space-between",
      }}
    >
      <Space>
        <Tooltip title={node.key}>
          <Tag color={getColor(node.props.type)}>{node.props.type}</Tag>
        </Tooltip>
        {noName ? null : (
          <Input value={vals.name} onChange={setters.name}></Input>
        )}
        {/Array(\W|\w)+\.Column$/.test(node.props["x-component"]) ? (
          vals.component
        ) : canChangeComponent ? (
          <Select
            style={{ width: "170px" }}
            value={vals.component}
            onChange={setters.component}
            options={vals.options}
            placeholder="x-component"
          ></Select>
        ) : null}
      </Space>

      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        {isRoot ? (
          <Space>
            {canChangeComponent ? switcher : null}
            <Radio.Group
              options={boxOptions}
              defaultValue={"boxed"}
              value={props.boxing}
              onChange={(e) => props.onBoxingChange(e.target.value)}
              optionType="button"
              buttonStyle="solid"
            ></Radio.Group>
          </Space>
        ) : (
          <Space>
            {switcher}
            {node.children ? (
              <Tooltip title="添加 Void 节点">
                <Button
                  onClick={setters.addVoid}
                  type="link"
                  icon={<PlusOutlined></PlusOutlined>}
                ></Button>
              </Tooltip>
            ) : (
              <Button></Button>
            )}
            <Popconfirm
              title="确定要删除吗？"
              okText="朕意已决!"
              cancelText="朕再想想..."
              onConfirm={setters.remove}
            >
              <Button
                type="link"
                icon={<DeleteOutlined></DeleteOutlined>}
              ></Button>
            </Popconfirm>
          </Space>
        )}
      </div>
    </div>
  );
};

const getColor = (x: JSONSchemaLite["type"]) => {
  switch (x) {
    case "string":
      return "green";
    case "number":
      return "geekblue";
    case "boolean":
      return "yellow";
    case "object":
      return "purple";
    case "array":
      return "magenta";
    default:
      return "default";
  }
};

export interface MagicProps
  extends Pick<
    React.ComponentProps<typeof DnDTree>,
    "allowDropBefore" | "allowDropChildren"
  > {
  transform: SchemaNodeProps["transform"];
  onChange?: (tree: ISchemaTreeNode[], includRoot: boolean) => void;
}

export const Magic = (props: MagicProps) => {
  const [input, setInput] = useState(
    `
{
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
}
`.trim(),
  );
  // const engine = useDesigner();
  const [tree, setTree] = useState<ISchemaTreeNode[]>([]);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const allowNodeDrop = useMemo(() => {
    return allowDrop(tree[0]);
  }, [tree[0]]);

  const [boxing, setBoxing] = useState<"boxed" | "unbox">("boxed");

  useEffect(() => {
    try {
      const run = new Function(`return ${input}`);
      const parsed = run();
      // setLoading(true);
      const schema = toJSONSchema(parsed);
      setTree([buildSchemaTree(schema)]);
      // .then(([root, defs]) => {
      //   setTree([buildSchemaTree(resolveRefs(root, defs))]);
      // })
      // .finally(() => {
      //   setLoading(false);
      // });
    } catch (error: any) {
      setError(`输入不合法， 请检查, ${error.message}`);
    }
  }, [input]);

  // const insertInto = () => {
  //   const root = tree[0];

  //   insertToNode(engine, root, boxing === "boxed");
  // };

  useEffect(() => {
    props.onChange?.(tree, boxing === "boxed");
  }, [tree]);

  const remove = useCallback((id: string) => {
    setTree((pre) => {
      removeById(id, pre);
      return [...pre];
    });
  }, []);

  const steps = useMemo(() => {
    return [
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
  }, []);

  return (
    <Card
      size="small"
      title={
        <Space>
          <Steps
            size="small"
            current={step}
            onChange={setStep}
            items={steps}
          ></Steps>
        </Space>
      }
      bordered={false}
    >
      {steps[step].key === "tree" ? (
        tree.length > 0 ? (
          <DnDTree
            data={tree}
            allowDrop={allowNodeDrop}
            allowDropBefore={props.allowDropBefore}
            allowDropChildren={props.allowDropChildren}
            onDropInsert={(to, source, target) => {
              onDropInsert(tree, to, source, target);
              setTree((t) => [...t]);
            }}
            render={(data) => {
              return (
                <SchemaNode
                  key={data.id}
                  boxing={boxing}
                  onBoxingChange={setBoxing}
                  transform={props.transform}
                  data={data}
                  remove={remove}
                  requestUpdate={() => {
                    setTree((t) => [...t]);
                  }}
                ></SchemaNode>
              );
            }}
          ></DnDTree>
        ) : loading ? (
          <Empty description="Loading..."></Empty>
        ) : (
          <div onClick={() => setStep(0)}>
            <Empty
              description={<Button type="link">返回添加 JSON</Button>}
            ></Empty>
          </div>
        )
      ) : (
        <Space direction="vertical" style={{ width: "100%" }}>
          {error ? (
            <Alert type="error" message={error}></Alert>
          ) : (
            <Alert message="在下方输入JSON" type="info"></Alert>
          )}
          <Input.TextArea
            value={input}
            bordered={false}
            rows={30}
            placeholder={`
{ input: 'some',
  { 
    json: 'object',
    here: true 
  } 
}
            `.trim()}
            onChange={(e) => {
              setError("");
              setInput(e.target.value);
            }}
          ></Input.TextArea>
        </Space>
      )}
    </Card>
  );
};
