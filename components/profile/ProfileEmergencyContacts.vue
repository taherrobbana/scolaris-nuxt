<template>
  <div class="q-pa-md">
    <div class="text-h6 q-mb-md">{{ $t('emergency.title') }}</div>
    <q-form class="q-gutter-md">
      <div v-for="(contact, index) in authModule.emergencyContacts" :key="index" class="q-mb-lg q-pa-sm bordered-section">
        <div class="row items-center justify-between q-mb-sm">
          <div class="text-subtitle2">{{ $t('emergency.contactNum', { num: index + 1 }) }}</div>
          <q-btn flat round color="negative" icon="delete" size="sm" @click="removeContact(index)" v-if="authModule.emergencyContacts && authModule.emergencyContacts.length > 1" />
        </div>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-input v-model="contact.name" :label="$t('emergency.fullName')" outlined dense />
          </div>
          <div class="col-12 col-md-4">
            <q-input v-model="contact.relationship" :label="$t('emergency.relationship')" outlined dense />
          </div>
          <div class="col-12 col-md-4">
            <q-input v-model="contact.phone" :label="$t('emergency.phone')" outlined dense />
          </div>
        </div>
      </div>
      
      <div class="row q-gutter-sm">
        <q-btn :label="$t('emergency.add')" icon="add" flat color="secondary" @click="addContact" />
        <q-space />
        <q-btn :label="$t('profile.save')" @click="saveEmergency" color="primary" :loading="loading" unelevated />
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthModule } from '~/stores/auth/authModule';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

const $q = useQuasar();
const { t } = useI18n();
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
        message: t('emergency.success')
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