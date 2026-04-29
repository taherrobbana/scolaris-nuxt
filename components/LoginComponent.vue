<template>
  <q-card class="q-pa-md" style="max-width: 500px; width: 100%">
    <q-card-section>
      <div class="text-h6 text-center">{{ $t("commun.welcome") }}</div>
      <div class="text-h6 text-center">Connexion</div>
    </q-card-section>

    <q-form @submit="onLogin" class="q-gutter-y-md">
      <q-input v-model="loginForm.username" label="Email" type="email" outlined dense :rules="[
        (val) => !!val || 'Email requis',
        (val) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val) || 'Email invalide',
      ]" />

      <q-input v-model="loginForm.password" label="Mot de passe" :type="showPassword ? 'text' : 'password'" outlined
        dense :rules="[(val) => !!val || 'Mot de passe requis']">
        <template v-slot:append>
          <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer"
            @click="showPassword = !showPassword" />
        </template>
      </q-input>

      <div class="text-center">
        <q-btn type="submit" color="primary" label="Se connecter" :loading="loading" class="full-width" />
      </div>

      <div class="text-center q-mt-md">
        <span class="text-caption">Mot de passe oublié ?</span>
        <q-btn flat color="primary" label="Récupérer votre mot de passe" @click="$emit('switch-to-forgot-password')"
          dense no-caps />
      </div>
      <div class="text-center q-mt-md q-mt-auto">
        <span class="text-caption">Pas de compte ? </span>
        <q-btn flat color="primary" label="Créer un compte" @click="$emit('switch-to-register')" dense no-caps />
      </div>
    </q-form>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
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
