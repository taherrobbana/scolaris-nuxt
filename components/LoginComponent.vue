<template>
  <q-card class="q-pa-md" style="max-width: 500px; width: 100%">
    <q-card-section>
      <div class="text-h6 text-center">{{ $t("commun.welcome") }}</div>
      <div class="text-h6 text-center">{{ $t("auth.login.title") }}</div>
    </q-card-section>

    <q-form @submit="onLogin" class="q-gutter-y-md">
      <q-input v-model="loginForm.username" :label="$t('auth.fields.email')" type="email" outlined dense :rules="[
        (val) => !!val || $t('auth.validation.emailRequired'),
        (val) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val) || $t('auth.validation.emailInvalid'),
      ]" />

      <q-input v-model="loginForm.password" :label="$t('auth.fields.password')" :type="showPassword ? 'text' : 'password'" outlined
        dense :rules="[(val) => !!val || $t('auth.validation.passwordRequired')]">
        <template v-slot:append>
          <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer"
            @click="showPassword = !showPassword" />
        </template>
      </q-input>

      <div class="text-center">
        <q-btn type="submit" color="primary" :label="$t('auth.login.submit')" :loading="loading" class="full-width" />
      </div>

      <div class="text-center q-mt-md">
        <span class="text-caption">{{ $t('auth.login.forgotPassword') }}</span>
        <q-btn flat color="primary" :label="$t('auth.login.recover')" @click="$emit('switch-to-forgot-password')"
          dense no-caps />
      </div>
      <div class="text-center q-mt-md q-mt-auto">
        <span class="text-caption">{{ $t('auth.login.noAccount') }} </span>
        <q-btn flat color="primary" :label="$t('auth.login.createAccount')" @click="$emit('switch-to-register')" dense no-caps />
      </div>
    </q-form>
  </q-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useAuthModule } from "@/stores/auth/authModule";

const authModule = useAuthModule();
const $q = useQuasar();

const emit = defineEmits(["switch-to-register", "switch-to-forgot-password"]);

const loginForm = ref({
  username: "",
  password: "",
});

const showPassword = ref(false);
const loading = ref(false);

const onLogin = async () => {
  loading.value = true;
  await authModule.login(loginForm.value)
    .finally(() => {
      loading.value = false;
    });
};

onMounted(() => {
  loginForm.value = {
    username: "",
    password: "",
  };
});
</script>

<style scoped></style>
