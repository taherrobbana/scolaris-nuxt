<template>
  <q-header elevated :class="isDarkActive ? 'bg-grey-9 text-white' : 'bg-grey-1 text-primary'">
    <q-toolbar>
      <q-btn dense flat round icon="menu" @click="$emit('toggleLeftDrawer')" />
      <q-toolbar-title>
        <div class="header">
          <div class="logo-container">
            <img src="../public/sesameLogo.png" class="sesame-logo" @click="navigateTo('/')" />
          </div>
          <div>
            <q-btn flat no-caps @click="changeLanguage" icon="translate" :label="getLanguage === 'fr'
              ? 'Switch to English'
              : 'Passer en Français'
              " class="q-mr-sm" />
            <q-btn flat round :icon="numberOfNotifications > 0
              ? 'notifications_active'
              : 'notifications'
              " class="q-ml-xs">
              <q-badge v-if="numberOfNotifications > 0" rounded color="red" floating :label="numberOfNotifications"
                class="q-mt-xs" />
            </q-btn>
            <q-btn flat round class="q-ml-xs" @click="darkMode()">
              <transition name="icon" mode="out-in">
                <q-icon :key="isDarkActive ? 'moon' : 'sun'" :name="isDarkActive ? 'brightness_2' : 'wb_sunny'"
                  class="icon-transition" />
              </transition>
            </q-btn>
            <q-btn flat no-caps class="q-ml-xs" @click="navigateTo('/profile')">
              <q-icon left style="font-size: 25px" name="account_circle" />
              <!-- <q-icon left>
                <q-avatar style="font-size: 25px">
                  <img :src="studentPhotoBase64" />
                </q-avatar>
              </q-icon> -->
              <span>{{ fullName }}</span>
            </q-btn>
            <q-btn flat round icon="logout" class="q-ml-xs" @click="logout" />
          </div>
        </div>
      </q-toolbar-title>
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import { Dark } from "quasar";
import { useAuthModule } from "~/stores/auth/authModule";
import { useLangModule } from "~/stores/lang/langModule";
function navigateTo(path: string) {
  $router.push(path);
}

const numberOfNotifications = 2;
const getLanguage = computed(() => langModule.getLanguage);
const langModule = useLangModule();

const authModule = useAuthModule();
const fullName = computed(() => authModule.getFirstName + " " + authModule.getLastName);

function darkMode() {
  Dark.toggle();
}

const isDarkActive = computed(() => Dark.isActive);

const changeLanguage = () => {
  langModule.setLanguage();
};
const { $router } = useNuxtApp();

function logout() {
  authModule.initAuth();
  $router.push("/login");
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-left: 15px;
  padding-right: 15px;
}

.sesame-logo {
  width: 88px;
  height: auto;
  max-height: 40px;
  object-fit: contain;
  cursor: pointer;
}

.icon-transition {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.icon-enter-from,
.icon-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.icon-enter-to,
.icon-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
