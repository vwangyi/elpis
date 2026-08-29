import { defineConfig } from "vite";

export default defineConfig({
  server: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    host: "0.0.0.0",
    port: 5175,
  },
});
