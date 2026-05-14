<template>
  <div class="q-pa-md">
    <div class="text-h6 q-mb-md">Documents administratifs</div>
    
    <div class="q-mb-lg">
      <q-list bordered separator padding>
        <q-item v-for="doc in documents" :key="doc.id">
          <q-item-section avatar>
            <q-icon :name="doc.icon" color="primary" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ doc.name }}</q-item-label>
            <q-item-label caption v-if="doc.status === 'uploaded'">Téléchargé le {{ doc.date }}</q-item-label>
            <q-item-label caption v-else class="text-warning">Non fourni</q-item-label>
          </q-item-section>

          <q-item-section side>
            <div class="row q-gutter-xs">
              <q-btn flat round dense icon="download" color="primary" v-if="doc.status === 'uploaded'">
                <q-tooltip>Télécharger</q-tooltip>
              </q-btn>
              <q-btn flat round dense icon="upload" color="secondary" @click="triggerUpload(doc)">
                <q-tooltip>Mettre à jour</q-tooltip>
              </q-btn>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- Zone de dépôt pour un nouveau document -->
    <q-card flat bordered class="q-pa-md bg-grey-1">
      <q-file v-model="newFile" label="Uploader un nouveau document" outlined dense accept=".pdf,.jpg,.png">
        <template v-slot:prepend>
          <q-icon name="attach_file" />
        </template>
        <template v-slot:append>
          <q-btn label="Envoyer" color="primary" dense flat :disable="!newFile" @click="uploadNewFile" />
        </template>
      </q-file>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const newFile = ref(null);

const documents = ref([
  { id: 1, name: 'Carte d\'identité / Passeport', icon: 'badge', status: 'uploaded', date: '12/04/2026' },
  { id: 2, name: 'Curriculum Vitae (CV)', icon: 'description', status: 'uploaded', date: '10/05/2026' },
  { id: 3, name: 'Relevé de notes', icon: 'assessment', status: 'pending', date: '' },
  { id: 4, name: 'Attestation de scolarité', icon: 'school', status: 'pending', date: '' }
]);

const triggerUpload = (doc: any) => {
  $q.notify({
    message: `Upload pour : ${doc.name}`,
    color: 'info'
  });
};

const uploadNewFile = () => {
  if (newFile.value) {
    $q.notify({
      type: 'positive',
      message: 'Document envoyé avec succès'
    });
    newFile.value = null;
  }
};
</script>

<style scoped lang="scss"></style>