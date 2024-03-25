import { useTheme } from "@duckform/react";
import React from "react";

const logo = {
  dark: "//img.alicdn.com/imgextra/i2/O1CN01NTUDi81fHLQvZCPnc_!!6000000003981-55-tps-1141-150.svg",
  light:
    "//img.alicdn.com/imgextra/i2/O1CN01Kq3OHU1fph6LGqjIz_!!6000000004056-55-tps-1141-150.svg",
};

export const LogoWidget: React.FC<React.PropsWithChildren> = () => {
  const theme = useTheme();
  const url = logo[theme as keyof typeof logo];
  return (
    <div style={{ display: "flex", alignItems: "center", fontSize: 14 }}>
      <img
        src={url}
        style={{ margin: "12px 8px", height: 18, width: "auto" }}
      />
    </div>
  );
};
