// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL,
    },
  },
  devtools: { enabled: true },

  build: {
    transpile: ["echarts", "vue-echarts"],
  },

  css: [
    "@unocss/reset/tailwind.css",
    "~/assets/css/main.css",
    "element-plus/dist/index.css",
  ],

  plugins: [
    "~/plugins/element-plus.ts",
    "~/plugins/axios.ts",
    "~/plugins/mjml.client.js",
    { src: "~/plugins/tiptap.client.js", mode: "client" },
    { src: "~/plugins/quill.js", mode: "client" },
  ],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  modules: [
    "@vueuse/nuxt",
    "@unocss/nuxt",
    ["@pinia/nuxt", { autoImports: ["defineStore", "acceptHMRUpdate"] }],
    "@nuxtjs/color-mode",
    "@vite-pwa/nuxt",
    "@nuxtjs/i18n",
    "@element-plus/nuxt",
  ],

  unocss: {
    // UnoCSS 옵션
    uno: true, // UnoCSS의 기본 프리셋 활성화
    attributify: true, // 속성 모드 활성화 (선택적)
    icons: true, // 아이콘 지원 활성화 (선택적)
    webFonts: true, // 웹 폰트 지원 활성화 (선택적)
    shortcuts: [
      // 사용자 정의 단축어
    ],
    rules: [
      // 사용자 정의 규칙
    ],
    // JIT 모드는 기본적으로 활성화되어 있습니다.
  },

  components: {
    dirs: ["pages/", "components/"],
    // components 하위의 파일들을 자동으로 import 합니다.
  },

  imports: {
    dirs: ["stores"],
    // stores 하위의 파일들을 자동으로 import 합니다.
  },

  // defineStore, acceptHMRUpdate를 일일히 선언하지 않아도 됩니다.
  vite: {
    server: {
      hmr: true, // pinia hot-fix
      proxy: {
        "/api": {
          target: "http://158.247.200.126:3001",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/scss/global.scss" as *;',
        },
      },
    },
  },

  compatibilityDate: "2024-09-05",
});
