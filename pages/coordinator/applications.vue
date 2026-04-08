<template>
  <q-page padding>
    <div class="myCard">
      <div class="text-h5">Demandes de stage</div>

      <q-table class="q-mt-md" :rows="applications" :columns="columns" row-key="id">
        <template #body-cell-actions="props">
          <q-td style="text-align: center">
            <q-btn size="sm" icon="check" color="green" flat />
            <q-btn size="sm" icon="close" color="red" flat />
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup lang="ts">
const columns = [
  { name: "student", label: "Étudiant", field: "student", align: "center" },
  { name: "offer", label: "Offre", field: "offer", align: "center" },
  { name: "teacher", label: "Encadrant", field: "teacher", align: "center" },
  { name: "message", label: "Message", field: "message", align: "center" },
  { name: "actions", label: "Actions", field: "actions", align: "center" },
];

const applications = ref([
  {
    id: 1,
    student: "Ahmed",
    offer: "Stage Web",
    teacher: "Pr Ali",
    message: "Motivé",
  },
  {
    id: 2,
    student: "Sara",
    offer: "Stage Data",
    teacher: "Pr Mohamed",
    message: "Intéressée",
  },
]);

definePageMeta({
  middleware: 'auth',
  roles: ['coordinator'],
})

useHead({
  title: 'Candidatures',
})
</script>
