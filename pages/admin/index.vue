<template>
  <q-page padding class="admin-dashboard-page">
    <div class="myCard q-pa-lg">
      <!-- Header -->
      <div class="row items-center justify-between q-mb-lg header-section">
        <div>
          <div class="text-h5 text-weight-bold text-gradient q-mb-xs">
            {{ $t("admin.index.title") }}
          </div>
          <div class="text-caption text-grey-6 text-weight-medium">
            Console d'administration globale de Scolaris
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

      <!-- Stats Cards -->
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6 col-md-3" v-for="stat in stats" :key="stat.title">
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
                <q-icon :name="stat.icon" size="24px" />
              </div>
            </q-card-section>
            <q-card-actions class="q-py-xs q-px-md bg-grey-1 row items-center justify-between card-footer">
              <span class="text-caption text-grey-6 text-weight-medium" style="font-size: 11px;">Voir les détails</span>
              <q-icon name="arrow_forward" color="grey-6" size="14px" class="arrow-icon" />
            </q-card-actions>
          </q-card>
        </div>
      </div>

      <!-- Content -->
      <div class="row q-col-gutter-lg q-mt-lg">
        <!-- Main Column -->
        <div class="col-12 col-md-8">
          <div class="row q-col-gutter-lg">
            <!-- Recent Activity -->
            <div class="col-12">
              <q-card flat class="content-card">
                <q-card-section class="q-pa-lg">
                  <div class="row items-center justify-between q-mb-lg">
                    <div class="text-h6 text-weight-bold text-dark row items-center">
                      <q-icon name="history" color="primary" class="q-mr-sm" size="sm" />
                      {{ $t("admin.index.recentActivity") }}
                    </div>
                    <q-btn flat color="primary" label="Gérer les utilisateurs" to="/admin/users" class="hover-underline text-weight-bold" dense />
                  </div>
                  
                  <q-list separator class="activity-list">
                    <q-item 
                      v-for="item in activities" 
                      :key="item.id"
                      clickable 
                      v-ripple
                      @click="$router.push(`/admin/users?search=${item.searchQuery}`)"
                      class="q-py-md activity-item rounded-borders q-mb-sm"
                    >
                      <q-item-section avatar>
                        <div class="activity-icon-container" :class="'icon-bg-' + item.color">
                          <q-icon :name="item.icon" size="20px" />
                        </div>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-weight-bold text-dark">{{ item.message }}</q-item-label>
                        <q-item-label caption class="text-grey-5 q-mt-xs">{{ item.date }}</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-icon name="chevron_right" color="grey-4" />
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>

            <!-- Planning Quick Stats Widget -->
            <div class="col-12">
              <q-card flat class="content-card bg-gradient-light q-pa-md">
                <q-card-section>
                  <div class="text-h6 text-weight-bold text-dark q-mb-lg row items-center">
                    <q-icon name="analytics" color="secondary" class="q-mr-sm" size="sm" />
                    Vue d'ensemble du planning académique
                  </div>
                  
                  <div class="row q-col-gutter-md text-center">
                    <div class="col-4">
                      <q-card flat class="bg-white q-pa-md bordered-thin stat-sub-card">
                        <div class="text-h4 text-weight-bold text-primary">{{ classSessionsCount }}</div>
                        <div class="text-caption text-grey-6 q-mt-xs text-weight-medium">Cours programmés</div>
                      </q-card>
                    </div>
                    <div class="col-4">
                      <q-card flat class="bg-white q-pa-md bordered-thin stat-sub-card">
                        <div class="text-h4 text-weight-bold text-red">{{ examSessionsCount }}</div>
                        <div class="text-caption text-grey-6 q-mt-xs text-weight-medium">Examens programmés</div>
                      </q-card>
                    </div>
                    <div class="col-4">
                      <q-card flat class="bg-white q-pa-md bordered-thin stat-sub-card">
                        <div class="text-h4 text-weight-bold text-positive">{{ totalSessionsCount }}</div>
                        <div class="text-caption text-grey-6 q-mt-xs text-weight-medium">Total sessions</div>
                      </q-card>
                    </div>
                  </div>

                  <div class="q-mt-xl progress-section q-px-sm">
                    <div class="row items-center justify-between text-caption text-grey-7 q-mb-sm">
                      <span class="text-weight-bold">Proportion d'examens</span>
                      <span class="text-weight-bold text-dark">{{ examProportion }}%</span>
                    </div>
                    <q-linear-progress :value="examProportion / 100" color="red" track-color="primary" class="rounded-borders progress-bar" size="10px" />
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>

        <!-- Sidebar Column -->
        <div class="col-12 col-md-4 class-gutter-y-md">
          <!-- Quick Actions Widget -->
          <q-card flat class="q-mb-lg quick-actions-card">
            <q-card-section class="q-pa-lg">
              <div class="text-h6 text-weight-bold text-dark q-mb-lg row items-center">
                <q-icon name="bolt" color="amber-8" class="q-mr-sm" size="sm" />
                Actions Rapides
              </div>
              <div class="row q-col-gutter-md">
                <div class="col-6">
                  <q-btn
                    outline
                    color="primary"
                    class="full-width q-py-md text-weight-bold action-btn"
                    icon="person_add"
                    stack
                    to="/admin/users"
                    label="Utilisateur"
                  />
                </div>
                <div class="col-6">
                  <q-btn
                    outline
                    color="secondary"
                    class="full-width q-py-md text-weight-bold action-btn"
                    icon="group_add"
                    stack
                    to="/admin/groups"
                    label="Créer Groupe"
                  />
                </div>
                <div class="col-12">
                  <q-btn
                    unelevated
                    color="accent"
                    class="full-width q-py-md text-weight-bold action-btn main-action-btn"
                    icon="calendar_month"
                    to="/planning"
                    label="Générer / Voir le Planning"
                  />
                </div>
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
import { getAllUsers } from "@/stores/auth/authService";
import { useGroupModule } from "@/stores/group/groupModule";
import { usePlanningModule } from "@/stores/planning/planningModule";

definePageMeta({
  middleware: "auth",
  roles: ["admin"],
});

const { t } = useI18n();

useHead({
  title: computed(() => t("useHead.admin.index")),
});

const usersList = ref<any[]>([]);
const groupStore = useGroupModule();
const planningStore = usePlanningModule();
const loading = ref(true);

const refreshData = async () => {
  loading.value = true;
  try {
    const [resUsers] = await Promise.all([
      getAllUsers(),
      groupStore.fetchGroups(),
      planningStore.loadPlanning(),
    ]);
    usersList.value = resUsers || [];
  } catch (error) {
    console.error("Failed to load admin index stats", error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await refreshData();
});

const totalStudents = computed(() => usersList.value.filter(u => u.role === "student").length);
const totalTeachers = computed(() => usersList.value.filter(u => u.role === "teacher").length);
const totalGroups = computed(() => groupStore.groups.length);
const pendingRequestsCount = computed(() => usersList.value.filter(u => u.role === "student" && !u.group).length);

// Planning calculations
const classSessionsCount = computed(() => planningStore.getEvents.filter(e => e.class === "class").length);
const examSessionsCount = computed(() => planningStore.getEvents.filter(e => e.class === "exam").length);
const totalSessionsCount = computed(() => planningStore.getEvents.length);
const examProportion = computed(() => {
  if (totalSessionsCount.value === 0) return 0;
  return Math.round((examSessionsCount.value / totalSessionsCount.value) * 100);
});

const stats = computed(() => [
  {
    title: t("admin.index.stats.totalStudents"),
    value: totalStudents.value.toString(),
    color: "primary",
    icon: "school",
    route: "/admin/users?search=student"
  },
  {
    title: t("admin.index.stats.teachers"),
    value: totalTeachers.value.toString(),
    color: "secondary",
    icon: "person",
    route: "/admin/users?search=teacher"
  },
  {
    title: t("admin.index.stats.activeGroups"),
    value: totalGroups.value.toString(),
    color: "positive",
    icon: "group",
    route: "/admin/groups"
  },
  {
    title: t("admin.index.stats.pendingRequests"),
    value: pendingRequestsCount.value.toString(),
    color: "warning",
    icon: "hourglass_empty",
    route: "/admin/users?search=" // Empty group users are listed in users list
  },
]);

const activities = computed(() => {
  if (usersList.value.length === 0) {
    return [
      {
        id: 1,
        message: "Aucune activité récente",
        date: "Maintenant",
        icon: "info",
        color: "grey",
        searchQuery: ""
      }
    ];
  }
  // Get last 4 users as recent activity
  return usersList.value.slice(-4).reverse().map((u, idx) => ({
    id: u.id || idx,
    message: t("admin.index.activity.newUser", { name: `${u.firstName} ${u.lastName}` }),
    date: `Rôle: ${t(`admin.users.roles.${u.role}`)}`,
    icon: u.role === "student" ? "school" : u.role === "teacher" ? "person" : "verified_user",
    color: u.role === "student" ? "primary" : u.role === "teacher" ? "secondary" : "positive",
    searchQuery: `${u.firstName} ${u.lastName}`
  }));
});
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
.icon-bg-secondary {
  background: rgba(6, 182, 212, 0.08) !important;
  color: #06b6d4 !important;
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

/* Planning Stats */
.bg-gradient-light {
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%) !important;
}
.bordered-thin {
  border: 1px solid rgba(0, 0, 0, 0.05);
}
.stat-sub-card {
  border-radius: 12px;
  transition: transform 0.2s ease;
}
.stat-sub-card:hover {
  transform: translateY(-2px);
}
.progress-bar {
  border-radius: 6px;
  height: 8px;
}

/* Quick Actions & Links */
.quick-actions-card {
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  background: white;
}
.action-btn {
  border-radius: 12px;
  text-transform: none;
  font-size: 14px;
}
.main-action-btn {
  box-shadow: 0 4px 12px rgba(147, 51, 234, 0.15);
}
.quick-links-panel {
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}
</style>


