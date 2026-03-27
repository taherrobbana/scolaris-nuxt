<template>
  <q-page padding>
    <div class="myCard">
      <div class="text-h5">Approbation des utilisateurs</div>

      <q-table class="q-mt-md" :rows="users" :columns="columns" row-key="id">
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

<script setup>
const columns = [
  { name: "name", label: "Nom", field: "name", align: "center" },
  { name: "role", label: "Rôle", field: "role", align: "center" },
  { name: "email", label: "Email", field: "email", align: "center" },
  { name: "status", label: "Statut", field: "status", align: "center" },
  { name: "actions", label: "Actions", field: "actions", align: "center" },
];

const users = ref([
  {
    id: 1,
    name: "TechCorp",
    role: "COMPANY",
    email: "hr@techcorp.tn",
    status: "En attente",
  },
  {
    id: 2,
    name: "Pr Ali",
    role: "TEACHER",
    email: "ali@uni.tn",
    status: "En attente",
  },
]);
</script>
