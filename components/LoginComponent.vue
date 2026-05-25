<template>
  <q-card class="auth-glass-card q-pa-xl">
    <!-- Header/Logo section -->
    <div class="text-center q-mb-xl">
      <div class="logo-container q-mb-md">
        <img src="/sesameLogo.png" class="brand-logo" alt="Scolaris Logo" />
      </div>
      <h2 class="text-h5 text-weight-bold text-primary q-mt-sm q-mb-xs">{{ $t("commun.welcome") }}</h2>
      <p class="text-subtitle2 text-grey-6">{{ $t("auth.login.title") }}</p>
    </div>

    <!-- Login Form -->
    <q-form @submit="onLogin" class="q-gutter-y-lg">
      <q-input v-model="loginForm.username" :label="$t('auth.fields.email')" type="email" outlined rounded
        bg-color="white" class="custom-input" :rules="[
          (val) => !!val || $t('auth.validation.emailRequired'),
          (val) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val) || $t('auth.validation.emailInvalid'),
        ]">
        <template v-slot:prepend>
          <q-icon name="mail" color="grey-6" />
        </template>
      </q-input>

      <q-input v-model="loginForm.password" :label="$t('auth.fields.password')"
        :type="showPassword ? 'text' : 'password'" outlined rounded bg-color="white" class="custom-input"
        :rules="[(val) => !!val || $t('auth.validation.passwordRequired')]">
        <template v-slot:prepend>
          <q-icon name="lock" color="grey-6" />
        </template>
        <template v-slot:append>
          <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer eye-icon"
            @click="showPassword = !showPassword" />
        </template>
      </q-input>

      <!-- Recovery link -->
      <div class="row justify-end q-mt-none">
        <q-btn flat color="primary" :label="$t('auth.login.forgotPassword')" @click="$emit('switch-to-forgot-password')"
          dense no-caps class="hover-underline text-caption" />
      </div>

      <!-- Action Button -->
      <div class="text-center q-mt-lg">
        <q-btn type="submit" color="primary" :loading="loading" class="submit-btn full-width" rounded unelevated>
          <div class="row items-center justify-center q-gutter-xs">
            <span class="text-weight-bold">{{ $t('auth.login.submit') }}</span>
            <q-icon name="arrow_forward" size="18px" class="btn-arrow" />
          </div>
        </q-btn>
      </div>

      <!-- Divider -->
      <div class="row items-center q-my-lg">
        <q-separator class="col" />
        <span class="q-px-sm text-grey-5 text-caption">{{ $t("commun.or") }}</span>
        <q-separator class="col" />
      </div>

      <!-- Registration link -->
      <div class="text-center">
        <span class="text-grey-7 text-caption">{{ $t('auth.login.noAccount') }} </span>
        <q-btn flat color="secondary" :label="$t('auth.login.createAccount')" @click="$emit('switch-to-register')" dense
          no-caps class="hover-underline-secondary text-weight-bold" />
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

<style scoped>
.auth-glass-card {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(20px);
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 20px 50px rgba(0, 71, 143, 0.08);
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.logo-container {
  display: inline-block;
  padding: 10px;
  border-radius: 20px;
}

.brand-logo {
  height: 80px;
  object-fit: contain;
}

/* Input Fields styling */
.custom-input :deep(.q-field__control) {
  border-radius: 14px;
  transition: all 0.3s ease;
}

.custom-input :deep(input:-webkit-autofill) {
  -webkit-box-shadow: 0 0 0 1000px white inset !important;
  -webkit-text-fill-color: #1e293b !important;
  box-shadow: 0 0 0 1000px white inset !important;
  transition: background-color 5000s ease-in-out 0s;
}

.custom-input :deep(.q-field__control:hover) {
  border-color: var(--q-primary);
}

.custom-input :deep(.q-field__control::before) {
  border-color: rgba(0, 0, 0, 0.08);
}

.eye-icon {
  color: #9e9e9e;
  transition: color 0.3s;
}

.eye-icon:hover {
  color: var(--q-primary);
}

/* Submit Button styling */
.submit-btn {
  height: 48px;
  background: linear-gradient(135deg, #00478F 0%, #002d5c 100%) !important;
  box-shadow: 0 8px 20px rgba(0, 71, 143, 0.2) !important;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(0, 71, 143, 0.3) !important;
}

.submit-btn:active {
  transform: translateY(1px);
}

.btn-arrow {
  transition: transform 0.3s ease;
}

.submit-btn:hover .btn-arrow {
  transform: translateX(4px);
}

/* Hover Underline Effects */
.hover-underline {
  position: relative;
  transition: color 0.3s;
}

.hover-underline::after {
  content: '';
  position: absolute;
  width: 0;
  height: 1px;
  bottom: 2px;
  left: 50%;
  background-color: var(--q-primary);
  transition: all 0.3s ease;
}

.hover-underline:hover::after {
  width: 100%;
  left: 0;
}

.hover-underline-secondary {
  position: relative;
  transition: color 0.3s;
}

.hover-underline-secondary::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: 2px;
  left: 50%;
  background-color: var(--q-secondary);
  transition: all 0.3s ease;
}

.hover-underline-secondary:hover::after {
  width: 100%;
  left: 0;
}
</style>
