import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag === "mini-wujie",
        },
      },
    }),
  ],
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
});
