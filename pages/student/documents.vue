<template>
  <q-page padding>
    <div class="myCard">
      <div class="text-h5 q-mb-md">Documents du stage</div>

      <q-table :rows="documents" :columns="columns" row-key="name">
        <template #body-cell-status="props">
          <q-td style="text-align: center">
            <q-badge :color="props.row.status === 'Validé' ? 'green' : 'orange'">
              {{ props.row.status }}
            </q-badge>
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup lang="ts">
const columns = [
  { name: "name", label: "Document", field: "name", align: "center" },
  { name: "status", label: "Statut", field: "status", align: "center" },
];

const documents = ref([
  { name: "Convention", status: "Validé" },
  { name: "Rapport", status: "En attente" },
  { name: "Attestation", status: "Manquant" },
]);

definePageMeta({
  middleware: 'auth',
  roles: ['student'],
})

useHead({
  title: 'Mes documents',
})
</script>
