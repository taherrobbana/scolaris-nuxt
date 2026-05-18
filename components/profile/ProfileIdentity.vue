<template>
  <div class="q-pa-md">
    <div class="text-h6 q-mb-md">{{ $t('identity.title') }}</div>
    <q-form class="q-gutter-md">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-input v-model="authModule.firstName" :label="$t('identity.firstName')" outlined dense />
        </div>
        <div class="col-12 col-md-6">
          <q-input v-model="authModule.lastName" :label="$t('identity.lastName')" outlined dense />
        </div>
        <div class="col-12 col-md-6">
          <q-select v-model="authModule.gender" :options="genderOptions" :label="$t('identity.gender')" outlined dense emit-value map-options />
        </div>
        <div class="col-12 col-md-6">
          <q-input v-model="authModule.birthDate" :label="$t('identity.birthDate')" outlined dense type="date" stack-label />
        </div>
        <div class="col-12 col-md-6">
          <q-input v-model="authModule.birthPlace" :label="$t('identity.birthPlace')" outlined dense />
        </div>
        <div class="col-12 col-md-6">
          <q-input v-model="authModule.nationality" :label="$t('identity.nationality')" outlined dense />
        </div>
      </div>
      <div class="row justify-end q-mt-lg">
        <q-btn :label="$t('profile.save')" @click="saveIdentity" color="primary" :loading="loading" unelevated />
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthModule } from '~/stores/auth/authModule';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

const $q = useQuasar();
const { t } = useI18n();
const authModule = useAuthModule();
const loading = ref(false);

const genderOptions = computed(() => [
  { label: t('identity.genders.male'), value: 'M' },
  { label: t('identity.genders.female'), value: 'F' },
  { label: t('identity.genders.other'), value: 'O' }
]);

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
        message: t('identity.success')
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