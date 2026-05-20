<template>
  <q-page padding>
    <div class="myCard q-pa-lg">
      <div class="text-h5 text-primary text-weight-bold q-mb-lg">{{ $t('admin.index.title') }}</div>

      <!-- Stats Cards -->
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-3" v-for="stat in stats" :key="stat.title">
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

      <!-- Content -->
      <div class="row q-col-gutter-md q-mt-md">
        <!-- Recent Activity -->
        <div class="col-12 col-md-8">
          <q-card flat bordered>
            <q-card-section>
              <div class="text-h6 q-mb-md">{{ $t('admin.index.recentActivity') }}</div>
              <q-list separator>
                <q-item v-for="item in activities" :key="item.id">
                  <q-item-section avatar>
                    <q-icon :name="item.icon" :color="item.color" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ item.message }}</q-item-label>
                    <q-item-label caption>{{ item.date }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>

        <!-- Quick Links Component -->
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
  roles: ['admin'],
});

useHead({
  title: computed(() => t('useHead.admin.index'))
});

const stats = ref([
  { title: 'Total Étudiants', value: '1,250', color: 'primary', icon: 'school' },
  { title: 'Enseignants', value: '85', color: 'secondary', icon: 'person' },
  { title: 'Groupes Actifs', value: '42', color: 'positive', icon: 'group' },
  { title: 'Demandes en attente', value: '12', color: 'warning', icon: 'hourglass_empty' }
]);

const activities = ref([
  { id: 1, message: 'Nouvel utilisateur enregistré : John Doe', date: 'Il y a 10 min', icon: 'person_add', color: 'primary' },
  { id: 2, message: 'Groupe "Classe A" mis à jour', date: 'Il y a 1 heure', icon: 'edit', color: 'secondary' },
  { id: 3, message: 'Document validé pour Sarah Smith', date: 'Il y a 2 heures', icon: 'verified', color: 'positive' }
]);
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
