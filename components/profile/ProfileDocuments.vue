<template>
  <div class="q-pa-md">
    <div class="text-h6 q-mb-md">{{ $t("documents.title") }}</div>

    <div class="row q-col-gutter-lg">
      <div :class="currentViewedDocSrc ? 'col-12 col-md-5' : 'col-12'">
        <q-list bordered separator padding>
          <q-item v-for="doc in documents" :key="doc.id">
            <q-item-section avatar>
              <q-icon :name="doc.icon" color="primary" />
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ doc.name }}</q-item-label>
              <q-item-label caption v-if="doc.status === 'uploaded'">
                {{ $t("documents.status.uploaded", { date: doc.date }) }}
              </q-item-label>
              <q-item-label caption v-else class="text-warning">
                {{ $t("documents.status.pending") }}
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <div class="row q-gutter-xs">
                <q-btn
                  flat
                  round
                  dense
                  icon="visibility"
                  color="info"
                  v-if="doc.status === 'uploaded'"
                  @click="viewDocument(doc)"
                >
                  <q-tooltip>{{ $t("documents.actions.view") }}</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  dense
                  icon="download"
                  color="primary"
                  v-if="doc.status === 'uploaded'"
                  @click="downloadDocument(doc)"
                >
                  <q-tooltip>{{ $t("documents.actions.download") }}</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  dense
                  icon="upload"
                  color="secondary"
                  @click="triggerUpload(doc)"
                >
                  <q-tooltip>{{ $t("documents.actions.update") }}</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  dense
                  icon="delete"
                  color="negative"
                  v-if="doc.status === 'uploaded'"
                  @click="confirmDelete(doc)"
                >
                  <q-tooltip>{{ $t("documents.actions.delete") }}</q-tooltip>
                </q-btn>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <div v-if="currentViewedDocSrc" class="col-12 col-md-7">
        <div
          class="row items-center justify-between q-mb-sm bg-primary text-white q-pa-sm rounded-borders"
          style="border-radius: 4px"
        >
          <div class="text-subtitle1 flex items-center">
            <q-icon name="description" class="q-mr-sm" size="sm" />
            {{ currentViewedDocTitle }}
          </div>
          <q-btn dense flat icon="close" @click="closeViewer">
            <q-tooltip class="bg-white text-primary">Fermer</q-tooltip>
          </q-btn>
        </div>
        <q-card
          flat
          bordered
          class="q-pa-none relative-position"
          style="height: 600px"
        >
          <iframe
            :src="currentViewedDocSrc"
            width="100%"
            height="100%"
            style="border: none"
            @load="onIframeLoad"
          ></iframe>
          <q-inner-loading :showing="isDocLoading">
            <q-spinner size="50px" color="primary" />
          </q-inner-loading>
        </q-card>
      </div>
    </div>

    <!-- Input de fichier caché pour gérer l'upload -->
    <input
      type="file"
      ref="hiddenFileInput"
      accept=".pdf"
      style="display: none"
      @change="handleFileUpload"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import { useAuthModule } from "~/stores/auth/authModule";
import { Role } from "~/utils/types";

const $q = useQuasar();
const { t } = useI18n();
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
    return docs.map((d) => ({
      ...d,
      status: userDocs[d.id] ? "uploaded" : "pending",
    }));
  };

  const commonDocs = [
    { id: 1, name: t("documents.list.id1"), icon: "badge", date: "12/04/2026" },
  ];

  let roleDocs = commonDocs;

  if (role === Role.student || role === "student") {
    roleDocs = [
      ...commonDocs,
      {
        id: 2,
        name: t("documents.list.id2"),
        icon: "description",
        date: "10/05/2026",
      },
      { id: 3, name: t("documents.list.id3"), icon: "assessment", date: "" },
      { id: 4, name: t("documents.list.id4"), icon: "school", date: "" },
    ];
  } else if (role === Role.teacher || role === "teacher") {
    roleDocs = [
      ...commonDocs,
      {
        id: 2,
        name: t("documents.list.id2"),
        icon: "description",
        date: "10/05/2026",
      },
      {
        id: 5,
        name: t("documents.list.id5"),
        icon: "workspace_premium",
        date: "",
      },
    ];
  } else if (role === Role.admin || role === "admin") {
    roleDocs = [
      ...commonDocs,
      {
        id: 7,
        name: t("documents.list.id7"),
        icon: "history_edu",
        date: "01/09/2025",
      },
      {
        id: 8,
        name: t("documents.list.id8"),
        icon: "description",
        date: "01/09/2025",
      },
    ];
  } else if (role === Role.coordinator || role === "coordinator") {
    roleDocs = [
      ...commonDocs,
      {
        id: 7,
        name: t("documents.list.id7"),
        icon: "history_edu",
        date: "01/10/2025", 
      },
      { id: 9, name: t("documents.list.id9"), icon: "assignment", date: "" },
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

  if (file.type !== "application/pdf") {
    $q.notify({
      type: "negative",
      message: t("documents.messages.invalidPdf"),
    });
    return;
  }

  const reader = new FileReader();
  reader.onload = async (e) => {
    const base64Str = e.target?.result as string;

    const updatedDocuments = { ...(authModule.getDocuments || {}) };
    updatedDocuments[currentUploadDoc.value.id] = base64Str;

    try {
      const res = await authModule.updateProfile({
        documents: updatedDocuments,
      });
      if (res) {
        $q.notify({
          type: "positive",
          message: t("documents.messages.success"),
        });
      }
    } catch (err) {
      $q.notify({ type: "negative", message: t("documents.messages.error") });
    } finally {
      if (hiddenFileInput.value) hiddenFileInput.value.value = "";
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
    $q.notify({ type: "warning", message: t("documents.messages.notFound") });
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
    $q.notify({ type: "warning", message: t("documents.messages.notFound") });
  }
};

const confirmDelete = (doc: any) => {
  $q.dialog({
    title: t("documents.messages.confirmDeleteTitle"),
    message: t("documents.messages.confirmDeleteMessage", { name: doc.name }),
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    const updatedDocuments = { ...(authModule.getDocuments || {}) };
    delete updatedDocuments[doc.id];

    try {
      const res = await authModule.updateProfile({
        documents: updatedDocuments,
      });
      if (res) {
        $q.notify({
          type: "positive",
          message: t("documents.messages.deleteSuccess"),
        });
        if (currentViewedDocTitle.value === doc.name) {
          closeViewer();
        }
      }
    } catch (err) {
      $q.notify({
        type: "negative",
        message: t("documents.messages.deleteError"),
      });
    }
  });
};
</script>

<style scoped lang="scss"></style>
