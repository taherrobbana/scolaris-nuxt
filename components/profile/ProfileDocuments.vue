<template>
  <div class="q-pa-md">
    <div class="text-h6 q-mb-md">Documents administratifs</div>

    <div class="row q-col-gutter-xs">
      <div :class="currentViewedDocSrc ? 'col-12 col-md-6' : 'col-12'">
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
                <q-btn flat round dense icon="visibility" color="info" v-if="doc.status === 'uploaded'"
                  @click="viewDocument(doc)">
                  <q-tooltip>Visualiser</q-tooltip>
                </q-btn>
                <q-btn flat round dense icon="download" color="primary" v-if="doc.status === 'uploaded'"
                  @click="downloadDocument(doc)">
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

      <div v-if="currentViewedDocSrc" class="col-12 col-md-6">
        <div class="row items-center justify-between q-mb-sm bg-primary text-white q-pa-sm rounded-borders"
          style="border-radius: 4px;">
          <div class="text-subtitle1 flex items-center">
            <q-icon name="description" class="q-mr-sm" size="sm" />
            {{ currentViewedDocTitle }}
          </div>
          <q-btn dense flat icon="close" @click="closeViewer">
            <q-tooltip class="bg-white text-primary">Fermer</q-tooltip>
          </q-btn>
        </div>
        <q-card flat bordered class="q-pa-none relative-position" style="height: 600px;">
          <iframe :src="currentViewedDocSrc" width="100%" height="100%" style="border: none;"
            @load="onIframeLoad"></iframe>
          <q-inner-loading :showing="isDocLoading">
            <q-spinner size="50px" color="primary" />
          </q-inner-loading>
        </q-card>
      </div>
    </div>
    <!-- Input de fichier caché pour gérer l'upload -->
    <input type="file" ref="hiddenFileInput" accept=".pdf" style="display: none" @change="handleFileUpload" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useAuthModule } from '~/stores/auth/authModule';
import { Role } from '~/utils/types';

const $q = useQuasar();
const authModule = useAuthModule();
const hiddenFileInput = ref<HTMLInputElement | null>(null);
const currentUploadDoc = ref<any>(null);

const currentViewedDocSrc = ref("");
const currentViewedDocTitle = ref("");
const isDocLoading = ref(false);

const documents = computed(() => {
  const role = authModule.getRole;
  const userDocs = authModule.getDocuments || {};

  const mapStatus = (docs: any[]) => {
    return docs.map(d => ({
      ...d,
      status: userDocs[d.id] ? 'uploaded' : 'pending'
    }));
  };

  const commonDocs = [
    { id: 1, name: 'Carte d\'identité / Passeport', icon: 'badge', date: '12/04/2026' },
  ];

  let roleDocs = commonDocs;

  if (role === Role.student || role === 'student') {
    roleDocs = [
      ...commonDocs,
      { id: 2, name: 'Curriculum Vitae (CV)', icon: 'description', date: '10/05/2026' },
      { id: 3, name: 'Relevé de notes', icon: 'assessment', date: '' },
      { id: 4, name: 'Attestation de scolarité', icon: 'school', date: '' }
    ];
  } else if (role === Role.teacher || role === 'teacher') {
    roleDocs = [
      ...commonDocs,
      { id: 2, name: 'Curriculum Vitae (CV)', icon: 'description', date: '10/05/2026' },
      { id: 5, name: 'Diplôme', icon: 'workspace_premium', date: '' }
    ];
  } else if (role === Role.admin || role === 'admin') {
    roleDocs = [
      ...commonDocs,
      { id: 7, name: 'Contrat de travail', icon: 'history_edu', date: '01/09/2025' },
      { id: 8, name: 'Fiche de poste', icon: 'description', date: '01/09/2025' }
    ];
  } else if (role === Role.coordinator || role === 'coordinator') {
    roleDocs = [
      ...commonDocs,
      { id: 7, name: 'Contrat de travail', icon: 'history_edu', date: '01/10/2025' },
      { id: 9, name: 'Décision de nomination', icon: 'assignment', date: '' }
    ];
  }

  return mapStatus(roleDocs);
});

const triggerUpload = (doc: any) => {
  currentUploadDoc.value = doc;
  if (hiddenFileInput.value) {
    hiddenFileInput.value.click();
  }
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file || !currentUploadDoc.value) return;

  if (file.type !== 'application/pdf') {
    $q.notify({ type: 'negative', message: 'Veuillez sélectionner un fichier PDF valide' });
    return;
  }

  const reader = new FileReader();
  reader.onload = async (e) => {
    const base64Str = e.target?.result as string;

    // Mettre à jour l'objet local de documents
    const updatedDocuments = { ...(authModule.getDocuments || {}) };
    updatedDocuments[currentUploadDoc.value.id] = base64Str;

    try {
      const res = await authModule.updateProfile({ documents: updatedDocuments });
      if (res) {
        $q.notify({ type: 'positive', message: 'Document mis à jour avec succès' });
      }
    } catch (err) {
      $q.notify({ type: 'negative', message: 'Erreur lors de la mise à jour du document' });
    } finally {
      if (hiddenFileInput.value) hiddenFileInput.value.value = '';
      currentUploadDoc.value = null;
    }
  };
  reader.readAsDataURL(file);
};

const viewDocument = (doc: any) => {
  const base64Str = authModule.getDocuments[doc.id];
  if (base64Str) {
    isDocLoading.value = true;
    currentViewedDocSrc.value = base64Str;
    currentViewedDocTitle.value = doc.name;
  } else {
    $q.notify({ type: 'warning', message: 'Document introuvable' });
  }
};

const onIframeLoad = () => {
  isDocLoading.value = false;
};

const closeViewer = () => {
  currentViewedDocSrc.value = "";
  currentViewedDocTitle.value = "";
  isDocLoading.value = false;
};

const downloadDocument = (doc: any) => {
  const base64Str = authModule.getDocuments[doc.id];
  if (base64Str) {
    const a = document.createElement("a");
    a.href = base64Str;
    a.download = `${doc.name}.pdf`;
    a.click();
  } else {
    $q.notify({ type: 'warning', message: 'Document introuvable' });
  }
};
</script>

<style scoped lang="scss"></style>