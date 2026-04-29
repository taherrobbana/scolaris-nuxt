<template>
  <div class="q-pa-md flex flex-center bg-grey-3" style="min-height: 100vh">
    <q-card class="q-pa-md" style="max-width: 500px; width: 100%">
      <q-card-section>
        <div class="text-h6 text-center">{{ $t("commun.welcome") }}</div>
        <div class="text-center">
          Merci de saisir votre nouveau mot de passe
        </div>
      </q-card-section>

      <q-form @submit="resetPassword" class="q-gutter-y-md">
        <q-input v-model="form.newPassword" label="Nouveau mot de passe" :type="showPassword ? 'text' : 'password'"
          outlined dense :rules="[
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
              val === form.newPassword ||
              'Les mots de passe ne correspondent pas',
          ]">
          <template v-slot:append>
            <q-icon :name="showConfirmPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer"
              @click="showConfirmPassword = !showConfirmPassword" />
          </template>
        </q-input>

        <div class="text-center">
          <q-btn type="submit" color="primary" label="Réinitialiser mot de passe" :loading="loading"
            class="full-width" />
        </div>
        <div class="text-center q-mt-md">
          <span class="text-caption">Revenir à l'écran de connexion ? </span>
          <q-btn flat color="primary" label="Se connecté" @click="router.push('/login')" dense no-caps />
        </div>
      </q-form>
    </q-card>
    <div style="position: absolute; top: 90%; right: 5%">
      <q-btn round color="grey" icon="translate" @click="changeLanguage" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useAuthModule } from "~/stores/auth/authModule";
import { useLangModule } from "~/stores/lang/langModule";

const router = useRouter();
const token = router.currentRoute.value.query.token;

const $q = useQuasar();

const emit = defineEmits(["switch-to-register", "switch-to-login"]);
const authModule = useAuthModule();
const langModule = useLangModule();
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

  try {
    await authModule.resetPassword(form.value);
  } catch (error: any) {
    $q.notify({
      type: "negative",
      message: error.response?.data?.message || "Failed to reset password",
    });
  } finally {
    loading.value = false;
  }
};

definePageMeta({
  layout: "default",
});

useHead({
  title: "Réinitialiser le mot de passe",
});
</script>
