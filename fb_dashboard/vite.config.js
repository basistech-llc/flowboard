import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Place dependencies in separate module to speedup updates
          if (id.includes("node_modules")) {
            if (id.includes("/@ant-design") || id.includes("/antd")) {
              return "antd";
            }
            if (id.includes("/rc-") || id.includes("/@rc-")) {
              return "rc";
            }
            return "vendor";
          } else {
            return "main";
          }
        },
      },
    },
    chunkSizeWarningLimit: 700, // kbytes, before gzip
  },
});
