export default defineNuxtConfig({
  compatibilityDate: '2026-03-27',
  css: [
    "quasar/src/css/index.sass",
    "@quasar/extras/material-icons/material-icons.css",
    "vue-advanced-cropper/dist/style.css",
    'vue-cal/dist/vuecal.css',
  ],
  vite: {
    css: {
      preprocessorOptions: {
        sass: {
          // Cette option permet de masquer les avertissements de dépréciation
          logger: {
            warn(message, options) {
              if (options.deprecation && message.includes('import')) return
              console.warn(message)
            }
          },
          // Pour les versions très récentes de Sass
          silenceDeprecations: ['import'],
        },
      },
    },
    define: {
      __QUASAR_VERSION__: JSON.stringify("2.0.0"),
    },
    server: {
      watch: {
        usePolling: true,
      },
    },
  },
  runtimeConfig: {
    public: {
      authApiBase: process.env.SCOLARIS_AUTH_URI || 'http://localhost:8080/api/',
      subjectApiBase: process.env.SCOLARIS_SUBJECT_URI || 'http://localhost:3000/api/subjects',
    }
  },
  modules: ["@pinia/nuxt", "@pinia-plugin-persistedstate/nuxt", 'nuxt-quasar-ui'],
  quasar: {
    // Tu peux configurer tes plugins ici (ex: Notify, Dialog)
    plugins: ['Notify', 'Dialog'],
    extras: {
      fontIcons: ['material-icons']
    }
  },
  build: {
    transpile: ["vue-advanced-cropper"],
  },
});
