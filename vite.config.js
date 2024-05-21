import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.includes("swiper"),
        },
      },
    }),
    "./plugins/braintree.js",
    react(),
  ],
  server: {
    watch: {
      usePolling: true,
    },
  },
});
