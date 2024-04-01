import { QuickEditor } from "./features/QuickEditor";

const json = {
  hello: "world",
  obj: { a: 1, b: 2 },
  arr: [1],
  arr2: [
    {
      x: 1,
      y: "",
    },
  ],
};

export const App = () => {
  return (
    <div style={{ padding: 40 }}>
      {/* <QuickEditor></QuickEditor> */}
      {/* <QuickTreeNode json={json}></QuickTreeNode> */}
    </div>
  );
};
