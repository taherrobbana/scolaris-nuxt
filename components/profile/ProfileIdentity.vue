<template>
  <div class="q-pa-md">
    <div class="text-h6 q-mb-md">Informations d'identité</div>
    <q-form @submit="saveIdentity" class="q-gutter-md">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-input v-model="form.firstName" label="Prénom" outlined dense />
        </div>
        <div class="col-12 col-md-6">
          <q-input v-model="form.lastName" label="Nom" outlined dense />
        </div>
        <div class="col-12 col-md-6">
          <q-select v-model="form.gender" :options="genderOptions" label="Genre" outlined dense emit-value map-options />
        </div>
        <div class="col-12 col-md-6">
          <q-input v-model="form.birthDate" label="Date de naissance" outlined dense type="date" stack-label />
        </div>
        <div class="col-12 col-md-6">
          <q-input v-model="form.birthPlace" label="Lieu de naissance" outlined dense />
        </div>
        <div class="col-12 col-md-6">
          <q-input v-model="form.nationality" label="Nationalité" outlined dense />
        </div>
      </div>
      <div class="row justify-end q-mt-lg">
        <q-btn label="Enregistrer" type="submit" color="primary" :loading="loading" unelevated />
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthModule } from '~/stores/auth/authModule';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const authModule = useAuthModule();
const loading = ref(false);

const form = ref({
  firstName: authModule.getFirstName || '',
  lastName: authModule.getLastName || '',
  gender: authModule.getGender || '',
  birthDate: authModule.getBirthDate || '',
  birthPlace: authModule.getBirthPlace || '',
  nationality: authModule.getNationality || ''
});

const genderOptions = [
  { label: 'Masculin', value: 'M' },
  { label: 'Féminin', value: 'F' },
  { label: 'Autre', value: 'O' }
];

const saveIdentity = async () => {
  loading.value = true;
  try {
    const res = await authModule.updateProfile(form.value);
    if (res) {
      $q.notify({
        type: 'positive',
        message: 'Identité mise à jour avec succès'
      });
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss"></style>