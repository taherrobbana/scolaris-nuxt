<template>
  <div class="q-pa-md">
    <div class="text-h6 q-mb-md">Coordonnées de contact</div>
    <q-form @submit="saveContact" class="q-gutter-md">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-input v-model="form.username" label="Email" outlined dense readonly disable>
            <template v-slot:append>
              <q-icon name="lock" size="xs" />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-md-6">
          <q-input v-model="form.phone" label="Téléphone" outlined dense mask="## ### ###" unmasked-value />
        </div>
        <div class="col-12">
          <q-input v-model="form.address" label="Adresse" outlined dense type="textarea" rows="2" />
        </div>
        <div class="col-12 col-md-4">
          <q-input v-model="form.postalCode" label="Code Postal" outlined dense />
        </div>
        <div class="col-12 col-md-4">
          <q-input v-model="form.city" label="Ville" outlined dense />
        </div>
        <div class="col-12 col-md-4">
          <q-input v-model="form.country" label="Pays" outlined dense />
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
  username: authModule.getUsername || '',
  phone: authModule.getPhone || '',
  address: authModule.getAddress || '',
  postalCode: authModule.getPostalCode || '',
  city: authModule.getCity || '',
  country: authModule.getCountry || 'Tunisie'
});

const saveContact = async () => {
  loading.value = true;
  try {
    const res = await authModule.updateProfile(form.value);
    if (res) {
      $q.notify({
        type: 'positive',
        message: 'Coordonnées mises à jour avec succès'
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