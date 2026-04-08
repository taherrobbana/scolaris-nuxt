<template>
  <q-page padding>
    <div class="myCard">
      <div class="text-h5">Suivi pédagogique des stages</div>

      <q-select dense outlined class="q-mb-md" v-model="selectedStudent" :options="students"
        label="Choisir un étudiant" />

      <q-stepper v-model="step" vertical animated>
        <q-step :name="3" title="Validation journal (Enseignant)">
          <q-banner class="q-mb-sm">Journal soumis par l'étudiant</q-banner>
          <q-input dense outlined type="textarea" v-model="commentJournal" label="Commentaire" />
          <div class="q-mt-sm">
            <q-btn label="Valider" color="green" />
            <q-btn label="Refuser" color="red" class="q-ml-sm" />
          </div>
        </q-step>

        <q-step :name="6" title="Validation rapport (Enseignant)">
          <q-banner class="q-mb-sm">Rapport soumis par l'étudiant</q-banner>
          <q-input dense outlined type="textarea" v-model="commentReport" label="Commentaire" />
          <div class="q-mt-sm">
            <q-btn label="Valider" color="green" />
            <q-btn label="Refuser" color="red" class="q-ml-sm" />
          </div>
        </q-step>

        <q-step :name="7" title="Fixer la date de soutenance">
          <q-input dense outlined type="date" v-model="defense.date" label="Date" style="padding-bottom: 5px" />
          <q-input dense outlined v-model="defense.room" label="Salle" />
          <q-btn label="Enregistrer" color="primary" class="q-mt-sm" />
        </q-step>

        <q-step :name="9" title="Feedback final (Enseignant)">
          <q-input dense outlined type="textarea" v-model="finalFeedback" label="Feedback final" />
          <q-btn label="Envoyer" color="primary" class="q-mt-sm" />
        </q-step>
      </q-stepper>
    </div>
  </q-page>
</template>

<script setup lang="ts">
const students = ["Ahmed Benali", "Sara Ali"];
const selectedStudent = ref(null);

const step = ref(7);

const commentJournal = ref("");
const commentReport = ref("");

const defense = ref({
  date: "2025-06-15",
  room: "Salle B12",
});

const finalFeedback = ref("Très bon travail, bon niveau technique.");

definePageMeta({
  middleware: 'auth',
  roles: ['teacher'],
})

useHead({
  title: 'Validation & suivi - Plateforme Scolaire',
})
</script>
