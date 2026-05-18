<template>
  <q-card class="q-pa-md" style="max-width: 500px; width: 100%">
    <q-card-section>
      <div class="text-h6 text-center">{{ $t('auth.forgot.title') }}</div>
      <div class="text-center">
        {{ $t('auth.forgot.subtitle') }}
      </div>
    </q-card-section>

    <q-form @submit="sendRecoveryMail" class="q-gutter-y-md">
      <q-input
        v-model="loginForm.email"
        :label="$t('auth.fields.email')"
        type="email"
        outlined
        dense
        :rules="[
          (val) => !!val || $t('auth.validation.emailRequired'),
          (val) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val) || $t('auth.validation.emailInvalid'),
        ]"
      />

      <div class="text-center">
        <q-btn
          type="submit"
          color="primary"
          :label="$t('auth.forgot.send')"
          :loading="loading"
          class="full-width"
        />
      </div>

      <div class="text-center q-mt-md">
        <span class="text-caption">{{ $t('auth.forgot.notNeed') }}</span>
        <q-btn
          flat
          color="primary"
          :label="$t('auth.forgot.login')"
          @click="$emit('switch-to-login')"
          dense
          no-caps
        />
      </div>
      <div class="text-center q-mt-md q-mt-auto">
        <span class="text-caption">{{ $t('auth.forgot.noAccount') }} </span>
        <q-btn
          flat
          color="primary"
          :label="$t('auth.forgot.createAccount')"
          @click="$emit('switch-to-register')"
          dense
          no-caps
        />
      </div>
    </q-form>
  </q-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useAuthModule } from "~/stores/auth/authModule";

const $q = useQuasar();

const emit = defineEmits(["switch-to-register", "switch-to-login"]);
const authModule = useAuthModule();

const loginForm = ref({
  email: "",
});

const loading = ref(false);

const sendRecoveryMail = async () => {
  loading.value = true;
  await authModule.sendRecoveryMail(loginForm.value)
    .finally(() => {
      loading.value = false;
      emit("switch-to-login");
    });
};

onMounted(() => {
  loginForm.value = {
    email: "",
  };
});
</script>

<style scoped></style>
