<template>
  <q-page padding>
    <div class="myCard">
      <div class="text-h5">Évaluation du stagiaire</div>

      <q-form class="q-gutter-md">
        <q-rating v-model="form.tech" label="Technique" />
        <q-rating v-model="form.soft" label="Comportement" />
        <q-rating v-model="form.presence" label="Assiduité" />
        <q-input dense outlined v-model="form.comment" type="textarea" label="Commentaire" />

        <q-btn label="Soumettre" color="primary" />
      </q-form>
    </div>
  </q-page>
</template>

<script setup lang="ts">
const form = ref({ tech: 4, soft: 5, presence: 4, comment: "" });

definePageMeta({
  middleware: 'auth',
  roles: ['coordinator'],
})

useHead({
  title: 'Évaluation du stagiaire',
})
</script>
