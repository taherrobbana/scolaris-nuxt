<template>
  <q-page padding>
    <div class="myCard">
      <div class="text-h5 q-mb-md">Mon stage</div>

      <q-form class="q-gutter-md">
        <q-input dense outlined v-model="stage.company" label="Entreprise" />
        <q-input dense outlined v-model="stage.subject" label="Sujet" />
        <q-input
          dense
          outlined
          v-model="stage.supervisor"
          label="Encadrant professionnel"
        />
        <q-input
          dense
          outlined
          v-model="stage.start"
          type="date"
          label="Date début"
        />
        <q-input
          dense
          outlined
          v-model="stage.end"
          type="date"
          label="Date fin"
        />

        <q-btn label="Mettre à jour" color="primary" />
      </q-form>
    </div>
  </q-page>
</template>

<script setup>
const stage = ref({
  company: "TechCorp",
  subject: "Plateforme de gestion des stages",
  supervisor: "M. Dupont",
  start: "2025-03-01",
  end: "2025-06-30",
});
</script>
