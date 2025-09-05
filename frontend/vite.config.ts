import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Single-file JS+CSS, bundle EVERYTHING (react, react-dom, etc.),
// and only define values that esbuild accepts as JSON.
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
    // In case any dep checks `global` (Node-style)
    "global": "globalThis"
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    lib: {
      entry: "src/main.tsx",
      name: "navbar",
      formats: ["es"], // keep ESM so <script type="module"> works
      fileName: () => "app.js"
    },
    cssCodeSplit: false, // produce a single app.css
    rollupOptions: {
      external: [],               // bundle deps instead of externalizing
      output: {
        inlineDynamicImports: true,
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith(".css")) return "app.css";
          return "[name][extname]";
        }
      }
    }
  }
});
