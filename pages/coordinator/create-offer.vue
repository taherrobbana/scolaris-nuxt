<template>
  <q-page padding>
    <div class="myCard">
      <div class="text-h5 q-mb-md">Créer une offre de stage</div>

      <q-form class="q-gutter-md" style="max-width: 600px">
        <q-input dense outlined v-model="offer.title" label="Titre" />
        <q-input dense outlined v-model="offer.description" type="textarea" label="Description" />
        <q-input dense outlined v-model="offer.technologies" label="Technologies" />
        <q-select dense outlined v-model="offer.type" :options="types" label="Type de stage" />
        <q-input dense outlined v-model="offer.period" label="Période" />
        <q-input dense outlined v-model="offer.slots" type="number" label="Nombre d'étudiants" />

        <q-btn label="Créer l'offre" color="primary" />
      </q-form>
    </div>
  </q-page>
</template>

<script setup lang="ts">
const types = ["Stage initiation", "Stage perfectionnement", "Stage PFE"];

const offer = ref({
  title: "",
  description: "",
  technologies: "",
  type: null,
  period: "",
  slots: 1,
});

definePageMeta({
  middleware: 'auth',
  roles: ['coordinator'],
})

useHead({
  title: 'Créer une offre - Plateforme Scolaire',
  link: [{ rel: 'icon', type: 'image/x-icon', href: '/sesameIcon.png' }],
})
</script>
