<template>
  <q-page padding>
    <div class="myCard">
      <div class="text-h5">Dashboard Administrateur</div>

      <div class="row q-col-gutter-md q-mt-md">
        <q-card class="col-12 col-md-4" v-for="c in cards" :key="c.title">
          <q-card-section>
            <div class="text-subtitle1">{{ c.title }}</div>
            <div class="text-h6">{{ c.value }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
const cards = ref([
  { title: "Total stages", value: 320 },
  { title: "En cours", value: 180 },
  { title: "Terminés", value: 140 },
]);

definePageMeta({
  middleware: 'auth',
  roles: ['admin'],
})

useHead({
  title: 'Administration - Plateforme Scolaire',
  link: [{ rel: 'icon', type: 'image/x-icon', href: '/sesameIcon.png' }],
})
</script>
