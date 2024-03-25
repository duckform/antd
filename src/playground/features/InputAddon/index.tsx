import { PlusOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { useState } from "react";

export interface InputAddon extends React.ComponentProps<typeof Input> {
  onEnter?: (value: string) => void;
  addonAfter?: boolean;
}
export const InputAddon: React.FC<InputAddon> = ({ onEnter, ...props }) => {
  const [v, setv] = useState(props.value as string);

  const onChange = (e: any) => {
    setv(e.target.value);
    props?.onChange?.(e);
  };

  return (
    <Input
      {...props}
      style={{ width: "100%", ...props.style }}
      value={v}
      onChange={onChange}
      onKeyDown={(e) => {
        const target = e.target as HTMLInputElement;
        if (e.key === "Enter") {
          onEnter?.(target.value?.trim());
          setv("");
        }
      }}
      addonAfter={
        props.addonAfter ? (
          <PlusOutlined
            onClick={() => {
              onEnter?.(v?.trim());
              setv("");
            }}
          ></PlusOutlined>
        ) : null
      }
    />
  );
};
