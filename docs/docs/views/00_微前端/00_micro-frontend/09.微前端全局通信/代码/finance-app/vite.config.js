import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import qiankun from "vite-plugin-qiankun";

const port = 5175;

export default defineConfig(({ command }) => {
  const useDevMode = command === "serve";
  const reactPlugins = useDevMode ? [] : [react()];

  return {
    plugins: [...reactPlugins, qiankun("finance-app", { useDevMode })],
    ...(useDevMode
      ? {
          esbuild: {
            jsx: "automatic",
            jsxImportSource: "react",
          },
        }
      : {}),
    server: {
      port,
      strictPort: true,
      cors: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
    preview: {
      port: 6175,
      strictPort: true,
    },
  };
});
