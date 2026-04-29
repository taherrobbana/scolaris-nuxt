<template>
  <q-card class="q-pa-md" style="max-width: 500px; width: 100%">
    <q-card-section>
      <div class="text-h6 text-center">Créer un compte</div>
    </q-card-section>

    <q-form @submit="onSubmit" class="q-gutter-y-md">
      <div style="display: flex; justify-content: space-between">
        <q-input v-model="form.firstName" label="First Name" outlined dense style="width: 48%"
          :rules="[(val) => !!val || 'First Name requis']" />
        <q-input v-model="form.lastName" label="Last Name" outlined dense style="width: 48%"
          :rules="[(val) => !!val || 'Last Name requis']" />
      </div>
      <q-input v-model="form.username" label="Email" type="email" outlined dense :rules="[
        (val) => !!val || 'Email requis',
        (val) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val) || 'Email invalide',
      ]" />

      <q-input v-model="form.password" label="Mot de passe" :type="showPassword ? 'text' : 'password'" outlined dense
        :rules="[
          (val) => !!val || 'Mot de passe requis',
          (val) => val.length >= 6 || 'Minimum 6 caractères',
        ]">
        <template v-slot:append>
          <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer"
            @click="showPassword = !showPassword" />
        </template>
      </q-input>

      <q-input v-model="form.confirmPassword" label="Confirmer le mot de passe"
        :type="showConfirmPassword ? 'text' : 'password'" outlined dense :rules="[
          (val) => !!val || 'Confirmation requise',
          (val) =>
            val === form.password || 'Les mots de passe ne correspondent pas',
        ]">
        <template v-slot:append>
          <q-icon :name="showConfirmPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer"
            @click="showConfirmPassword = !showConfirmPassword" />
        </template>
      </q-input>

      <div class="text-center">
        <q-btn type="submit" color="primary" label="Créer un compte" :loading="loading" class="full-width" />
      </div>

      <div class="text-center q-mt-md">
        <span class="text-caption">Déjà un compte ? </span>
        <q-btn flat color="primary" label="Se connecter" @click="$emit('switch-to-login')" dense no-caps />
      </div>
    </q-form>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useAuthModule } from "@/stores/auth/authModule";

const $q = useQuasar();

const emit = defineEmits(["switch-to-login", "account-created"]);

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
    .then(() => {
      emit("account-created", form.value);
      form.value = {
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        confirmPassword: "",
      };
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>
