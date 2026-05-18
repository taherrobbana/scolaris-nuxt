import { defineNuxtPlugin } from "nuxt/app";
import { createI18n } from "vue-i18n";
import { watch, computed } from "vue";
import { useLangModule } from "~/stores/lang/langModule";

export default defineNuxtPlugin(async (nuxtApp) => {
  const langModule = useLangModule();
  const language = computed(() => langModule.getLanguage);

  const messages = {
    fr: (await import("../locales/fr.json")).default,
    en: (await import("../locales/en.json")).default,
  };
  
  const i18n = createI18n({
    legacy: false,
    locale: language.value,
    fallbackLocale: "fr",
    messages,
  });

  watch(language as any, (newLang) => {
    i18n.global.locale.value = newLang;
  });

  nuxtApp.vueApp.use(i18n);

  return {
    provide: {
      t: i18n.global.t
    }
  };
});
