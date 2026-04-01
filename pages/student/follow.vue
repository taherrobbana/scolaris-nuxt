<template>
  <q-page padding>
    <div class="myCard">
      <div class="text-h5">Suivi de mon stage</div>

      <q-stepper v-model="step" vertical animated class="q-mt-md">
        <q-step :name="1" title="Upload journal">
          <q-file label="Journal PDF" />
        </q-step>

        <q-step :name="2" title="Validation journal (Entreprise)">
          <q-banner>En attente de validation</q-banner>
        </q-step>

        <q-step :name="3" title="Validation journal (Enseignant)" />

        <q-step :name="4" title="Upload rapport">
          <q-file label="Rapport PDF" />
        </q-step>

        <q-step :name="5" title="Validation rapport (Entreprise)" />
        <q-step :name="6" title="Validation rapport (Enseignant)" />
        <q-step :name="7" title="Soutenance" />
        <q-step :name="8" title="Feedback entreprise" />
        <q-step :name="9" title="Feedback enseignant" />
        <q-step :name="10" title="Attestation" />
      </q-stepper>

      <q-card class="q-mt-lg">
        <q-card-section>
          <div class="text-subtitle1">Journal de bord</div>
          <q-input dense outlined type="textarea" label="Entrée du journal" />
          <q-btn label="Ajouter" color="primary" class="q-mt-sm" />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
const step = ref(1);

definePageMeta({
  middleware: 'auth',
  roles: ['student'],
})

useHead({
  title: 'Suivi du stage - Plateforme Scolaire',
  link: [{ rel: 'icon', type: 'image/x-icon', href: '/sesameIcon.png' }],
})
</script>
