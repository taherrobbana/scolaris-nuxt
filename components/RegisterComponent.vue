<template>
  <q-card class="auth-glass-card q-pa-xl">
    <!-- Header -->
    <div class="text-center q-mb-xl">
      <div class="logo-container q-mb-md">
        <img src="/sesameLogo.png" class="brand-logo" alt="Scolaris Logo" />
      </div>
      <h2 class="text-h5 text-weight-bold text-primary q-mt-sm q-mb-xs">{{ $t('auth.register.title') }}</h2>
      <p class="text-subtitle2 text-grey-6">{{ $t('auth.register.subtitle') }}</p>
    </div>

    <!-- Registration Form -->
    <q-form @submit="onSubmit" class="q-gutter-y-md">
      <!-- Firstname & Lastname row -->
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6">
          <q-input v-model="form.firstName" :label="$t('auth.fields.firstName')" outlined rounded bg-color="white"
            class="custom-input" :rules="[(val) => !!val || $t('auth.validation.firstNameRequired')]">
            <template v-slot:prepend>
              <q-icon name="person" color="grey-6" />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-sm-6">
          <q-input v-model="form.lastName" :label="$t('auth.fields.lastName')" outlined rounded bg-color="white"
            class="custom-input" :rules="[(val) => !!val || $t('auth.validation.lastNameRequired')]">
            <template v-slot:prepend>
              <q-icon name="person_outline" color="grey-6" />
            </template>
          </q-input>
        </div>
      </div>

      <!-- Email input -->
      <q-input v-model="form.username" :label="$t('auth.fields.email')" type="email" outlined rounded bg-color="white"
        class="custom-input" :rules="[
          (val) => !!val || $t('auth.validation.emailRequired'),
          (val) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val) || $t('auth.validation.emailInvalid'),
        ]">
        <template v-slot:prepend>
          <q-icon name="mail" color="grey-6" />
        </template>
      </q-input>

      <!-- Password input -->
      <q-input v-model="form.password" :label="$t('auth.fields.password')" :type="showPassword ? 'text' : 'password'"
        outlined rounded bg-color="white" class="custom-input" :rules="[
          (val) => !!val || $t('auth.validation.passwordRequired'),
          (val) => val.length >= 6 || $t('auth.validation.passwordMin'),
        ]">
        <template v-slot:prepend>
          <q-icon name="lock" color="grey-6" />
        </template>
        <template v-slot:append>
          <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer eye-icon"
            @click="showPassword = !showPassword" />
        </template>
      </q-input>

      <!-- Confirm Password input -->
      <q-input v-model="form.confirmPassword" :label="$t('auth.fields.confirmPassword')"
        :type="showConfirmPassword ? 'text' : 'password'" outlined rounded bg-color="white" class="custom-input" :rules="[
          (val) => !!val || $t('auth.validation.confirmRequired'),
          (val) => val === form.password || $t('auth.validation.mismatch'),
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
            <span class="text-weight-bold">{{ $t('auth.register.submit') }}</span>
            <q-icon name="person_add" size="18px" />
          </div>
        </q-btn>
      </div>

      <!-- Footer/Login redirect link -->
      <div class="text-center q-mt-lg">
        <span class="text-grey-7 text-caption">{{ $t('auth.register.alreadyAccount') }} </span>
        <q-btn flat color="secondary" :label="$t('auth.register.login')" @click="$emit('switch-to-login')" dense no-caps
          class="hover-underline-secondary text-weight-bold" />
      </div>
    </q-form>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useAuthModule } from "@/stores/auth/authModule";

const $q = useQuasar();
const emit = defineEmits(["switch-to-login"]);
const authModule = useAuthModule();

const form = ref({
  firstName: "",
  lastName: "",
  username: "",
  password: "",
  confirmPassword: "",
});

const showPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);

const onSubmit = async () => {
  loading.value = true;
  await authModule.register(form.value)
    .finally(() => {
      loading.value = false;
    });
};
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
