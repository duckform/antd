import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteRowOutlined,
  MenuUnfoldOutlined,
  PlusOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { DesignModal } from "../../common/DesignModal";

type IDesignProps = {
  ["data-designer-node-id"]: string;
} & Record<string, any>;

const pickNodeId = (props: IDesignProps) => {
  return {
    "data-designer-node-id": props["data-designer-node-id"],
  };
};

const SortHandle = (props: IDesignProps) => {
  return (
    <Button
      {...pickNodeId(props)}
      type="link"
      icon={<MenuUnfoldOutlined></MenuUnfoldOutlined>}
    ></Button>
  );
};

const Index = () => {
  return "#.1";
};

const Addition = (props: IDesignProps) => {
  return (
    <Button
      {...pickNodeId(props)}
      type="link"
      icon={<PlusOutlined></PlusOutlined>}
    >
      {props.title ?? "添加条目"}
    </Button>
  );
};

const ProAddition = DesignModal;
// (props: IDesignProps) => {
//   return (
//     <Button
//       {...pickNodeId(props)}
//       type="link"
//       icon={<PlusSquareOutlined></PlusSquareOutlined>}
//     >
//       {props.title ?? "添加条目"}
//     </Button>
//   );
// };

const Remove = (props: IDesignProps) => {
  return (
    <Button
      {...pickNodeId(props)}
      type="link"
      icon={<DeleteRowOutlined></DeleteRowOutlined>}
    ></Button>
  );
};

const MoveUp = (props: IDesignProps) => {
  return (
    <Button
      {...pickNodeId(props)}
      type="link"
      icon={<ArrowUpOutlined></ArrowUpOutlined>}
    ></Button>
  );
};

const MoveDown = (props: IDesignProps) => {
  return (
    <Button
      {...pickNodeId(props)}
      type="link"
      icon={<ArrowDownOutlined></ArrowDownOutlined>}
    ></Button>
  );
};

const DelegateAction = DesignModal;
// (props: IDesignProps) => {
//   return (
//     <Button {...pickNodeId(props)} type="link" icon={<EditOutlined></EditOutlined>}>
//       {props.title ?? "编辑"}
//     </Button>
//   );
// };

// biome-ignore lint/complexity/noUselessTypeConstraint: <explanation>
export const mixin = <T extends any>(o: T) => {
  return Object.assign(o, {
    SortHandle,
    Index,
    Addition,
    ProAddition,
    Remove,
    MoveDown,
    MoveUp,
    DelegateAction,
  });
};
