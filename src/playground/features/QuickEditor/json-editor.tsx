import { WarningOutlined } from "@ant-design/icons";
import { Input, Tooltip } from "antd";
import { useEffect, useState } from "react";

export const JSONEditor = (props: {
  initialValue?: string;
  onChange: (json: any) => void;
}) => {
  const [error, setError] = useState("");
  const [input, setInput] = useState(props.initialValue);

  useEffect(() => {
    try {
      const run = new Function(`return ${input}`);
      const parsed = run();
      props.onChange(parsed);
    } catch (error) {
      console.log(`🚀 ~ useEffect ~ error:`, error);
      setError(error);
    }
  }, [input]);

  return (
    <div style={{ width: "100%", position: "relative" }}>
      <Tooltip title={error.toString()}>
        <span style={{ position: "absolute", top: 8, zIndex: 10, right: 16 }}>
          <WarningOutlined
            style={{ color: error ? "#ff055c" : "#cecece" }}
          ></WarningOutlined>
        </span>
      </Tooltip>
      <Input.TextArea
        style={{ borderColor: error ? "#ff055c" : "#cecece" }}
        value={input}
        // bordered={false}
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
    </div>
  );
};
