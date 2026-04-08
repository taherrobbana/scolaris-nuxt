<template>
  <q-page padding>
    <div class="myCard">
      <div class="text-h5">Détail du stage</div>

      <q-card class="q-mt-md">
        <q-card-section>
          <div><b>Étudiant :</b> Ahmed</div>
          <div><b>Entreprise :</b> TechCorp</div>
          <div><b>Sujet :</b> Application Web</div>
        </q-card-section>

        <q-card-section>
          <q-input dense outlined v-model="comment" type="textarea" label="Commentaire pédagogique" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Valider" color="green" />
          <q-btn label="Refuser" color="red" />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
const comment = ref("Bon avancement");

definePageMeta({
  middleware: 'auth',
  roles: ['teacher'],
})

useHead({
  title: 'Détail du stage',
})
</script>
