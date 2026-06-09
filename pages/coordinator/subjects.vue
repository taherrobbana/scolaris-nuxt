<template>
  <q-page padding>
    <div class="myCard q-pa-lg">
      <!-- Header -->
      <div class="row items-center justify-between q-mb-lg">
        <div>
          <div class="text-h5 text-primary text-weight-bold">
            {{ t("coordinator.subjects.title") }}
          </div>
          <div class="text-caption text-grey-6 q-mt-xs">
            {{ t("sidebar.subjectsCaption") }}
          </div>
        </div>
        <q-btn
          color="primary"
          icon="add"
          :label="t('coordinator.subjects.add')"
          unelevated
          rounded
          no-caps
          @click="openAddDialog"
        />
      </div>

      <!-- Table -->
      <q-table
        :rows="filteredSubjects"
        :columns="columns"
        row-key="id"
        :filter="search"
        flat
        bordered
        :loading="subjectStore.isLoading"
        :no-data-label="t('coordinator.subjects.search')"
        class="subjects-table"
      >
        <!-- Search slot -->
        <template #top-right>
          <q-input
            v-model="search"
            :placeholder="t('coordinator.subjects.search')"
            dense
            outlined
            clearable
            style="min-width: 220px"
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-select
            v-model="selectedSpecialty"
            :options="specialtyOptions"
            emit-value
            map-options
            clearable
            dense
            outlined
            :placeholder="t('coordinator.subjects.specialty')"
            style="min-width: 180px; margin-left: 12px"
          />
        </template>

        <!-- Actions column -->
        <template #body-cell-actions="props">
          <q-td :props="props" class="q-gutter-x-sm">
            <q-btn
              flat
              round
              dense
              color="primary"
              icon="edit"
              @click="openEditDialog(props.row)"
            >
              <q-tooltip>{{ t("coordinator.subjects.edit") }}</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              dense
              color="negative"
              icon="delete"
              @click="confirmDelete(props.row)"
            >
              <q-tooltip>{{ t("coordinator.subjects.delete") }}</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- ── Add / Edit Dialog ──────────────────────────────────────────────── -->
    <q-dialog v-model="dialogOpen" persistent>
      <q-card class="dialog-card">
        <q-card-section class="dialog-header row items-center">
          <q-icon
            :name="editMode ? 'edit' : 'add_circle'"
            color="primary"
            size="28px"
            class="q-mr-sm"
          />
          <div class="text-h6 text-weight-bold">
            {{
              editMode
                ? t("coordinator.subjects.editSubject")
                : t("coordinator.subjects.addSubject")
            }}
          </div>
          <q-space />
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section class="q-gutter-y-md q-pt-lg">
          <!-- Code -->
          <q-input
            v-model="form.code"
            :label="t('coordinator.subjects.code')"
            outlined
            dense
            :rules="[(v) => !!v || t('coordinator.subjects.codeRequired')]"
            ref="codeRef"
          >
            <template #prepend><q-icon name="tag" /></template>
          </q-input>

          <!-- Name -->
          <q-input
            v-model="form.name"
            :label="t('coordinator.subjects.name')"
            outlined
            dense
            :rules="[(v) => !!v || t('coordinator.subjects.nameRequired')]"
            ref="nameRef"
          >
            <template #prepend><q-icon name="book" /></template>
          </q-input>

          <!-- Coefficient -->
          <q-input
            v-model.number="form.coefficient"
            :label="t('coordinator.subjects.coefficient')"
            outlined
            dense
            type="number"
            min="1"
            :rules="[
              (v) =>
                (v !== '' && v !== null && v !== undefined) ||
                t('coordinator.subjects.coeffRequired'),
              (v) =>
                !isNaN(Number(v)) || t('coordinator.subjects.coeffRequired'),
            ]"
            ref="coeffRef"
          >
            <template #prepend><q-icon name="calculate" /></template>
          </q-input>

          <!-- Specialty -->
          <q-select
            v-model="form.specialty"
            :label="t('coordinator.subjects.specialty')"
            outlined
            dense
            :placeholder="t('coordinator.subjects.specialtyPlaceholder')"
            :rules="[(v) => !!v || t('coordinator.subjects.specialtyRequired')]"
            ref="specialtyRef"
            emit-value
            map-options
            :options="specialtyOptions"
          >
            <template #prepend><q-icon name="school" /></template>
          </q-select>

          <!-- Sessions Count -->
          <q-input
            v-model.number="form.sessionsCount"
            :label="t('coordinator.subjects.sessionsCount')"
            outlined
            dense
            type="number"
            min="1"
            :rules="[
              (v) =>
                (v !== '' && v !== null && v !== undefined) ||
                t('coordinator.subjects.sessionsCountRequired'),
              (v) =>
                !isNaN(Number(v)) ||
                t('coordinator.subjects.sessionsCountRequired'),
            ]"
            ref="sessionsCountRef"
          >
            <template #prepend><q-icon name="calendar_today" /></template>
          </q-input>

          <!-- Tolerated Absences -->
          <q-input
            v-model.number="form.toleratedAbsences"
            :label="t('coordinator.subjects.toleratedAbsences')"
            outlined
            dense
            type="number"
            min="0"
            :rules="[
              (v) =>
                (v !== '' && v !== null && v !== undefined) ||
                t('coordinator.subjects.toleratedAbsencesRequired'),
              (v) =>
                !isNaN(Number(v)) ||
                t('coordinator.subjects.toleratedAbsencesRequired'),
            ]"
            ref="toleratedAbsencesRef"
          >
            <template #prepend><q-icon name="event_busy" /></template>
          </q-input>

          <!-- Description -->
          <q-input
            v-model="form.description"
            :label="t('coordinator.subjects.description')"
            outlined
            dense
            type="textarea"
            rows="3"
            autogrow
          >
            <template #prepend><q-icon name="notes" /></template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md q-gutter-x-sm">
          <q-btn
            flat
            :label="t('coordinator.subjects.cancel')"
            color="grey"
            no-caps
            v-close-popup
          />
          <q-btn
            unelevated
            :label="
              editMode
                ? t('coordinator.subjects.update')
                : t('coordinator.subjects.create')
            "
            color="primary"
            no-caps
            rounded
            :loading="saving"
            @click="submitForm"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- ── Confirm Delete Dialog ──────────────────────────────────────────── -->
    <q-dialog v-model="deleteDialogOpen" persistent>
      <q-card class="dialog-card" style="max-width: 420px">
        <q-card-section class="row items-center q-gutter-sm">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <div class="text-h6">
            {{ t("coordinator.subjects.confirmDeleteTitle") }}
          </div>
        </q-card-section>
        <q-card-section>
          <span>{{
            t("coordinator.subjects.confirmDeleteMessage", {
              name: subjectToDelete?.name ?? "",
            })
          }}</span>
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md q-gutter-x-sm">
          <q-btn
            flat
            :label="t('coordinator.subjects.cancel')"
            color="grey"
            no-caps
            v-close-popup
          />
          <q-btn
            unelevated
            :label="t('coordinator.subjects.delete')"
            color="negative"
            no-caps
            rounded
            :loading="deleting"
            @click="executeDelete"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { Notify } from "quasar";
import { useSubjectModule } from "~/stores/subject/subjectModule";
import type { Subject } from "~/stores/subject/subjectService";

// ── Page meta ───────────────────────────────────────────────────────────────
definePageMeta({
  middleware: "auth",
  roles: ["coordinator"],
});

const { t } = useI18n();

useHead({
  title: computed(() => t("useHead.coordinator.subjects.title")), 
});

// ── Store ────────────────────────────────────────────────────────────────────
const subjectStore = useSubjectModule();

onMounted(() => {
  subjectStore.loadSubjects();
});

// ── Table columns ─────────────────────────────────────────────────────────────
const columns = computed(() => [
  {
    name: "code",
    label: t("coordinator.subjects.columns.code"),
    field: "code",
    align: "left" as const,
    sortable: true,
  },
  {
    name: "name",
    label: t("coordinator.subjects.columns.name"),
    field: "name",
    align: "left" as const,
    sortable: true,
  },
  {
    name: "coefficient",
    label: t("coordinator.subjects.columns.coefficient"),
    field: "coefficient",
    align: "center" as const,
    sortable: true,
  },
  {
    name: "specialty",
    label: t("coordinator.subjects.columns.specialty"),
    field: "specialty",
    align: "left" as const,
    sortable: true,
  },
  {
    name: "sessionsCount",
    label: t("coordinator.subjects.columns.sessionsCount"),
    field: "sessionsCount",
    align: "center" as const,
    sortable: true,
  },
  {
    name: "toleratedAbsences",
    label: t("coordinator.subjects.columns.toleratedAbsences"),
    field: "toleratedAbsences",
    align: "center" as const,
    sortable: true,
  },
  {
    name: "description",
    label: t("coordinator.subjects.columns.description"),
    field: "description",
    align: "left" as const,
  },
  {
    name: "actions",
    label: t("coordinator.subjects.columns.actions"),
    field: "actions",
    align: "center" as const,
  },
]);

// ── Search ───────────────────────────────────────────────────────────────────
const search = ref("");
const selectedSpecialty = ref("");
const specialtyOptions = computed(() => {
  const specs = [
    { label: t("Software Engineering"), value: "SE" },
    { label: t("Data Science & IA"), value: "DS" },
    { label: t("Embedded Systems"), value: "ES" },
  ]
    .map((s) => s.label)
    .filter(Boolean);
  const unique = Array.from(new Set(specs));
  return [
    { label: t("coordinator.subjects.allSpecialties"), value: "" },
    ...unique.map((sp) => ({ label: sp, value: sp })),
  ];
});
const filteredSubjects = computed(() => {
  let rows = subjectStore.getSubjects;
  if (selectedSpecialty.value) {
    rows = rows.filter((s) => s.specialty === selectedSpecialty.value);
  }
  if (search.value) {
    const term = search.value.toLowerCase();
    rows = rows.filter(
      (s) =>
        (s.code && s.code.toLowerCase().includes(term)) ||
        (s.name && s.name.toLowerCase().includes(term)) ||
        (s.specialty && s.specialty.toLowerCase().includes(term)) ||
        (s.coefficient &&
          s.coefficient.toString().toLowerCase().includes(term)) ||
        (s.description && s.description.toLowerCase().includes(term)),
    );
  }
  return rows;
});

// ── Form state ────────────────────────────────────────────────────────────────
const dialogOpen = ref(false);
const editMode = ref(false);
const saving = ref(false);
const editingId = ref<string | null>(null);

const emptyForm = () => ({
  code: "",
  name: "",
  coefficient: 1,
  description: "",
  specialty: "",
  sessionsCount: 15,
  toleratedAbsences: 3,
});
const form = ref(emptyForm());

// Form refs for validation
const codeRef = ref<any>(null);
const nameRef = ref<any>(null);
const coeffRef = ref<any>(null);
const specialtyRef = ref<any>(null);
const sessionsCountRef = ref<any>(null);
const toleratedAbsencesRef = ref<any>(null);

function openAddDialog() {
  form.value = emptyForm();
  editMode.value = false;
  editingId.value = null;
  dialogOpen.value = true;
}

function openEditDialog(row: Subject) {
  form.value = {
    code: row.code,
    name: row.name,
    coefficient: row.coefficient,
    description: row.description ?? "",
    specialty: row.specialty ?? "",
    sessionsCount: row.sessionsCount !== undefined ? row.sessionsCount : 15,
    toleratedAbsences:
      row.toleratedAbsences !== undefined ? row.toleratedAbsences : 3,
  };
  editMode.value = true;
  editingId.value = row.id;
  dialogOpen.value = true;
}

async function submitForm() {
  // Validate all fields
  const validations = await Promise.all([
    codeRef.value?.validate(),
    nameRef.value?.validate(),
    coeffRef.value?.validate(),
    specialtyRef.value?.validate(),
    sessionsCountRef.value?.validate(),
    toleratedAbsencesRef.value?.validate(),
  ]);
  if (validations.some((v) => v === false)) return;

  saving.value = true;
  try {
    const payload = {
      code: form.value.code.trim(),
      name: form.value.name.trim(),
      coefficient: Number(form.value.coefficient),
      description: form.value.description?.trim(),
      specialty: form.value.specialty?.trim(),
      sessionsCount: Number(form.value.sessionsCount),
      toleratedAbsences: Number(form.value.toleratedAbsences),
    };

    if (editMode.value && editingId.value) {
      await subjectStore.editSubject(editingId.value, payload);
      Notify.create({
        type: "positive",
        message: t("coordinator.subjects.successUpdate"),
        icon: "check_circle",
      });
    } else {
      await subjectStore.addSubject(payload);
      Notify.create({
        type: "positive",
        message: t("coordinator.subjects.successCreate"),
        icon: "check_circle",
      });
    }
    dialogOpen.value = false;
  } finally {
    saving.value = false;
  }
}

// ── Delete ───────────────────────────────────────────────────────────────────
const deleteDialogOpen = ref(false);
const deleting = ref(false);
const subjectToDelete = ref<Subject | null>(null);

function confirmDelete(row: Subject) {
  subjectToDelete.value = row;
  deleteDialogOpen.value = true;
}

async function executeDelete() {
  if (!subjectToDelete.value) return;
  deleting.value = true;
  try {
    await subjectStore.removeSubject(subjectToDelete.value.id);
    Notify.create({
      type: "positive",
      message: t("coordinator.subjects.successDelete"),
      icon: "check_circle",
    });
    deleteDialogOpen.value = false;
  } finally {
    deleting.value = false;
  }
}
</script>

<style scoped lang="scss">
.myCard {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border-radius: 18px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.06);
}

.body--dark .myCard {
  background: rgba(30, 30, 50, 0.85);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
}

.subjects-table {
  border-radius: 12px;
  overflow: hidden;
}

.dialog-card {
  width: 520px;
  max-width: 95vw;
  border-radius: 16px !important;
}

.dialog-header {
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.08),
    rgba(139, 92, 246, 0.08)
  );
  border-radius: 16px 16px 0 0;
}

.body--dark .dialog-card {
  background: #1e1e32;
}

.body--dark .dialog-header {
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.15),
    rgba(139, 92, 246, 0.15)
  );
}
</style>
