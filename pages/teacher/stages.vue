<template>
  <q-page padding>
    <div class="myCard">
      <div class="text-h5">Gestion des stages</div>

      <q-table class="q-mt-md" :rows="stages" :columns="columns" row-key="id">
        <template #body-cell-actions="props">
          <q-td style="text-align: center">
            <q-btn size="sm" flat icon="visibility" />
            <q-btn size="sm" flat icon="check" color="green" />
            <q-btn size="sm" flat icon="close" color="red" />
          </q-td>
        </template>
      </q-table></div
  ></q-page>
</template>

<script setup>
const columns = [
  { name: "student", label: "Étudiant", field: "student", align: "center" },
  { name: "company", label: "Entreprise", field: "company", align: "center" },
  { name: "status", label: "Statut", field: "status", align: "center" },
  { name: "actions", label: "Actions", field: "actions", align: "center" },
];

const stages = ref([
  { id: 1, student: "Ahmed", company: "TechCorp", status: "En attente" },
  { id: 2, student: "Sara", company: "DataSoft", status: "Validé" },
]);
</script>
