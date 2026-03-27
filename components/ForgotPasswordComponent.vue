<template>
  <q-card class="q-pa-md" style="max-width: 500px; width: 100%">
    <q-card-section>
      <div class="text-h6 text-center">Mot de passe oublié ?</div>
      <div class="text-center">
        Entrer ton email pour recevoire un lien de recuperation de ton mot de
        passe
      </div>
    </q-card-section>

    <q-form @submit="sendRecoveryMail" class="q-gutter-y-md">
      <q-input
        v-model="loginForm.email"
        label="Email"
        type="email"
        outlined
        dense
        :rules="[
          (val) => !!val || 'Email requis',
          (val) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val) || 'Email invalide',
        ]"
      />

      <div class="text-center">
        <q-btn
          type="submit"
          color="primary"
          label="Envoyer"
          :loading="loading"
          class="full-width"
        />
      </div>

      <div class="text-center q-mt-md">
        <span class="text-caption">Pas besoin ?</span>
        <q-btn
          flat
          color="primary"
          label="Se connecté"
          @click="$emit('switch-to-login')"
          dense
          no-caps
        />
      </div>
      <div class="text-center q-mt-md q-mt-auto">
        <span class="text-caption">Pas de compte ? </span>
        <q-btn
          flat
          color="primary"
          label="Créer un compte"
          @click="$emit('switch-to-register')"
          dense
          no-caps
        />
      </div>
    </q-form>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
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

  try {
    await authModule.sendRecoveryMail(loginForm.value).then((res: any) => {
      console.log("res", res);
      emit("switch-to-login");
    });
  } catch (error: any) {
    $q.notify({
      type: "negative",
      message: error.response?.data?.message || "Failed to send recovery mail",
    });
  } finally {
    loading.value = false;
  }

  onMounted(() => {
    loginForm.value = {
      email: "",
    };
  });
};
</script>
