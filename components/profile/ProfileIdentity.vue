<template>
  <div class="q-pa-md">
    <div class="text-h6 q-mb-md">Informations d'identité</div>
    <q-form class="q-gutter-md">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-input v-model="authModule.firstName" label="Prénom" outlined dense />
        </div>
        <div class="col-12 col-md-6">
          <q-input v-model="authModule.lastName" label="Nom" outlined dense />
        </div>
        <div class="col-12 col-md-6">
          <q-select v-model="authModule.gender" :options="genderOptions" label="Genre" outlined dense emit-value map-options />
        </div>
        <div class="col-12 col-md-6">
          <q-input v-model="authModule.birthDate" label="Date de naissance" outlined dense type="date" stack-label />
        </div>
        <div class="col-12 col-md-6">
          <q-input v-model="authModule.birthPlace" label="Lieu de naissance" outlined dense />
        </div>
        <div class="col-12 col-md-6">
          <q-input v-model="authModule.nationality" label="Nationalité" outlined dense />
        </div>
      </div>
      <div class="row justify-end q-mt-lg">
        <q-btn label="Enregistrer" @click="saveIdentity" color="primary" :loading="loading" unelevated />
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

const genderOptions = [
  { label: 'Masculin', value: 'M' },
  { label: 'Féminin', value: 'F' },
  { label: 'Autre', value: 'O' }
];

const saveIdentity = async () => {
  loading.value = true;
  try {
    const dataToUpdate = {
      firstName: authModule.firstName,
      lastName: authModule.lastName,
      gender: authModule.gender,
      birthDate: authModule.birthDate,
      birthPlace: authModule.birthPlace,
      nationality: authModule.nationality
    };
    const res = await authModule.updateProfile(dataToUpdate);
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