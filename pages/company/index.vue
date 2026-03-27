<template>
  <q-page padding>
    <div class="myCard">
      <div class="text-h5">Dashboard Entreprise</div>

      <q-list bordered>
        <q-item v-for="s in stagiaires" :key="s.name">
          <q-item-section> {{ s.name }} – {{ s.period }} </q-item-section>
          <q-item-section side>
            <q-btn label="Évaluer" color="primary" size="sm" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script setup>
const stagiaires = ref([
  { name: "Yassine", period: "Mars - Juin" },
  { name: "Lina", period: "Avril - Juillet" },
]);
</script>
