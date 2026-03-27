<template>
  <div class="q-pa-md flex flex-center bg-grey-3" style="min-height: 100vh">
    <LoginComponent
      v-if="componentToShow == 'LoginComponent'"
      @switch-to-register="componentToShow = 'RegisterComponent'"
      @switch-to-forgot-password="componentToShow = 'ForgotPasswordComponent'"
      :onLogin="handleLogin"
    />
    <RegisterComponent
      v-else-if="componentToShow == 'RegisterComponent'"
      @switch-to-login="componentToShow = 'LoginComponent'"
      @account-created="handleAccountCreated"
    />
    <ForgotPasswordComponent
      v-else-if="componentToShow == 'ForgotPasswordComponent'"
      @switch-to-login="componentToShow = 'LoginComponent'"
      @switch-to-register="componentToShow = 'RegisterComponent'"
    />
    <div style="position: absolute; top: 90%; right: 5%">
      <q-btn round color="grey" icon="translate" @click="changeLanguage" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import LoginComponent from "@/components/LoginComponent.vue";
import RegisterComponent from "@/components/RegisterComponent.vue";
import ForgotPasswordComponent from "@/components/ForgotPasswordComponent.vue";
import { useAuthModule } from "@/stores/auth/authModule";
import { useLangModule } from "@/stores/lang/langModule";

const componentToShow = ref("LoginComponent");
const authModule = useAuthModule();
const langModule = useLangModule();

const handleLogin = async (credentials) => {
  await authModule.login(credentials);
};

const handleAccountCreated = (userData) => {
  componentToShow.value = "LoginComponent";
};
const changeLanguage = () => {
  langModule.setLanguage();
};

onMounted(() => {
  authModule.setConnected(false);
});

definePageMeta({
  layout: "default",
});
</script>
