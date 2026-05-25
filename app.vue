<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup lang="ts">
import { Dark, setCssVar } from "quasar";
import { useAuthModule } from "./stores/auth/authModule";

// TODO : temporaire, jusq'a fixer quasar-variable.scss
// if (process.client) {
//   setCssVar('primary', '#00478F');
//   setCssVar('secondary', '#22C0C2');
//   setCssVar('accent', '#9C27B0');
//   setCssVar('dark', '#1D1D1D');
//   setCssVar('positive', '#21BA45');
//   setCssVar('negative', '#C10015');
//   setCssVar('info', '#31CCEC');
//   setCssVar('warning', '#F2C037');
// }

const isDarkActive = computed(() => Dark.isActive);

const sesameIconPath = computed(() =>
  isDarkActive.value ? "/sesameDarkIcon.png" : "/sesameIcon.png",
);

const numberOfNotifications = ref(2);

const authModule = useAuthModule();
const isUserLoggedIn = computed(() => authModule.isConnected);

useHead({
  titleTemplate: (titleChunk) => {
    const prefix =
      isUserLoggedIn.value && numberOfNotifications.value > 0
        ? `(${numberOfNotifications.value}) `
        : "";
    const baseTitle = "Scolaire";

    return titleChunk && titleChunk !== baseTitle
      ? `${prefix}${titleChunk} - ${baseTitle}`
      : `${prefix}${baseTitle}`;
  },
  link: [{ rel: "icon", type: "image/x-icon", href: sesameIconPath }],
});
</script>
