<template>
  <q-page padding class="student-dashboard-page">
    <div class="myCard q-pa-lg">
      <!-- Header -->
      <div class="row items-center justify-between q-mb-lg header-section">
        <div>
          <div class="text-h5 text-weight-bold text-gradient q-mb-xs">
            {{ $t("student.index.title") }}
          </div>
          <div class="text-caption text-grey-6 text-weight-medium">
            Portail académique de {{ authModule.getUser?.firstName }} {{ authModule.getUser?.lastName }} (Groupe: <span class="text-primary text-weight-bold">{{ authModule.getGroup || 'Non assigné' }}</span>)
          </div>
        </div>
        <q-btn
          flat
          round
          color="primary"
          icon="refresh"
          @click="refreshData"
          :loading="loading"
          class="bg-grey-1 hover-scale"
          size="sm"
        >
          <q-tooltip>Rafraîchir les données</q-tooltip>
        </q-btn>
      </div>

      <div class="row q-col-gutter-md">
        <!-- Main Column -->
        <div class="col-12 col-md-8">
          <!-- Stats Cards -->
          <div class="row q-col-gutter-md">
            <div
              class="col-12 col-sm-4"
              v-for="card in stats"
              :key="card.title"
            >
              <q-card 
                class="stat-card cursor-pointer" 
                :class="'border-' + card.color"
                flat 
                v-ripple
                @click="$router.push(card.route)"
              >
                <q-card-section class="row items-center justify-between q-pa-md">
                  <div>
                    <div class="text-caption text-grey-6 text-weight-bold text-uppercase tracking-wider" style="font-size: 10px;">{{ card.title }}</div>
                    <div class="text-h4 text-weight-bold q-mt-xs text-dark">{{ card.value }}</div>
                  </div>
                  <div class="icon-container" :class="'icon-bg-' + card.color">
                    <q-icon :name="card.icon" size="22px" />
                  </div>
                </q-card-section>
                <q-card-actions class="q-py-xs q-px-md bg-grey-1 row items-center justify-between card-footer">
                  <span class="text-caption text-grey-6 text-weight-medium" style="font-size: 11px;">Détails</span>
                  <q-icon name="arrow_forward" color="grey-6" size="14px" class="arrow-icon" />
                </q-card-actions>
              </q-card>
            </div>
          </div>

          <!-- Content: Upcoming Classes & Schedule -->
          <div class="row q-col-gutter-lg q-mt-lg">
            <div class="col-12">
              <q-card flat class="content-card">
                <q-card-section class="q-pa-lg">
                  <div class="row items-center justify-between q-mb-lg">
                    <div class="text-h6 text-weight-bold text-dark row items-center">
                      <q-icon name="calendar_month" color="primary" class="q-mr-sm" size="sm" />
                      Mes prochains cours et examens
                    </div>
                    <q-btn flat color="primary" label="Voir tout le planning" to="/planning" class="hover-underline text-weight-bold" dense />
                  </div>

                  <q-list separator class="activity-list" v-if="upcomingClasses.length > 0">
                    <q-item v-for="c in upcomingClasses" :key="c.id" class="q-py-md activity-item rounded-borders q-mb-sm">
                      <q-item-section avatar>
                        <div class="activity-icon-container" :class="c.class === 'exam' ? 'icon-bg-red' : 'icon-bg-primary'">
                          <q-icon :name="c.class === 'exam' ? 'edit_document' : 'menu_book'" size="20px" />
                        </div>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-weight-bold text-dark">
                          {{ c.subjectName }} 
                          <q-badge color="red" class="q-ml-sm text-weight-bold q-px-sm" v-if="c.class === 'exam'">Examen</q-badge>
                        </q-item-label>
                        <q-item-label caption class="text-grey-5 row items-center q-gutter-x-md q-mt-xs">
                          <span class="row items-center"><q-icon name="person" class="q-mr-xs" /> {{ c.teacherName }}</span>
                          <span class="row items-center"><q-icon name="room" class="q-mr-xs" /> {{ c.room }}</span>
                        </q-item-label>
                      </q-item-section>
                      <q-item-section side class="text-right">
                        <div class="text-weight-bold text-primary">{{ c.formattedDate }}</div>
                        <div class="text-caption text-grey-5 q-mt-xs">{{ c.formattedTime }}</div>
                      </q-item-section>
                    </q-item>
                  </q-list>

                  <div v-else class="text-center q-py-xl text-grey-6 border-thin rounded-borders">
                    <q-icon name="calendar_today" size="48px" color="grey-4" class="q-mb-sm" />
                    <div class="text-weight-medium q-mt-sm">Aucun cours programmé pour les prochains jours.</div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>

        <!-- Sidebar: GPA progress & Quick Links -->
        <div class="col-12 col-md-4">
          <!-- GPA Visual Widget -->
          <q-card flat class="q-mb-lg gpa-widget-card text-center bg-gradient-premium text-white q-pa-md">
            <q-card-section>
              <div class="text-subtitle1 text-weight-bold q-mb-md tracking-wider text-uppercase">Moyenne Générale</div>
              
              <div class="q-my-lg row justify-center">
                <q-circular-progress
                  show-value
                  class="text-white text-h4 text-weight-bold circular-progress-gpa"
                  :value="studentGpa * 5"
                  size="130px"
                  :thickness="0.12"
                  color="white"
                  track-color="rgba(255, 255, 255, 0.15)"
                >
                  {{ studentGpa.toFixed(2) }}
                  <div class="text-caption text-weight-regular text-white-50" style="font-size: 11px; margin-top: 4px;">/ 20</div>
                </q-circular-progress>
              </div>

              <div class="text-body2 text-white-90 q-mt-md text-weight-medium q-px-sm">
                {{ gpaFeedback }}
              </div>
            </q-card-section>
          </q-card>

          <!-- Quick Links Component -->
          <QuickLinks class="quick-links-panel" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import QuickLinks from "~/components/QuickLinks.vue";
import { useAuthModule } from "~/stores/auth/authModule";
import { useGradesModule } from "~/stores/grades/gradesModule";
import { usePlanningModule } from "~/stores/planning/planningModule";
import { useSubjectModule } from "~/stores/subject/subjectModule";
import { useGroupModule } from "~/stores/group/groupModule";
import { getAllUsers } from "~/stores/auth/authService";
import moment from "moment";

definePageMeta({
  middleware: "auth",
  roles: ["student"],
});

const { t } = useI18n();

useHead({
  title: computed(() => t("useHead.student.index")),
});

const authModule = useAuthModule();
const gradesStore = useGradesModule();
const planningStore = usePlanningModule();
const subjectStore = useSubjectModule();
const groupStore = useGroupModule();

const absencesCount = ref(0);
const upcomingClasses = ref<any[]>([]);
const loading = ref(true);

const refreshData = async () => {
  loading.value = true;
  try {
    const studentId = authModule.getId;
    const groupName = authModule.getGroup || "";
    
    const [_, absencesRes, groupSpecs, allUsers] = await Promise.all([
      gradesStore.loadStudentGrades(studentId),
      $fetch<any[]>("/api/attendance/student-absences", {
        params: { studentId, groupName },
      }),
      $fetch<any[]>("/api/groups/specialties").catch(() => []),
      getAllUsers().catch(() => []),
      planningStore.loadPlanning(),
      subjectStore.loadSubjects(),
      groupStore.fetchGroups()
    ]);
    
    if (absencesRes) {
      absencesCount.value = absencesRes.reduce((sum, item) => sum + (item.absencesCount || 0), 0);
    }

    const teachers = (allUsers || []).filter((u: any) => u.role === "teacher");
    
    const groupOptions = groupStore.groups.map((g) => {
      if (typeof g === "string") {
        return { label: g, value: g, specialty: null };
      }
      const gName = g.name || g.label || g.id;
      const value = g.id || g.name;
      const mapping = (groupSpecs || []).find((m: any) => m.groupId === g.id);
      const specialty = mapping ? mapping.specialty : null;
      return { label: gName, value: value, specialty: specialty };
    });

    const studentGroup = groupOptions.find(
      (g) => g.label === groupName || g.value === groupName
    );

    let list = planningStore.getEvents;
    if (studentGroup) {
      list = list.filter(
        (e) =>
          e.groupId === studentGroup.value &&
          (!e.specialty || e.specialty === studentGroup.specialty)
      );
    } else {
      list = list.filter((e) => e.groupId === groupName);
    }

    const now = new Date();
    const groupEvents = list
      .filter(e => new Date(e.start) >= now)
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      .slice(0, 3);

    upcomingClasses.value = groupEvents.map(e => {
      const subject = subjectStore.subjects.find(s => s.id === e.subjectId);
      const teacher = teachers.find((t: any) => t.id === e.teacherId);
      const teacherName = teacher ? `${teacher.firstName} ${teacher.lastName}` : "Enseignant";
      return {
        id: e.id,
        subjectName: subject?.name || e.title || "Matière",
        teacherName,
        room: e.classroom || e.room || "Non spécifiée",
        class: e.class,
        formattedDate: moment(e.start).format("DD/MM"),
        formattedTime: `${moment(e.start).format("HH:mm")} - ${moment(e.end).format("HH:mm")}`,
      };
    });

  } catch (error) {
    console.error("Failed to load student dashboard stats", error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await refreshData();
});

const enrolledCoursesCount = computed(() => gradesStore.studentGrades.length);
const studentGpa = computed(() => gradesStore.gpa || 0);

const gpaFeedback = computed(() => {
  const gpa = studentGpa.value;
  if (gpa >= 16) return "Excellent parcours académique ! Continuez ainsi.";
  if (gpa >= 14) return "Très bon travail. Vous êtes sur la bonne voie !";
  if (gpa >= 12) return "Bonne performance. Continuez vos efforts.";
  if (gpa >= 10) return "Travail satisfaisant. Persévérez pour progresser.";
  return "Attention, restez concentré et demandez de l'aide si besoin.";
});

const stats = computed(() => [
  { 
    title: t("student.index.stats.enrolledCourses"), 
    value: enrolledCoursesCount.value.toString(), 
    color: "primary", 
    icon: "book",
    route: "/student/grades"
  },
  {
    title: t("student.index.stats.gpa"),
    value: studentGpa.value.toFixed(2),
    color: "positive",
    icon: "assessment",
    route: "/student/grades"
  },
  { 
    title: t("student.index.stats.absences"), 
    value: absencesCount.value.toString(), 
    color: "warning", 
    icon: "event_busy",
    route: "/student/absences"
  },
]);
</script>

<style scoped>
.myCard {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.5);
}
.text-gradient {
  background: linear-gradient(135deg, #1e1b4b 0%, #4f46e5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.tracking-wider {
  letter-spacing: 0.05em;
}
.hover-scale {
  transition: transform 0.2s ease;
}
.hover-scale:hover {
  transform: scale(1.05);
}

/* Stat Cards */
.stat-card {
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  background: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}
.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}
.stat-card.border-primary::before {
  background: linear-gradient(90deg, #4f46e5, #818cf8);
}
.stat-card.border-positive::before {
  background: linear-gradient(90deg, #10b981, #34d399);
}
.stat-card.border-warning::before {
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.1);
}
.stat-card:hover .arrow-icon {
  transform: translateX(4px);
  color: var(--q-primary);
}
.arrow-icon {
  transition: transform 0.2s ease, color 0.2s ease;
}

/* Icon Containers */
.icon-container {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon-bg-primary {
  background: rgba(79, 70, 229, 0.08) !important;
  color: #4f46e5 !important;
}
.icon-bg-positive {
  background: rgba(16, 185, 129, 0.08) !important;
  color: #10b981 !important;
}
.icon-bg-warning {
  background: rgba(245, 158, 11, 0.08) !important;
  color: #f59e0b !important;
}
.icon-bg-red {
  background: rgba(239, 68, 68, 0.08) !important;
  color: #ef4444 !important;
}

/* Content Cards */
.content-card {
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  background: white;
}
.activity-item {
  border: 1px solid transparent;
  transition: all 0.2s ease;
  margin-bottom: 8px;
}
.activity-item:hover {
  background: rgba(249, 250, 251, 0.8);
  border-color: rgba(0, 0, 0, 0.03);
}
.activity-icon-container {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* GPA Widget */
.gpa-widget-card {
  border-radius: 12px;
  overflow: hidden;
}
.bg-gradient-premium {
  background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
}
.text-white-80 {
  color: rgba(255, 255, 255, 0.8);
}
.text-white-50 {
  color: rgba(255, 255, 255, 0.5);
}
.border-thin {
  border: 1px solid rgba(0, 0, 0, 0.05);
}
</style>
