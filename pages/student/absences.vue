<template>
  <q-page padding>
    <div class="myCard q-pa-lg">
      <!-- Header -->
      <div class="row items-center q-mb-lg">
        <div>
          <div class="text-h5 text-primary text-weight-bold">
            Suivi des Absences
          </div>
          <div class="text-caption text-grey-6 q-mt-xs">
            Consultez le nombre d'absences par matière et surveillez les limites
            autorisées.
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
          <div class="col-12 col-sm-4">
            <q-card flat bordered class="stat-card">
              <q-card-section class="row items-center justify-between">
                <div>
                  <div class="text-caption text-grey-7">Total Absences</div>
                  <div class="text-h5 text-weight-bold">
                    {{ totalAbsences }}
                  </div>
                </div>
                <q-avatar
                  color="warning-1"
                  text-color="warning-9"
                  icon="event_busy"
                />
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-sm-4">
            <q-card flat bordered class="stat-card">
              <q-card-section class="row items-center justify-between">
                <div>
                  <div class="text-caption text-grey-7">Matières en Alerte</div>
                  <div class="text-h5 text-weight-bold text-negative">
                    {{ subjectsInAlert }}
                  </div>
                </div>
                <q-avatar color="red-1" text-color="red-9" icon="warning" />
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-sm-4">
            <q-card flat bordered class="stat-card">
              <q-card-section class="row items-center justify-between">
                <div>
                  <div class="text-caption text-grey-7">Statut Global</div>
                  <div
                    class="text-h6 text-weight-bold"
                    :class="globalStatusColor"
                  >
                    {{ globalStatusText }}
                  </div>
                </div>
                <q-avatar
                  :color="globalStatusBg"
                  :text-color="globalStatusTextColor"
                  icon="shield"
                />
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Absences List / Table -->
        <div class="q-mt-md">
          <div class="text-subtitle1 text-weight-bold q-mb-md">
            Bilan par Matière
          </div>
          <q-list bordered separator class="rounded-borders bg-white">
            <q-expansion-item
              v-for="sub in absencesData"
              :key="sub.subjectId"
              header-class="q-py-md"
              expand-icon-class="text-grey-6"
            >
              <!-- Header Template for each subject row -->
              <template #header>
                <q-item-section avatar>
                  <q-avatar
                    :color="
                      getStatusColor(sub.absencesCount, sub.toleratedAbsences)
                    "
                    text-color="white"
                    icon="book"
                    size="36px"
                  />
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-weight-bold text-subtitle2">
                    {{ sub.subjectName }}
                  </q-item-label>
                  <q-item-label caption>
                    Code : {{ sub.subjectCode }} | Coefficient :
                    {{ sub.coefficient }}
                  </q-item-label>
                </q-item-section>

                <q-item-section class="text-right">
                  <div class="row items-center justify-end q-gutter-x-md">
                    <div class="column text-right">
                      <div
                        class="text-weight-bold text-subtitle2"
                        :class="
                          getTextColor(sub.absencesCount, sub.toleratedAbsences)
                        "
                      >
                        {{ sub.absencesCount }} absence(s)
                      </div>
                      <div class="text-caption text-grey-7">
                        Max toléré : {{ sub.toleratedAbsences }} | Total séances
                        : {{ sub.sessionsCount }}
                      </div>
                    </div>
                    <!-- Circular progress bar -->
                    <q-circular-progress
                      show-value
                      class="text-caption text-weight-bold"
                      :value="
                        Math.min(
                          (sub.absencesCount /
                            Math.max(sub.toleratedAbsences, 1)) *
                            100,
                          100,
                        )
                      "
                      size="40px"
                      :color="
                        getStatusProgressColor(
                          sub.absencesCount,
                          sub.toleratedAbsences,
                        )
                      "
                      track-color="grey-2"
                    >
                      {{
                        Math.round(
                          (sub.absencesCount /
                            Math.max(sub.toleratedAbsences, 1)) *
                            100,
                        )
                      }}%
                    </q-circular-progress>
                  </div>
                </q-item-section>
              </template>

              <!-- Expansion content showing date details of absences -->
              <q-card class="bg-grey-0">
                <q-card-section class="q-py-md q-px-lg">
                  <div
                    class="text-weight-bold text-caption text-grey-7 q-mb-sm"
                  >
                    Détail des séances manquées :
                  </div>
                  <div
                    v-if="sub.absences.length === 0"
                    class="text-positive text-weight-medium"
                  >
                    🎉 Félicitations, aucune absence enregistrée dans cette
                    matière !
                  </div>
                  <div v-else>
                    <q-list dense>
                      <q-item
                        v-for="(ab, idx) in sub.absences"
                        :key="ab.eventId"
                        class="q-px-none q-py-xs"
                      >
                        <q-item-section avatar class="min-width-none">
                          <q-icon
                            name="circle"
                            color="red"
                            size="8px"
                            class="q-mr-sm"
                          />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label class="text-weight-medium">
                            Séance {{ (idx as number) + 1 }} :
                            {{ formatDate(ab.date) }}
                          </q-item-label>
                          <q-item-label caption v-if="ab.description">
                            Notes : {{ ab.description }}
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </div>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAuthModule } from "~/stores/auth/authModule";
import moment from "moment";

definePageMeta({
  middleware: "auth",
  roles: ["student"],
});

const authModule = useAuthModule();
const loading = ref(true);
const absencesData = ref<any[]>([]);

const fetchAbsences = async () => {
  loading.value = true;
  try {
    const studentId = authModule.getId;
    const groupName = authModule.getGroup || "";

    const res: any = await $fetch("/api/attendance/student-absences", {
      params: { studentId, groupName },
    });
    absencesData.value = res || [];
  } catch (error) {
    console.error("Failed to load student absences", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchAbsences();
});

// Stats computeds
const totalAbsences = computed(() => {
  return absencesData.value.reduce((sum, item) => sum + item.absencesCount, 0);
});

const subjectsInAlert = computed(() => {
  return absencesData.value.filter(
    (item) =>
      item.absencesCount >= item.toleratedAbsences &&
      item.toleratedAbsences > 0,
  ).length;
});

const globalStatusText = computed(() => {
  if (subjectsInAlert.value === 0) return "En sécurité";
  if (subjectsInAlert.value === 1) return "1 Alerte active";
  return `${subjectsInAlert.value} Alertes actives`;
});

const globalStatusColor = computed(() => {
  if (subjectsInAlert.value === 0) return "text-positive";
  return "text-negative";
});

const globalStatusBg = computed(() => {
  if (subjectsInAlert.value === 0) return "green-1";
  return "red-1";
});

const globalStatusTextColor = computed(() => {
  if (subjectsInAlert.value === 0) return "green-9";
  return "red-9";
});

// Helper styling methods
const getStatusColor = (count: number, max: number) => {
  if (count === 0) return "positive";
  if (count < max) return "warning";
  return "negative";
};

const getStatusProgressColor = (count: number, max: number) => {
  if (count === 0) return "green";
  if (count < max) return "orange";
  return "red";
};

const getTextColor = (count: number, max: number) => {
  if (count === 0) return "text-positive";
  if (count < max) return "text-warning";
  return "text-negative text-weight-bolder";
};

const formatDate = (dateStr: string) => {
  return moment(dateStr).format("DD MMMM YYYY [à] HH:mm");
};
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

.min-width-none {
  min-width: 0 !important;
}

/* Specific colors for avatars */
.bg-warning-1 {
  background: #fff8e1;
}
.text-warning-9 {
  color: #f57f17;
}
</style>
