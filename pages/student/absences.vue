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
          <div class="col-12 col-sm-6 col-md-3">
            <q-card flat bordered class="stat-card">
              <q-card-section class="row items-center justify-between">
                <div>
                  <div class="text-caption text-grey-7">Total Absences</div>
                  <div class="text-h5 text-weight-bold">
                    {{ totalAbsences }}
                  </div>
                </div>
                <q-avatar
                  color="blue-1"
                  text-color="blue-9"
                  icon="event_busy"
                />
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <q-card flat bordered class="stat-card">
              <q-card-section class="row items-center justify-between">
                <div>
                  <div class="text-caption text-grey-7">Matières en Alerte</div>
                  <div class="text-h5 text-weight-bold text-warning">
                    {{ subjectsInAlert }}
                  </div>
                </div>
                <q-avatar color="orange-1" text-color="orange-9" icon="warning" />
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <q-card flat bordered class="stat-card">
              <q-card-section class="row items-center justify-between">
                <div>
                  <div class="text-caption text-grey-7">Matières Éliminées</div>
                  <div class="text-h5 text-weight-bold text-negative">
                    {{ subjectsEliminated }}
                  </div>
                </div>
                <q-avatar color="red-1" text-color="red-9" icon="gavel" />
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <q-card flat bordered class="stat-card">
              <q-card-section class="row items-center justify-between">
                <div>
                  <div class="text-caption text-grey-7">Statut Global</div>
                  <div
                    class="text-subtitle1 text-weight-bold"
                    :class="globalStatusColor"
                  >
                    {{ globalStatusText }}
                  </div>
                </div>
                <q-avatar
                  :color="globalStatusBg"
                  :text-color="globalStatusTextColor"
                  :icon="globalStatusIcon"
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
                  <div class="row items-center">
                    <span class="text-weight-bold text-subtitle2">
                      {{ sub.subjectName }}
                    </span>
                    <q-badge
                      :color="getBadgeColor(sub.absencesCount, sub.toleratedAbsences)"
                      :text-color="getBadgeTextColor(sub.absencesCount, sub.toleratedAbsences)"
                      class="q-ml-sm text-weight-bold"
                    >
                      {{ getStatusLabel(sub.absencesCount, sub.toleratedAbsences) }}
                    </q-badge>
                  </div>
                  <q-item-label caption class="q-mt-xs">
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

const getStatusLabel = (count: number, max: number) => {
  if (max > 0) {
    if (count >= max) return "Éliminé";
    if (max - count === 1) return "En alerte";
  } else if (max === 0 && count > 0) {
    return "Éliminé";
  }
  return "En sécurité";
};

const subjectsInAlert = computed(() => {
  return absencesData.value.filter(
    (item) => getStatusLabel(item.absencesCount, item.toleratedAbsences) === "En alerte"
  ).length;
});

const subjectsEliminated = computed(() => {
  return absencesData.value.filter(
    (item) => getStatusLabel(item.absencesCount, item.toleratedAbsences) === "Éliminé"
  ).length;
});

const globalStatusText = computed(() => {
  if (subjectsEliminated.value > 0) {
    return subjectsEliminated.value === 1 
      ? "1 Matière Éliminée" 
      : `${subjectsEliminated.value} Matières Éliminées`;
  }
  if (subjectsInAlert.value > 0) {
    return subjectsInAlert.value === 1 
      ? "1 Matière en Alerte" 
      : `${subjectsInAlert.value} Matières en Alerte`;
  }
  return "En sécurité";
});

const globalStatusColor = computed(() => {
  if (subjectsEliminated.value > 0) return "text-negative";
  if (subjectsInAlert.value > 0) return "text-warning";
  return "text-positive";
});

const globalStatusBg = computed(() => {
  if (subjectsEliminated.value > 0) return "red-1";
  if (subjectsInAlert.value > 0) return "orange-1";
  return "green-1";
});

const globalStatusTextColor = computed(() => {
  if (subjectsEliminated.value > 0) return "red-9";
  if (subjectsInAlert.value > 0) return "orange-9";
  return "green-9";
});

const globalStatusIcon = computed(() => {
  if (subjectsEliminated.value > 0) return "gavel";
  if (subjectsInAlert.value > 0) return "warning";
  return "shield";
});

// Helper styling methods
const getStatusColor = (count: number, max: number) => {
  const status = getStatusLabel(count, max);
  if (status === "Éliminé") return "negative";
  if (status === "En alerte") return "warning";
  return "positive";
};

const getStatusProgressColor = (count: number, max: number) => {
  const status = getStatusLabel(count, max);
  if (status === "Éliminé") return "red";
  if (status === "En alerte") return "orange";
  return "green";
};

const getTextColor = (count: number, max: number) => {
  const status = getStatusLabel(count, max);
  if (status === "Éliminé") return "text-negative text-weight-bolder";
  if (status === "En alerte") return "text-warning text-weight-bold";
  return "text-positive";
};

const getBadgeColor = (count: number, max: number) => {
  const status = getStatusLabel(count, max);
  if (status === "Éliminé") return "red-1";
  if (status === "En alerte") return "orange-1";
  return "green-1";
};

const getBadgeTextColor = (count: number, max: number) => {
  const status = getStatusLabel(count, max);
  if (status === "Éliminé") return "red-9";
  if (status === "En alerte") return "orange-9";
  return "green-9";
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
