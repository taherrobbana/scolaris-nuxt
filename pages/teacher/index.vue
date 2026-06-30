<template>
  <q-page padding class="teacher-dashboard-page">
    <div class="myCard q-pa-lg">
      <!-- Header -->
      <div class="row items-center justify-between q-mb-lg header-section">
        <div>
          <div class="text-h5 text-weight-bold text-gradient q-mb-xs">
            {{ $t("teacher.index.title") }}
          </div>
          <div class="text-caption text-grey-6 text-weight-medium">
            Espace enseignant de {{ authModule.getUser?.firstName }} {{ authModule.getUser?.lastName }}
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
              v-for="stat in stats"
              :key="stat.title"
            >
              <q-card 
                class="stat-card cursor-pointer" 
                :class="'border-' + stat.color"
                flat 
                v-ripple
                @click="$router.push(stat.route)"
              >
                <q-card-section class="row items-center justify-between q-pa-md">
                  <div>
                    <div class="text-caption text-grey-6 text-weight-bold text-uppercase tracking-wider" style="font-size: 10px;">{{ stat.title }}</div>
                    <div class="text-h4 text-weight-bold q-mt-xs text-dark">{{ stat.value }}</div>
                  </div>
                  <div class="icon-container" :class="'icon-bg-' + stat.color">
                    <q-icon :name="stat.icon" size="22px" />
                  </div>
                </q-card-section>
                <q-card-actions class="q-py-xs q-px-md bg-grey-1 row items-center justify-between card-footer">
                  <span class="text-caption text-grey-6 text-weight-medium" style="font-size: 11px;">Accéder</span>
                  <q-icon name="arrow_forward" color="grey-6" size="14px" class="arrow-icon" />
                </q-card-actions>
              </q-card>
            </div>
          </div>

          <!-- Content: Next Classes & Ungraded Exams -->
          <div class="row q-col-gutter-lg q-mt-lg">
            <!-- Next Classes -->
            <div class="col-12">
              <q-card flat class="content-card">
                <q-card-section class="q-pa-lg">
                  <div class="row items-center justify-between q-mb-lg">
                    <div class="text-h6 text-weight-bold text-dark row items-center">
                      <q-icon name="calendar_month" color="primary" class="q-mr-sm" size="sm" />
                      Mes prochains cours
                    </div>
                    <q-btn flat color="primary" label="Mon planning complet" to="/planning" class="hover-underline text-weight-bold" dense />
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
                          <span class="row items-center text-weight-bold text-secondary"><q-icon name="groups" class="q-mr-xs" /> {{ c.groupName }}</span>
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
                    <div class="text-weight-medium q-mt-sm">Aucun cours programmé prochainement.</div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- Ungraded Exams -->
            <div class="col-12">
              <q-card flat class="content-card">
                <q-card-section class="q-pa-lg">
                  <div class="text-h6 text-weight-bold text-dark q-mb-lg row items-center">
                    <q-icon name="edit_note" color="warning" class="q-mr-sm" size="sm" />
                    Examens passés à corriger
                  </div>

                  <q-list separator class="activity-list" v-if="ungradedExams.length > 0">
                    <q-item v-for="ex in ungradedExams" :key="ex.id" class="q-py-md activity-item rounded-borders q-mb-sm">
                      <q-item-section avatar>
                        <div class="activity-icon-container icon-bg-warning">
                          <q-icon name="grade" size="20px" />
                        </div>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-weight-bold text-dark">{{ ex.subjectName }}</q-item-label>
                        <q-item-label caption class="text-grey-5 q-mt-xs">
                          Groupe: <span class="text-weight-medium text-dark">{{ ex.groupName }}</span> | Date: {{ ex.formattedDate }}
                        </q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-btn 
                          color="primary" 
                          unelevated 
                          label="Saisir les notes" 
                          size="sm" 
                          class="text-weight-bold action-btn"
                          to="/planning"
                        />
                      </q-item-section>
                    </q-item>
                  </q-list>

                  <div v-else class="text-center q-py-xl text-grey-6 border-thin rounded-borders">
                    <q-icon name="check_circle" size="48px" color="positive" class="q-mb-sm" />
                    <div class="text-weight-medium q-mt-sm">Toutes les copies d'examens sont corrigées !</div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>

        <!-- Sidebar: Quick Links -->
        <div class="col-12 col-md-4">
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
import { usePlanningModule } from "~/stores/planning/planningModule";
import { useSubjectModule } from "~/stores/subject/subjectModule";
import { fetchEventGrades } from "~/stores/grades/gradesService";
import moment from "moment";

definePageMeta({
  middleware: "auth",
  roles: ["teacher"],
});

const { t } = useI18n();

useHead({
  title: computed(() => t("useHead.teacher.index")),
});

const authModule = useAuthModule();
const planningStore = usePlanningModule();
const subjectStore = useSubjectModule();

const assignedGroupsCount = ref(0);
const activeCoursesCount = ref(0);
const papersToGradeCount = ref(0);
const upcomingClasses = ref<any[]>([]);
const ungradedExams = ref<any[]>([]);
const loading = ref(true);

const refreshData = async () => {
  loading.value = true;
  try {
    const teacherId = authModule.getId;
    
    await Promise.all([
      planningStore.loadPlanning(),
      subjectStore.loadSubjects(),
    ]);

    const teacherEvents = planningStore.getEvents.filter(e => e.teacherId === teacherId);

    // Count unique groups
    const groupIds = Array.from(new Set(teacherEvents.map(e => e.groupId).filter(Boolean)));
    assignedGroupsCount.value = groupIds.length;

    // Count unique subjects
    const subjectIds = Array.from(new Set(teacherEvents.map(e => e.subjectId).filter(Boolean)));
    activeCoursesCount.value = subjectIds.length;

    // Filter upcoming events for the teacher
    const now = new Date();
    const futureEvents = teacherEvents
      .filter(e => new Date(e.start) >= now)
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      .slice(0, 3);

    upcomingClasses.value = futureEvents.map(e => {
      const subject = subjectStore.subjects.find(s => s.id === e.subjectId);
      const groupName = typeof e.group === "string" ? e.group : (e.group?.name || e.groupName || "Groupe");
      return {
        id: e.id,
        subjectName: subject?.name || e.title || "Cours",
        groupName,
        room: e.classroom || e.room || "Non spécifiée",
        class: e.class,
        formattedDate: moment(e.start).format("DD/MM"),
        formattedTime: `${moment(e.start).format("HH:mm")} - ${moment(e.end).format("HH:mm")}`,
      };
    });

    // Count ungraded papers and build list of past ungraded exams
    const pastExams = teacherEvents.filter(e => e.class === "exam" && new Date(e.end) < now);
    let papersCount = 0;
    const examsList: any[] = [];

    await Promise.all(pastExams.map(async (exam) => {
      try {
        const res = await fetchEventGrades(exam.id);
        const records = res?.records || res || [];
        if (Array.isArray(records)) {
          const ungraded = records.filter((r: any) => r.grade === null || r.grade === undefined).length;
          if (ungraded > 0) {
            papersCount += ungraded;
            const subject = subjectStore.subjects.find(s => s.id === exam.subjectId);
            const groupName = typeof exam.group === "string" ? exam.group : (exam.group?.name || exam.groupName || "Groupe");
            examsList.push({
              id: exam.id,
              subjectName: subject?.name || exam.title || "Examen",
              groupName,
              formattedDate: moment(exam.start).format("DD/MM/YYYY"),
              ungradedCount: ungraded
            });
          }
        }
      } catch (e) {
        console.error("Failed to load grades for exam " + exam.id, e);
      }
    }));

    papersToGradeCount.value = papersCount;
    ungradedExams.value = examsList.sort((a, b) => b.id.localeCompare(a.id));
  } catch (error) {
    console.error("Failed to load teacher dashboard stats", error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await refreshData();
});

const stats = computed(() => [
  { 
    title: t("teacher.index.stats.assignedGroups"), 
    value: assignedGroupsCount.value.toString(), 
    color: "primary", 
    icon: "groups",
    route: "/planning"
  },
  { 
    title: t("teacher.index.stats.activeCourses"), 
    value: activeCoursesCount.value.toString(), 
    color: "secondary", 
    icon: "class",
    route: "/planning"
  },
  { 
    title: t("teacher.index.stats.papersToGrade"), 
    value: papersToGradeCount.value.toString(), 
    color: "warning", 
    icon: "edit",
    route: "/planning"
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
.stat-card.border-secondary::before {
  background: linear-gradient(90deg, #06b6d4, #22d3ee);
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
.icon-bg-secondary {
  background: rgba(6, 182, 212, 0.08) !important;
  color: #06b6d4 !important;
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

/* Quick Actions & Links */
.action-btn {
  border-radius: 12px;
  text-transform: none;
  font-size: 14px;
}
.quick-links-panel {
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}
.border-thin {
  border: 1px solid rgba(0, 0, 0, 0.05);
}
</style>
