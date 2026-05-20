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
      <transition name="fade-slide" mode="out-in">
        <LoginComponent v-if="componentToShow == 'LoginComponent'"
          @switch-to-register="componentToShow = 'RegisterComponent'"
          @switch-to-forgot-password="componentToShow = 'ForgotPasswordComponent'" />
        <RegisterComponent v-else-if="componentToShow == 'RegisterComponent'"
          @switch-to-login="componentToShow = 'LoginComponent'" />
        <ForgotPasswordComponent v-else-if="componentToShow == 'ForgotPasswordComponent'"
          @switch-to-login="componentToShow = 'LoginComponent'"
          @switch-to-register="componentToShow = 'RegisterComponent'" />
      </transition>
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
import { ref, computed, onMounted } from "vue";
import LoginComponent from "@/components/LoginComponent.vue";
import RegisterComponent from "@/components/RegisterComponent.vue";
import ForgotPasswordComponent from "@/components/ForgotPasswordComponent.vue";
import { useAuthModule } from "@/stores/auth/authModule";
import { useLangModule } from "@/stores/lang/langModule";

const componentToShow = ref("LoginComponent");
const authModule = useAuthModule();
const langModule = useLangModule();

const changeLanguage = () => {
  langModule.setLanguage();
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

onMounted(() => {
  authModule.initAuth();
});

definePageMeta({
  layout: "default",
});

useHead({
  title: "Connexion",
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
  transition: opacity 0.8s ease, transform 1s cubic-bezier(0.25, 0.8, 0.25, 1);
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

/* Page Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
