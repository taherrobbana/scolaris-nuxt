<template>
  <q-page padding>
    <div class="myCard">
      <div class="text-h5">Dashboard Enseignant</div>

      <q-table class="q-mt-md" title="Stages encadrés" :rows="stages" :columns="columns" row-key="student" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
const columns = [
  { name: "student", label: "Étudiant", field: "student", align: "center" },
  { name: "company", label: "Entreprise", field: "company", align: "center" },
  { name: "status", label: "Statut", field: "status", align: "center" },
];

const stages = ref([
  { student: "Ahmed Benali", company: "TechCorp", status: "En attente" },
  { student: "Sara Ali", company: "DataSoft", status: "Validé" },
]);

definePageMeta({
  middleware: 'auth',
  roles: ['teacher'],
})

useHead({
  title: 'Dashboard enseignant - Plateforme Scolaire',
})
</script>
