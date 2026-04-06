<template>
  <client-only>
    <q-layout view="hHh lpR fFf" class="bg-grey-3">
      <Header @toggleLeftDrawer="toggleLeftDrawer" v-if="isUserLoggedIn && isRouteActive" />
      <q-drawer v-if="isUserLoggedIn && isRouteActive" show-if-above v-model="drawerModel" side="left"
        class="tw-side-nav" bordered :mini="!leftDrawerOpen">
        <SideBar :leftDrawerOpen="leftDrawerOpen" />
      </q-drawer>
      <q-page-container class="page-container">
        <NuxtPage />
      </q-page-container>
    </q-layout>
  </client-only>
</template>
<script setup>
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
<style>
.myCard {
  border: 16px !important;
  padding: 32px !important;
  border-radius: 8px !important;
  background-color: #ffffff !important;
}

html,
body,
#__nuxt {
  height: 100%;
  margin: 0;
}
</style>
