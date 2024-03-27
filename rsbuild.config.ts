import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { RsdoctorRspackPlugin } from "@rsdoctor/rspack-plugin";

export default defineConfig({
  plugins: [pluginReact()],

  tools: {
    rspack(config, { appendPlugins }) {
      // 仅在 RSDOCTOR 为 true 时注册插件，因为插件会增加构建耗时
      if (process.env.RSDOCTOR) {
        appendPlugins(
          new RsdoctorRspackPlugin({
            // 插件选项
          }),
        );
      }
    },
  },
  performance: {
    // chunkSplit: {
    //   strategy: "split-by-size",
    //   maxSize: 1024 * 150,
    // },
  },
  source: {
    alias: {
      "@duckform/core": "./node_modules/@duckform/core/dist/esm",
      "@duckform/core/shared": "./node_modules/@duckform/core/dist/esm/shared",
      "@duckform/react": "./node_modules/@duckform/react/dist/esm",
      "@duckform/react/settings-form":
        "./node_modules/@duckform/react/dist/esm/settings-form",
    },
    transformImport: [
      {
        libraryName: "antd",
        libraryDirectory: "es",
        style: "css",
      },
      {
        libraryName: "@ant-design",
        libraryDirectory: "icons",
      },
    ],
  },
});
