<template>
  <q-page padding>
    <div class="myCard q-pa-lg">
      <div class="text-h5 text-primary text-weight-bold q-mb-lg">{{ $t('student.index.title') }}</div>

      <div class="row q-col-gutter-md">
        <!-- Stats Cards -->
        <div class="col-12 col-md-8">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4" v-for="card in stats" :key="card.title">
              <q-card class="stat-card" flat bordered>
                <q-card-section class="row items-center justify-between">
                  <div>
                    <div class="text-caption text-grey-7">{{ card.title }}</div>
                    <div class="text-h5 text-weight-bold">{{ card.value }}</div>
                  </div>
                  <q-avatar :color="card.color" text-color="white" :icon="card.icon" />
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
  roles: ['student'],
});

const stats = ref([
  { title: "Cours inscrits", value: "6", color: "primary", icon: "book" },
  { title: "Moyenne Générale", value: "14.5", color: "positive", icon: "assessment" },
  { title: "Absences", value: "2", color: "warning", icon: "event_busy" },
]);

useHead({
  title: computed(() => t('useHead.student.index')),
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
