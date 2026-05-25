<template>
  <client-only>
    <q-layout view="hHh lpR fFf" :class="isDarkActive ? 'bg-grey-10 text-white' : 'bg-grey-3'">
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
import { computed, ref } from "vue";
import SideBar from "../components/SideBar.vue";
import Header from "../components/Header.vue";
import { useAuthModule } from "~/stores/auth/authModule";
import { useQuasar } from "quasar";

const $q = useQuasar();
const isDarkActive = computed(() => $q.dark.isActive);

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
  transition: background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
}

/* Styles globaux pour le mode sombre */
.body--dark {
  .myCard {
    background: rgba(30, 30, 30, 0.9) !important;
    color: #ffffff !important;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4) !important;
  }

  .users-table, .groups-table {
    background: #1d1d1d !important;
    color: #ffffff !important;
  }

  .q-table th, .q-table td {
    color: #ffffff !important;
  }

  .q-table__title {
    color: #ffffff !important;
  }

  .stat-card {
    background: #2d2d2d !important;
    color: #ffffff !important;
    border-color: #3d3d3d !important;
  }

  .auth-glass-card {
    background: rgba(30, 30, 30, 0.7) !important;
    border-color: rgba(255, 255, 255, 0.1) !important;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4) !important;
    color: #ffffff !important;
  }

  .lang-btn {
    background: rgba(30, 30, 30, 0.8) !important;
    border-color: rgba(255, 255, 255, 0.1) !important;
    color: #ffffff !important;
  }

  .q-list--bordered {
    border-color: #3d3d3d !important;
  }

  .q-item__label--caption {
    color: #b0b0b0 !important;
  }

  .text-grey-7, .text-grey-8, .text-faded {
    color: #b0b0b0 !important;
  }

  .text-primary {
    color: #58a6ff !important;
  }

  .q-tabs {
    color: #58a6ff !important;
  }
  
  .q-tab--active {
    color: #ffffff !important;
  }

  .bordered-section {
    background: #1d1d1d !important;
    border-color: #3d3d3d !important;
    color: #ffffff !important;
  }
}
</style>
