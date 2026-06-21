import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import Components from "unplugin-vue-components/vite";
import { PrimeVueResolver } from "@primevue/auto-import-resolver";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const apiTarget = (() => {
    const explicit = env.VITE_OTP_API_URL?.trim();

    if (explicit) return explicit.replace(/\/+$/, "");

    const ai = env.VITE_AI_API_URL?.trim();

    if (ai) {
      try {
        return new URL(ai).origin;
      } catch {
        return "";
      }
    }

    return "";
  })();

  return {
    base: env.VITE_BASE_URL || "/",
    plugins: [
      vue({
        template: {
          compilerOptions: {
            comments: false,
          },
        },
      }),
      tailwindcss(),
      Components({
        resolvers: [PrimeVueResolver()],
      }),
    ],

    resolve: {
      alias: {
        "@app": path.resolve(__dirname, "src/app"),
        "@shared": path.resolve(__dirname, "src/shared"),
        "@entities": path.resolve(__dirname, "src/entities"),
        "@features": path.resolve(__dirname, "src/features"),
        "@widgets": path.resolve(__dirname, "src/widgets"),
        "@pages": path.resolve(__dirname, "src/pages"),
        "@processes": path.resolve(__dirname, "src/processes"),
        "@": path.resolve(__dirname, "src"),
      },
    },

    server: {
      port: 5173,
      strictPort: true,
      proxy: apiTarget
        ? {
            "/api": {
              target: apiTarget,
              changeOrigin: true,
              secure: true,
            },
          }
        : undefined,
    },

    build: {
      outDir: "dist",
      sourcemap: false,
      rollupOptions: {
        onwarn(warning, warn) {
          const isVueUsePureAnnotation =
            warning.id?.includes("@vueuse/core") &&
            warning.message.includes(
              "contains an annotation that Rollup cannot interpret",
            );

          if (isVueUsePureAnnotation) return;

          warn(warning);
        },
        output: {
          manualChunks(id) {
            if (!id.includes("node_modules")) return;

            if (id.includes("firebase")) return "firebase";
            if (id.includes("@primeuix/styles")) return "primevue-styles";
            if (id.includes("@primeuix")) return "primevue-utils";
            if (id.includes("primevue") || id.includes("@primevue"))
              return "primevue";

            if (id.includes("vue-virtual-scroller")) return "virtual-scroller";
            if (id.includes("vue3-emoji-picker")) return "emoji-picker";
            if (id.includes("isomorphic-dompurify") || id.includes("dompurify"))
              return "dompurify";

            if (id.includes("@vueuse")) return "vueuse";
            if (id.includes("@heroicons")) return "heroicons";
            if (id.includes("zod")) return "zod";
            if (
              id.includes("/vue/") ||
              id.includes("/vue-router/") ||
              id.includes("/pinia/") ||
              id.includes("@vue/")
            )
              return "vue-core";

            return "vendor";
          },
        },
      },
    },
  };
});
