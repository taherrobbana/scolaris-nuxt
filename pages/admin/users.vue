<template>
  <q-page padding>
    <div class="myCard">
      <div class="text-h5">Gestion des utilisateurs</div>

      <q-btn label="Ajouter" color="primary" class="q-mb-md" />

      <q-table :rows="users" :columns="columns" row-key="id" />
    </div>
  </q-page>
</template>

<script setup>
const columns = [
  { name: "name", label: "Nom", field: "name", align: "center" },
  { name: "role", label: "Rôle", field: "role", align: "center" },
  { name: "email", label: "Email", field: "email", align: "center" },
];

const users = ref([
  { id: 1, name: "Admin", role: "ADMIN", email: "admin@uni.tn" },
  { id: 2, name: "Ahmed", role: "STUDENT", email: "ahmed@uni.tn" },
]);

definePageMeta({
  middleware: 'auth',
  roles: ['admin'],
})

useHead({
  title: 'Gestion des utilisateurs - Plateforme Scolaire',
  link: [{ rel: 'icon', type: 'image/x-icon', href: '/sesameIcon.png' }],
})
</script>
