<template>
  <client-only>
    <q-layout view="hHh lpR fFf" class="bg-grey-3">
      <Header @toggleLeftDrawer="toggleLeftDrawer" v-if="isUserLoggedIn && isRouteActive" />
      <q-drawer v-if="isUserLoggedIn && isRouteActive" show-if-above v-model="drawerModel" side="left"
        class="tw-side-nav" bordered :mini="!leftDrawerOpen">
        <SideBar :leftDrawerOpen="leftDrawerOpen" />
      </q-drawer>
      <q-page-container>
        <NuxtPage />
      </q-page-container>
    </q-layout>
  </client-only>
</template>
<script setup lang="ts">
import SideBar from "../components/SideBar.vue";
import Header from "../components/Header.vue";
import { useAuthModule } from "~/stores/auth/authModule";

const drawerModel = ref(true);
const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const router = useRouter();
const isRouteActive = computed(
  () =>
    router.currentRoute.value.fullPath !== "/login" &&
    !router.currentRoute.value.fullPath.startsWith("/reset-password"),
);
const authModule = useAuthModule();
const isUserLoggedIn = computed(() => authModule.isConnected);
</script>
<style lang="scss">
/* Reset complet */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body,
#__nuxt,
.q-layout {
  height: 100%;
  width: 100%;
}

/* Configuration du scroll */
.q-layout-container {
  height: 100%;
  overflow: hidden;
}

.q-page-container {
  height: 100%;
  overflow-y: auto;
  scroll-behavior: smooth;
}

/* Pour la sidebar */
.tw-side-nav {
  height: 100%;
  overflow-y: auto;
}

/* Cacher le scrollbar si nécessaire (optionnel) */
.q-page-container::-webkit-scrollbar {
  width: 8px;
}

.q-page-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.q-page-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.myCard {
  border: 16px !important;
  padding: 32px !important;
  border-radius: 8px !important;
  background-color: #ffffff !important;
}
</style>
