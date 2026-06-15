<template>
  <q-page padding>
    <div class="myCard q-pa-lg">
      <!-- Header -->
      <div class="row items-center q-mb-lg">
        <div>
          <div class="text-h5 text-primary text-weight-bold">
            {{ $t("student.grades.title") }}
          </div>
          <div class="text-caption text-grey-6 q-mt-xs">
            {{ $t("student.grades.subtitle") }}
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="row justify-center q-my-xl">
        <q-spinner-dots color="primary" size="40px" />
      </div>

      <div v-else>
        <!-- Stats Cards Row -->
        <div class="row q-col-gutter-md q-mb-lg">
          <!-- GPA / Moyenne générale -->
          <div class="col-12 col-sm-4">
            <q-card flat bordered class="stat-card">
              <q-card-section class="row items-center justify-between">
                <div>
                  <div class="text-caption text-grey-7">
                    {{ $t("student.grades.gpa") }}
                  </div>
                  <div class="text-h5 text-weight-bold text-primary">
                    {{ gpa }} / 20
                  </div>
                </div>
                <q-circular-progress
                  show-value
                  class="text-caption text-weight-bold text-primary"
                  :value="((gpa / 20) * 100).toFixed(2)"
                  size="48px"
                  color="primary"
                  track-color="grey-2"
                />
              </q-card-section>
            </q-card>
          </div>

          <!-- Total Coefficients -->
          <div class="col-12 col-sm-4">
            <q-card flat bordered class="stat-card">
              <q-card-section class="row items-center justify-between">
                <div>
                  <div class="text-caption text-grey-7">
                    {{ $t("student.grades.coefficientSum") }}
                  </div>
                  <div class="text-h5 text-weight-bold">
                    {{ coefficientSum }}
                  </div>
                </div>
                <q-avatar color="indigo-1" text-color="indigo-9" icon="functions" />
              </q-card-section>
            </q-card>
          </div>

          <!-- Status decision -->
          <div class="col-12 col-sm-4">
            <q-card flat bordered class="stat-card">
              <q-card-section class="row items-center justify-between">
                <div>
                  <div class="text-caption text-grey-7">
                    {{ $t("student.grades.status") }}
                  </div>
                  <div
                    class="text-h6 text-weight-bold"
                    :class="statusTextColor"
                  >
                    {{ statusLabel }}
                  </div>
                </div>
                <q-avatar :color="statusBgColor" :text-color="statusTextColor" :icon="statusIcon" />
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Grades Table / List -->
        <div class="q-mt-md">
          <div v-if="grades.length === 0" class="text-center q-py-xl text-grey-7 bg-white rounded-borders border-grey">
            <q-icon name="assignment_late" size="50px" class="q-mb-md text-grey-5" />
            <div>{{ $t("student.grades.noGrades") }}</div>
          </div>

          <div v-else class="bg-white rounded-borders overflow-hidden border-grey">
            <q-table
              :rows="grades"
              :columns="columns"
              row-key="eventId"
              flat
              bordered
              :pagination="{ rowsPerPage: 10 }"
            >
              <!-- Subject Code + Name column -->
              <template v-slot:body-cell-subjectName="props">
                <q-td :props="props">
                  <div class="text-weight-bold">{{ props.row.subjectName }}</div>
                  <div class="text-caption text-grey-6">{{ props.row.subjectCode }}</div>
                </q-td>
              </template>

              <!-- Grade column with custom progress / chips -->
              <template v-slot:body-cell-grade="props">
                <q-td :props="props" class="text-right">
                  <q-chip
                    :color="getGradeColor(props.row.grade)"
                    text-color="white"
                    class="text-weight-bold font-mono"
                    square
                    dense
                  >
                    {{ props.row.grade }} / 20
                  </q-chip>
                </q-td>
              </template>

              <!-- Date column -->
              <template v-slot:body-cell-examDate="props">
                <q-td :props="props">
                  {{ formatDateLabel(props.row.examDate) }}
                </q-td>
              </template>
            </q-table>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAuthModule } from "~/stores/auth/authModule";
import { useI18n } from "vue-i18n";
import moment from "moment";

import { useGradesModule } from "~/stores/grades/gradesModule";

definePageMeta({
  middleware: "auth",
  roles: ["student"],
});

const { t } = useI18n();

useHead({
  title: computed(() => t("useHead.student.grades")),
});

const authModule = useAuthModule();
const gradesStore = useGradesModule();

const loading = computed(() => gradesStore.loading);
const grades = computed(() => gradesStore.studentGrades);
const gpa = computed(() => gradesStore.gpa);
const coefficientSum = computed(() => gradesStore.coefficientSum);
const status = computed(() => gradesStore.status);

const columns = computed(() => [
  {
    name: "subjectName",
    label: t("student.grades.subject"),
    field: "subjectName",
    align: "left",
    sortable: true,
  },
  {
    name: "examTitle",
    label: "Évaluation",
    field: "examTitle",
    align: "left",
    sortable: true,
  },
  {
    name: "coefficient",
    label: t("student.grades.coefficient"),
    field: "coefficient",
    align: "center",
    sortable: true,
  },
  {
    name: "examDate",
    label: t("student.grades.date"),
    field: "examDate",
    align: "left",
    sortable: true,
  },
  {
    name: "grade",
    label: t("student.grades.grade"),
    field: "grade",
    align: "right",
    sortable: true,
  },
]);

const statusLabel = computed(() => {
  if (status.value === "admitted") return t("student.grades.admitted");
  if (status.value === "resit") return t("student.grades.resit");
  if (status.value === "failed") return t("student.grades.failed");
  return "En attente";
});

const statusTextColor = computed(() => {
  if (status.value === "admitted") return "text-positive";
  if (status.value === "resit") return "text-warning";
  if (status.value === "failed") return "text-negative";
  return "text-grey";
});

const statusBgColor = computed(() => {
  if (status.value === "admitted") return "green-1";
  if (status.value === "resit") return "orange-1";
  if (status.value === "failed") return "red-1";
  return "grey-2";
});

const statusIcon = computed(() => {
  if (status.value === "admitted") return "school";
  if (status.value === "resit") return "warning";
  if (status.value === "failed") return "gavel";
  return "help";
});

function getGradeColor(val: number) {
  if (val >= 10) return "positive";
  if (val >= 8) return "warning";
  return "negative";
}

function formatDateLabel(dateStr: string) {
  if (!dateStr) return "—";
  return moment(dateStr).format("DD MMMM YYYY [à] HH:mm");
}

async function loadGrades() {
  try {
    const studentId = authModule.getId;
    await gradesStore.loadStudentGrades(studentId);
  } catch (error) {
    console.error("Failed to load student grades", error);
  }
}

onMounted(() => {
  loadGrades();
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

.stat-card {
  border-radius: 12px;
  background: white;
  transition: transform 0.2s;
}

.body--dark .stat-card {
  background: #1e1e32;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.border-grey {
  border: 1px solid rgba(0, 0, 0, 0.08);
}
</style>
