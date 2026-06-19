<template>
  <q-page padding>
    <div class="myCard q-pa-lg">
      <!-- Header -->
      <div class="row items-center justify-between q-mb-lg">
        <div>
          <div class="text-h5 text-primary text-weight-bold">
            {{ t("coordinator.grades.title") }}
          </div>
          <div class="text-caption text-grey-6 q-mt-xs">
            {{ t("coordinator.grades.subtitle") }}
          </div>
        </div>
      </div>

      <!-- Selection Section -->
      <div class="row q-col-gutter-md q-mb-lg items-center">
        <div class="col-12 col-sm-6 col-md-4">
          <q-select
            v-model="selectedGroup"
            :options="groupOptions"
            :label="t('coordinator.grades.selectGroup')"
            outlined
            dense
            emit-value
            map-options
            clearable
            @update:model-value="onGroupChange"
            :loading="groupStore.loading"
          >
            <template #prepend>
              <q-icon name="diversity_3" />
            </template>
          </q-select>
        </div>
      </div>

      <!-- Loading Spinner -->
      <div v-if="gradesStore.loading" class="row justify-center q-my-xl">
        <q-spinner color="primary" size="40px" />
      </div>

      <!-- Main Display -->
      <div v-else-if="selectedGroup">
        <div v-if="gradesStore.groupGradesStatus.length === 0" class="text-center q-py-xl text-grey-7 bg-white rounded-borders border-grey">
          <q-icon name="group_off" size="50px" class="q-mb-md text-grey-5" />
          <div>{{ t("coordinator.grades.noStudents") }}</div>
        </div>

        <div v-else class="bg-white rounded-borders overflow-hidden border-grey">
          <q-table
            :rows="gradesStore.groupGradesStatus"
            :columns="columns"
            row-key="studentId"
            flat
            bordered
            :pagination="{ rowsPerPage: 10 }"
          >
            <!-- Student Name column -->
            <template v-slot:body-cell-studentName="props">
              <q-td :props="props">
                <div class="text-weight-bold">{{ props.row.firstName }} {{ props.row.lastName }}</div>
                <div class="text-caption text-grey-6">{{ props.row.username }}</div>
              </q-td>
            </template>

            <!-- Completion column -->
            <template v-slot:body-cell-completion="props">
              <q-td :props="props" class="text-center">
                <q-badge
                  :color="props.row.allGradesEntered ? 'green' : 'orange'"
                  text-color="white"
                  class="q-py-xs q-px-sm"
                >
                  {{ props.row.gradedSubjectsCount }} / {{ props.row.totalSubjects }} {{ t("coordinator.grades.completion") }}
                </q-badge>
              </q-td>
            </template>

            <!-- GPA Column -->
            <template v-slot:body-cell-gpa="props">
              <q-td :props="props" class="text-center text-weight-bold">
                {{ props.row.gpa }} / 20
              </q-td>
            </template>

            <!-- Decision Column -->
            <template v-slot:body-cell-decision="props">
              <q-td :props="props" class="text-center">
                <q-chip
                  v-if="props.row.gradedSubjectsCount > 0"
                  :color="getDecisionColor(props.row.decision)"
                  text-color="white"
                  dense
                  square
                  class="text-weight-bold"
                >
                  {{ getDecisionLabel(props.row.decision) }}
                </q-chip>
                <span v-else class="text-grey-5">—</span>
              </q-td>
            </template>

            <!-- Validation Status Column -->
            <template v-slot:body-cell-validation="props">
              <q-td :props="props" class="text-center">
                <q-chip
                  :color="props.row.validated ? 'positive' : 'grey-5'"
                  text-color="white"
                  dense
                  class="text-weight-bold"
                >
                  {{ props.row.validated ? t("coordinator.grades.validated") : t("coordinator.grades.pendingValidation") }}
                </q-chip>
              </q-td>
            </template>

            <!-- Actions Column -->
            <template v-slot:body-cell-actions="props">
              <q-td :props="props" class="text-center">
                <q-btn
                  v-if="!props.row.validated"
                  color="positive"
                  icon="check"
                  :label="t('coordinator.grades.validateAction')"
                  size="sm"
                  unelevated
                  dense
                  class="q-px-sm"
                  :loading="gradesStore.saving"
                  @click="toggleValidation(props.row.studentId, true, props.row.gpa, props.row.decision)"
                />
                <q-btn
                  v-else
                  color="negative"
                  icon="undo"
                  :label="t('coordinator.grades.invalidateAction')"
                  size="sm"
                  unelevated
                  dense
                  class="q-px-sm"
                  :loading="gradesStore.saving"
                  @click="toggleValidation(props.row.studentId, false, props.row.gpa, props.row.decision)"
                />
              </q-td>
            </template>
          </q-table>
        </div>
      </div>
      
      <!-- No Group Selected State -->
      <div v-else class="text-center q-py-xl text-grey-6">
        <q-icon name="diversity_3" size="50px" class="q-mb-md text-grey-4" />
        <div>{{ t("coordinator.grades.pleaseSelectGroup") }}</div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { Notify } from "quasar";
import { useGroupModule } from "~/stores/group/groupModule";
import { useGradesModule } from "~/stores/grades/gradesModule";

definePageMeta({
  middleware: "auth",
  roles: ["coordinator"],
});

const { t } = useI18n();

useHead({
  title: computed(() => t("useHead.coordinator.grades") || "Validation des Bulletins"),
});

const groupStore = useGroupModule();
const gradesStore = useGradesModule();

const selectedGroup = ref<string | null>(null);

const groupOptions = computed(() => {
  return groupStore.groups.map((g) => ({
    label: g.name || g.label || "Groupe inconnu",
    value: g.id || g._id?.toString(),
  }));
});

const columns = computed(() => [
  {
    name: "studentName",
    label: t("coordinator.grades.studentName") || "Étudiant",
    field: "studentName",
    align: "left" as const,
    sortable: true,
  },
  {
    name: "completion",
    label: t("coordinator.grades.completion") || "Progression",
    field: "gradedSubjectsCount",
    align: "center" as const,
    sortable: true,
  },
  {
    name: "gpa",
    label: t("student.grades.gpa") || "Moyenne",
    field: "gpa",
    align: "center" as const,
    sortable: true,
  },
  {
    name: "decision",
    label: t("student.grades.status") || "Décision",
    field: "decision",
    align: "center" as const,
    sortable: true,
  },
  {
    name: "validation",
    label: "Validation",
    field: "validated",
    align: "center" as const,
    sortable: true,
  },
  {
    name: "actions",
    label: "Actions",
    field: "actions",
    align: "center" as const,
  },
]);

function onGroupChange(groupId: string) {
  if (groupId) {
    gradesStore.loadGroupGradesStatus(groupId);
  }
}

async function toggleValidation(studentId: string, validated: boolean, gpa: number, decision: string) {
  try {
    await gradesStore.validateStudentReportCard(studentId, validated);
    Notify.create({
      type: "positive",
      message: validated 
        ? t("coordinator.grades.validationSuccess") || "Le bulletin de l'étudiant a été validé avec succès !"
        : t("coordinator.grades.invalidationSuccess") || "La validation du bulletin a été annulée.",
      icon: "check_circle",
    });
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Erreur lors de la modification de la validation.",
      icon: "error",
    });
  }
}

function getDecisionColor(val: string) {
  if (val === "admitted") return "positive";
  if (val === "resit") return "warning";
  if (val === "failed") return "negative";
  return "grey";
}

function getDecisionLabel(val: string) {
  if (val === "admitted") return t("student.grades.admitted") || "Admis";
  if (val === "resit") return t("student.grades.resit") || "Rattrapage";
  if (val === "failed") return t("student.grades.failed") || "Refusé";
  return "En attente";
}

onMounted(() => {
  groupStore.fetchGroups();
});
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

.border-grey {
  border: 1px solid rgba(0, 0, 0, 0.08);
}
</style>
