<template>
  <q-page padding>
    <div class="myCard">
      <div class="text-h5">Suivi des stages</div>

      <q-select dense outlined class="q-mb-md" v-model="selectedStudent" :options="students"
        label="Choisir un stagiaire" />

      <q-stepper v-model="step" vertical animated>
        <q-step :name="2" title="Validation journal">
          <q-input dense outlined type="textarea" label="Commentaire" />
          <div style="padding-top: 5px">
            <q-btn label="Valider" color="green" />
            <q-btn label="Refuser" color="red" class="q-ml-sm" />
          </div>
        </q-step>

        <q-step :name="5" title="Validation rapport">
          <q-input dense outlined type="textarea" label="Commentaire" />
          <div style="padding-top: 5px">
            <q-btn label="Valider" color="green" />
            <q-btn label="Refuser" color="red" class="q-ml-sm" />
          </div>
        </q-step>

        <q-step :name="8" title="Feedback final">
          <q-input dense outlined type="textarea" label="Feedback" />
          <div style="padding-top: 5px">
            <q-btn label="Envoyer" color="primary" />
          </div>
        </q-step>

        <q-step :name="10" title="Attestation">
          <q-file v-model="attestationFile" dense outlined label="Uploader attestation PDF" accept=".pdf" />
        </q-step>
      </q-stepper>
    </div>
  </q-page>
</template>

<script setup lang="ts">
const students = ["Ahmed", "Sara"];
const selectedStudent = ref(null);
const attestationFile = ref(null);
const step = ref(2);

definePageMeta({
  middleware: 'auth',
  roles: ['coordinator'],
})

useHead({
  title: 'Suivi des stages - Plateforme Scolaire',
})
</script>
