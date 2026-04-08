<template>
  <q-page padding>
    <div class="myCard">
      <div class="text-h5">Offres de stage</div>

      <div class="row q-col-gutter-md q-mt-md">
        <q-select dense outlined class="col-12 col-md-4" v-model="filters.company" :options="companies"
          label="Filtrer par entreprise" />

        <q-select dense outlined class="col-12 col-md-4" v-model="filters.type" :options="types"
          label="Type de stage" />
      </div>

      <q-card class="q-mt-md" v-for="offer in filteredOffers" :key="offer.id">
        <q-card-section>
          <div class="text-h6">{{ offer.title }}</div>
          <div>{{ offer.company }} • {{ offer.type }}</div>
          <div class="text-caption q-mt-sm">{{ offer.description }}</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Postuler" color="primary" @click="openApply(offer)" />
        </q-card-actions>
      </q-card>

      <q-dialog v-model="applyDialog">
        <q-card style="width: 400px">
          <q-card-section>
            <div class="text-h6">Postuler</div>
          </q-card-section>

          <q-card-section class="q-gutter-md">
            <q-input dense outlined v-model="application.message" type="textarea" label="Message" />
            <q-select dense outlined v-model="application.teacher" :options="teachers" label="Encadrant pédagogique" />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Annuler" v-close-popup />
            <q-btn label="Envoyer" color="primary" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup lang="ts">
const filters = ref({ company: null, type: null });

const companies = ["TechCorp", "DataSoft"];
const types = ["Stage initiation", "Stage perfectionnement", "Stage PFE"];

const teachers = ["Pr Ali", "Pr Mohamed"];

const offers = ref([
  {
    id: 1,
    title: "Stage Web",
    company: "TechCorp",
    type: "Stage PFE",
    description: "Nuxt + Vue",
  },
  {
    id: 2,
    title: "Stage Data",
    company: "DataSoft",
    type: "Stage initiation",
    description: "Python / ML",
  },
]);

const applyDialog = ref(false);
const application = ref({ message: "", teacher: null });

const selectedOffer = ref(null);

const filteredOffers = computed(() => {
  return offers.value.filter(
    (o) =>
      (!filters.value.company || o.company === filters.value.company) &&
      (!filters.value.type || o.type === filters.value.type),
  );
});

function openApply(offer: any) {
  selectedOffer.value = offer;
  applyDialog.value = true;
}

definePageMeta({
  middleware: 'auth',
  roles: ['student'],
})

useHead({
  title: 'Offres de stage - Plateforme Scolaire',
  link: [{ rel: 'icon', type: 'image/x-icon', href: '/sesameIcon.png' }],
})
</script>
