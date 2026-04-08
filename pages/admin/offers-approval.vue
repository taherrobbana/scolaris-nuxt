<template>
  <q-page padding>
    <div class="myCard">
      <div class="text-h5">Approbation des offres de stage</div>

      <q-table class="q-mt-md" :rows="offers" :columns="columns" row-key="id">
        <template #body-cell-actions="props">
          <q-td style="text-align: center">
            <q-btn size="sm" color="green" icon="check" flat />
            <q-btn size="sm" color="red" icon="close" flat />
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup lang="ts">
const columns = [
  { name: "title", label: "Offre", field: "title", align: "center" },
  { name: "company", label: "Entreprise", field: "company", align: "center" },
  { name: "type", label: "Type", field: "type", align: "center" },
  { name: "slots", label: "Places", field: "slots", align: "center" },
  { name: "status", label: "Statut", field: "status", align: "center" },
  { name: "actions", label: "Actions", field: "actions", align: "center" },
];

const offers = ref([
  {
    id: 1,
    title: "Stage Web",
    company: "TechCorp",
    type: "Stage PFE",
    slots: 2,
    status: "En attente",
  },
  {
    id: 2,
    title: "Stage Data",
    company: "DataSoft",
    type: "Stage initiation",
    slots: 1,
    status: "En attente",
  },
]);

definePageMeta({
  middleware: 'auth',
  roles: ['admin'],
})

useHead({
  title: 'Validation des offres - Plateforme Scolaire',
})
</script>
