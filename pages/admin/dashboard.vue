<template>
  <q-page padding>
    <div class="myCard">
      <div class="text-h5">Dashboard Administrateur</div>

      <div class="row q-col-gutter-md q-mt-md">
        <q-card class="col-12 col-md-4">
          <q-card-section>
            <div class="text-subtitle1">Utilisateurs en attente</div>
            <div class="text-h6">{{ usersPending }}</div>
          </q-card-section>
        </q-card>

        <q-card class="col-12 col-md-4">
          <q-card-section>
            <div class="text-subtitle1">Offres en attente</div>
            <div class="text-h6">{{ offersPending }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
const usersPending = ref(2);
const offersPending = ref(2);

definePageMeta({
  middleware: 'auth',
  roles: ['admin'],
})

useHead({
  title: 'Dashboard administrateur - Plateforme Scolaire',
})
</script>
