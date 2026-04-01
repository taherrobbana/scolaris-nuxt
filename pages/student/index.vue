<template>
  <q-page padding>
    <div class="myCard">
      <div class="text-h5 q-mb-md">Dashboard Étudiant</div>

      <div class="row">
        <q-card class="col-12 col-md-4" v-for="card in stats" :key="card.title">
          <q-card-section>
            <div class="text-subtitle1">{{ card.title }}</div>
            <div class="text-h6">{{ card.value }}</div>
          </q-card-section>
        </q-card>
      </div>

      <q-card class="q-mt-lg">
        <q-card-section>
          <div class="text-subtitle1">Timeline du stage</div>
        </q-card-section>
        <q-list>
          <q-item v-for="item in timeline" :key="item.label">
            <q-item-section>{{ item.label }}</q-item-section>
            <q-item-section side>
              <q-badge :color="item.done ? 'green' : 'orange'">
                {{ item.done ? "Validé" : "En attente" }}
              </q-badge>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
const stats = ref([
  { title: "Statut du stage", value: "En cours" },
  { title: "Documents validés", value: "3 / 5" },
  { title: "Soutenance", value: "Non planifiée" },
]);

const timeline = ref([
  { label: "Dépôt sujet", done: true },
  { label: "Validation enseignant", done: true },
  { label: "Rapport", done: false },
]);

definePageMeta({
  middleware: 'auth',
  roles: ['student'],
})

useHead({
  title: 'Dashboard étudiant - Plateforme Scolaire',
  link: [{ rel: 'icon', type: 'image/x-icon', href: '/sesameIcon.png' }],
})
</script>
