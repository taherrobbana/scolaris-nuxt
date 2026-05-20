<template>
  <q-page padding>
    <div class="myCard q-pa-lg">
      <div class="text-h5 text-primary text-weight-bold q-mb-lg">{{ $t('coordinator.index.title') }}</div>

      <!-- Stats Cards -->
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-8">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4" v-for="stat in stats" :key="stat.title">
              <q-card class="stat-card" flat bordered>
                <q-card-section class="row items-center justify-between">
                  <div>
                    <div class="text-caption text-grey-7">{{ stat.title }}</div>
                    <div class="text-h5 text-weight-bold">{{ stat.value }}</div>
                  </div>
                  <q-avatar :color="stat.color" text-color="white" :icon="stat.icon" />
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="col-12 col-md-4">
          <QuickLinks />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import QuickLinks from '~/components/QuickLinks.vue';

const { t } = useI18n();

definePageMeta({
  middleware: 'auth',
  roles: ['coordinator'],
});

const stats = ref([
  { title: 'Groupes Gérés', value: '5', color: 'primary', icon: 'diversity_3' },
  { title: 'Total Étudiants', value: '150', color: 'secondary', icon: 'school' },
  { title: 'Validations en attente', value: '3', color: 'warning', icon: 'pending_actions' }
]);

useHead({
  title: computed(() => t('useHead.coordinator.index')),
});
</script>

<style scoped>
.myCard {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
}
.stat-card {
  border-radius: 12px;
  transition: transform 0.2s;
}
.stat-card:hover {
  transform: translateY(-5px);
}
</style>
