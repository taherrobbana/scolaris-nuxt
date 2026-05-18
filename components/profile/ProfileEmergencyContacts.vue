<template>
  <div class="q-pa-md">
    <div class="text-h6 q-mb-md">Contacts d'urgence</div>
    <q-form class="q-gutter-md">
      <div v-for="(contact, index) in authModule.emergencyContacts" :key="index" class="q-mb-lg q-pa-sm bordered-section">
        <div class="row items-center justify-between q-mb-sm">
          <div class="text-subtitle2">Contact #{{ index + 1 }}</div>
          <q-btn flat round color="negative" icon="delete" size="sm" @click="removeContact(index)" v-if="authModule.emergencyContacts && authModule.emergencyContacts.length > 1" />
        </div>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-input v-model="contact.name" label="Nom complet" outlined dense />
          </div>
          <div class="col-12 col-md-4">
            <q-input v-model="contact.relationship" label="Lien de parenté" outlined dense />
          </div>
          <div class="col-12 col-md-4">
            <q-input v-model="contact.phone" label="Téléphone" outlined dense />
          </div>
        </div>
      </div>
      
      <div class="row q-gutter-sm">
        <q-btn label="Ajouter un contact" icon="add" flat color="secondary" @click="addContact" />
        <q-space />
        <q-btn label="Enregistrer" @click="saveEmergency" color="primary" :loading="loading" unelevated />
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthModule } from '~/stores/auth/authModule';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const authModule = useAuthModule();
const loading = ref(false);

onMounted(() => {
  if (!authModule.emergencyContacts || authModule.emergencyContacts.length === 0) {
    authModule.emergencyContacts = [{ name: '', relationship: '', phone: '' }];
  }
});

const addContact = () => {
  if (!authModule.emergencyContacts) {
    authModule.emergencyContacts = [];
  }
  authModule.emergencyContacts.push({ name: '', relationship: '', phone: '' });
};

const removeContact = (index: number) => {
  if (authModule.emergencyContacts) {
    authModule.emergencyContacts.splice(index, 1);
  }
};

const saveEmergency = async () => {
  loading.value = true;
  try {
    const dataToUpdate = {
      emergencyContacts: authModule.emergencyContacts
    };
    const res = await authModule.updateProfile(dataToUpdate);
    if (res) {
      $q.notify({
        type: 'positive',
        message: 'Contacts d\'urgence enregistrés'
      });
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
.bordered-section {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fafafa;
}
</style>