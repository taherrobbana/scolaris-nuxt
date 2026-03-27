export default defineNuxtConfig({
  css: [
    "quasar/src/css/index.sass",
    "@quasar/extras/material-icons/material-icons.css",
    "vue-advanced-cropper/dist/style.css",
  ],
  vite: {
    define: {
      __QUASAR_VERSION__: JSON.stringify("2.0.0"),
    },
    server: {
      watch: {
        usePolling: true,
      },
    },
  },
  modules: ["@pinia/nuxt", "@pinia-plugin-persistedstate/nuxt"],
  build: {
    transpile: ["vue-advanced-cropper"],
  },
});
