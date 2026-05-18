<template>
  <q-header elevated :class="isDarkActive ? 'bg-grey-9 text-white' : 'bg-grey-1 text-primary'">
    <q-toolbar>
      <q-btn dense flat round icon="menu" @click="$emit('toggleLeftDrawer')" />
      <q-toolbar-title>
        <div class="header">
          <div class="logo-container">
            <img :src="!isDarkActive ? '/sesameLogo.png' : '/sesameDarkLogo.png'" class="sesame-logo"
              @click="navigateTo('/')" />
          </div>
          <div>
            <q-btn flat no-caps @click="changeLanguage" icon="translate" :label="$t('header.switchLanguage')" class="q-mr-sm" />
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
              <q-icon size="25px">
                <div v-if="avatar" style="margin-right: 10px !important;">
                  <img :src="avatar" style="width: 25px; height: 25px; border-radius: 50%;" />
                </div>
                <q-icon v-else left style="font-size: 25px" name="account_circle" />
              </q-icon>
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
import { ref, computed } from "vue";
import { Dark } from "quasar";
import { useAuthModule } from "~/stores/auth/authModule";
import { useLangModule } from "~/stores/lang/langModule";

const { $router } = useNuxtApp();

function navigateTo(path: string) {
  $router.push(path);
}

const numberOfNotifications = ref(2)
const langModule = useLangModule();
const getLanguage = computed(() => langModule.getLanguage);

const authModule = useAuthModule();
const firstName = computed(() => authModule.getFirstName);
const lastName = computed(() => authModule.getLastName);
const fullName = computed(() => firstName.value + " " + lastName.value);
const avatar = computed(() => authModule.getAvatar);

function darkMode() {
  Dark.toggle();
}

const isDarkActive = computed(() => Dark.isActive);

const changeLanguage = () => {
  langModule.setLanguage();
};

function logout() {
  authModule.initAuth();
  $router.push("/login");
}
</script>

<style scoped lang="scss">
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
