import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "src/components"),
      "@context": path.resolve(__dirname, "src/context"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@layout": path.resolve(__dirname, "src/layout"),
      "@services": path.resolve(__dirname, "src/services"),
      "@styles": path.resolve(__dirname, "src/styles"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@lib": path.resolve(__dirname, "src/lib"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@appTypes": path.resolve(__dirname, "src/types"),
      "@stores": path.resolve(__dirname, "src/stores"),
      "@localdata": path.resolve(__dirname, "localdata"),
    },
  },
  server: {
    port: 3000,
  },
});
