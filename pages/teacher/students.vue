<template>
  <q-page padding>
    <div class="myCard">
      <div class="text-h5">Mes étudiants</div>

      <q-table class="q-mt-md" :rows="rows" :columns="columns" row-key="id">
        <template #body-cell-action="props">
          <q-td style="text-align: center">
            <q-btn size="sm" label="Suivre" color="primary" />
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import type { QTableColumn } from '~/utils/types';

const columns: QTableColumn[] = [
  { name: "name", label: "Étudiant", field: "name", align: "center" },
  { name: "company", label: "Entreprise", field: "company", align: "center" },
  { name: "step", label: "Étape actuelle", field: "step", align: "center" },
  { name: "action", label: "Action", field: "action", align: "center" },
];

const rows = ref([
  { id: 1, name: "Ahmed Benali", company: "TechCorp", step: 3 },
  { id: 2, name: "Sara Ali", company: "DataSoft", step: 6 },
]);

definePageMeta({
  middleware: 'auth',
  roles: ['teacher'],
})

useHead({
  title: 'Mes étudiants - Plateforme Scolaire',
})
</script>
