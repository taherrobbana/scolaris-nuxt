<template>
  <div class="login-page flex flex-center" @mousemove="onMouseMove">
    <!-- Interactive Mouse Glow -->
    <div class="mouse-glow" :class="{ active: hasMoved }" :style="glowStyle"></div>

    <!-- Animated Aurora Background Blobs -->
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
    <div class="blob blob-3"></div>

    <!-- Main Container -->
    <div class="auth-container q-pa-md">
      <q-card class="auth-glass-card q-pa-xl">
        <!-- Header -->
        <div class="text-center q-mb-xl">
          <div class="logo-container q-mb-md">
            <img src="/sesameLogo.png" class="brand-logo" alt="Scolaris Logo" />
          </div>
          <h2 class="text-h5 text-weight-bold text-primary q-mt-sm q-mb-xs">{{ $t("commun.welcome") }}</h2>
          <p class="text-subtitle2 text-grey-6">{{ $t('auth.reset.subtitle') }}</p>
        </div>

        <q-form @submit="resetPassword" class="q-gutter-y-lg">
          <q-input v-model="form.newPassword" :label="$t('auth.reset.newPassword')" :type="showPassword ? 'text' : 'password'"
            outlined rounded bg-color="white" class="custom-input" :rules="[
              (val) => !!val || $t('auth.reset.validation.passwordRequired'),
              (val) => val.length >= 6 || $t('auth.reset.validation.passwordMin'),
            ]">
            <template v-slot:prepend>
              <q-icon name="lock" color="grey-6" />
            </template>
            <template v-slot:append>
              <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer eye-icon"
                @click="showPassword = !showPassword" />
            </template>
          </q-input>

          <q-input v-model="form.confirmPassword" :label="$t('auth.reset.confirmPassword')"
            :type="showConfirmPassword ? 'text' : 'password'" outlined rounded bg-color="white" class="custom-input"
            :rules="[
              (val) => !!val || $t('auth.reset.validation.confirmRequired'),
              (val) => val === form.newPassword || $t('auth.reset.validation.mismatch'),
            ]">
            <template v-slot:prepend>
              <q-icon name="lock_reset" color="grey-6" />
            </template>
            <template v-slot:append>
              <q-icon :name="showConfirmPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer eye-icon"
                @click="showConfirmPassword = !showConfirmPassword" />
            </template>
          </q-input>

          <!-- Submit Button -->
          <div class="text-center q-mt-xl">
            <q-btn type="submit" color="primary" :loading="loading" class="submit-btn full-width" rounded unelevated>
              <div class="row items-center justify-center q-gutter-xs">
                <span class="text-weight-bold">{{ $t('auth.reset.submit') }}</span>
                <q-icon name="check_circle" size="18px" />
              </div>
            </q-btn>
          </div>

          <!-- Redirect Link -->
          <div class="text-center q-mt-lg">
            <span class="text-grey-7 text-caption">{{ $t('auth.reset.backToLogin') }} </span>
            <q-btn flat color="secondary" :label="$t('auth.reset.loginLink')" @click="router.push('/login')" dense no-caps
              class="hover-underline-secondary text-weight-bold" />
          </div>
        </q-form>
      </q-card>
    </div>

    <!-- Floating Language Selector -->
    <div class="floating-lang">
      <q-btn round color="primary" icon="translate" class="lang-btn" flat @click="changeLanguage">
        <q-tooltip class="bg-primary text-white" anchor="center left" self="center right">
          {{ $t('header.switchLanguage') }}
        </q-tooltip>
      </q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import { useAuthModule } from "~/stores/auth/authModule";
import { useLangModule } from "~/stores/lang/langModule";

const router = useRouter();
const token = router.currentRoute.value.params.id;

const $q = useQuasar();

const authModule = useAuthModule();
const langModule = useLangModule();
const { t } = useI18n();

const changeLanguage = () => {
  langModule.setLanguage();
};
const form = ref({
  token: token,
  newPassword: "",
  confirmPassword: "",
});
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const loading = ref(false);

const resetPassword = async () => {
  loading.value = true;
  await authModule.resetPassword(form.value)
    .finally(() => {
      loading.value = false;
    });
};

// Interactive mouse glow logic
const mouseX = ref(0);
const mouseY = ref(0);
const hasMoved = ref(false);

const onMouseMove = (event: MouseEvent) => {
  mouseX.value = event.clientX;
  mouseY.value = event.clientY;
  if (!hasMoved.value) hasMoved.value = true;
};

const glowStyle = computed(() => {
  return {
    transform: `translate3d(${mouseX.value}px, ${mouseY.value}px, 0) translate(-50%, -50%)`
  };
});

definePageMeta({
  layout: "default",
});

useHead({
  title: computed(() => t("useHead.reset-password.id")),
});
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  position: relative;
  background: #f1f5f9;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Interactive Mouse Glow Aura */
.mouse-glow {
  position: fixed;
  top: 0;
  left: 0;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle,
      rgba(34, 192, 194, 0.12) 0%,
      rgba(0, 71, 143, 0.04) 40%,
      rgba(255, 255, 255, 0) 70%);
  border-radius: 50%;
  pointer-events: none;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.8s ease, transform 0.1s cubic-bezier(0.25, 0.8, 0.25, 1);
  will-change: transform;
}

.mouse-glow.active {
  opacity: 1;
}

/* Background Animated Blobs */
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.55;
  z-index: 0;
  animation: float 20s infinite alternate ease-in-out;
}

.blob-1 {
  width: 450px;
  height: 450px;
  background: #00478F;
  /* Primary Scolaris Blue */
  top: -15%;
  left: -10%;
}

.blob-2 {
  width: 500px;
  height: 500px;
  background: #22C0C2;
  /* Secondary Scolaris Turquoise */
  bottom: -15%;
  right: -10%;
  animation-delay: -7s;
}

.blob-3 {
  width: 350px;
  height: 350px;
  background: rgba(156, 39, 176, 0.4);
  /* Accent soft purple */
  top: 40%;
  left: 45%;
  animation-duration: 25s;
}

@keyframes float {
  0% {
    transform: translate(0, 0) scale(1) rotate(0deg);
  }

  50% {
    transform: translate(60px, 40px) scale(1.15) rotate(180deg);
  }

  100% {
    transform: translate(-30px, -20px) scale(0.9) rotate(360deg);
  }
}

.auth-container {
  width: 100%;
  max-width: 800px;
  z-index: 10;
  position: relative;
}

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

/* Floating Language Bar */
.floating-lang {
  position: absolute;
  bottom: 24px;
  right: 24px;
  z-index: 20;
}

.lang-btn {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.lang-btn:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  background: #ffffff;
}

/* Hover Underline Effects */
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
