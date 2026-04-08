<template>
  <q-page padding>
    <div class="myCard">
      <div class="text-h5">Évaluations</div>

      <q-table class="q-mt-md" :rows="rows" :columns="columns" row-key="id">
        <template #body-cell-action="props">
          <q-td style="text-align: center">
            <q-btn size="sm" label="Évaluer" color="primary" />
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup lang="ts">
const columns = [
  { name: "student", label: "Stagiaire", field: "student", align: "center" },
  { name: "period", label: "Période", field: "period", align: "center" },
  { name: "action", label: "Action", field: "action", align: "center" },
];

const rows = ref([
  { id: 1, student: "Yassine", period: "Mars - Juin" },
  { id: 2, student: "Lina", period: "Avril - Juillet" },
]);

definePageMeta({
  middleware: 'auth',
  roles: ['coordinator'],
})

useHead({
  title: 'Évaluations - Plateforme Scolaire',
  link: [{ rel: 'icon', type: 'image/x-icon', href: '/sesameIcon.png' }],
})
</script>
