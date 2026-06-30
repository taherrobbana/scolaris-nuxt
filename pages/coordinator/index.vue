<template>
  <q-page padding class="coordinator-dashboard-page">
    <div class="myCard q-pa-lg">
      <!-- Header -->
      <div class="row items-center justify-between q-mb-lg header-section">
        <div>
          <div class="text-h5 text-weight-bold text-gradient q-mb-xs">
            {{ $t("coordinator.index.title") }}
          </div>
          <div class="text-caption text-grey-6 text-weight-medium">
            Tableau de bord de coordination académique
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
        <div class="col-12 col-md-8">
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
                  <span class="text-caption text-grey-6 text-weight-medium" style="font-size: 11px;">Gérer</span>
                  <q-icon name="arrow_forward" color="grey-6" size="14px" class="arrow-icon" />
                </q-card-actions>
              </q-card>
            </div>
          </div>

          <!-- Content: Pending Validations Breakdown -->
          <div class="row q-col-gutter-lg q-mt-lg">
            <div class="col-12">
              <q-card flat class="content-card">
                <q-card-section class="q-pa-lg">
                  <div class="row items-center justify-between q-mb-lg">
                    <div class="text-h6 text-weight-bold text-dark row items-center">
                      <q-icon name="pending_actions" color="warning" class="q-mr-sm" size="sm" />
                      Bulletins en attente de validation
                    </div>
                    <q-btn flat color="primary" label="Tout voir" to="/coordinator/grades" class="hover-underline text-weight-bold" dense />
                  </div>

                  <q-list separator class="activity-list" v-if="pendingGroups.length > 0">
                    <q-item 
                      v-for="g in pendingGroups" 
                      :key="g.id" 
                      clickable 
                      v-ripple 
                      @click="$router.push(`/coordinator/grades?group=${g.id}`)"
                      class="q-py-md activity-item rounded-borders q-mb-sm"
                    >
                      <q-item-section avatar>
                        <div class="activity-icon-container icon-bg-warning">
                          <q-icon name="diversity_3" size="20px" />
                        </div>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-weight-bold text-dark">{{ g.name }}</q-item-label>
                        <q-item-label caption class="text-grey-5 q-mt-xs">
                          {{ g.pendingCount }} étudiant(s) en attente de validation de bulletin
                        </q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-btn 
                          color="warning" 
                          unelevated 
                          label="Valider" 
                          size="sm" 
                          class="text-weight-bold action-btn"
                          :to="`/coordinator/grades?group=${g.id}`"
                        />
                      </q-item-section>
                    </q-item>
                  </q-list>
                  
                  <div v-else class="text-center q-py-xl text-grey-6 border-thin rounded-borders">
                    <q-icon name="check_circle" size="48px" color="positive" class="q-mb-sm" />
                    <div class="text-weight-medium q-mt-sm">Tous les bulletins sont validés ! Excellent travail.</div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>

        <!-- Sidebar: Quick Actions & Quick Links -->
        <div class="col-12 col-md-4">
          <!-- Quick Actions Widget -->
          <q-card flat class="q-mb-lg quick-actions-card">
            <q-card-section class="q-pa-lg">
              <div class="text-h6 text-weight-bold text-dark q-mb-lg row items-center">
                <q-icon name="bolt" color="amber-8" class="q-mr-sm" size="sm" />
                Actions de Coordination
              </div>
              <div class="row q-col-gutter-sm">
                <div class="col-12">
                  <q-btn
                    outline
                    color="primary"
                    class="full-width q-py-md text-weight-bold action-btn text-left"
                    icon="menu_book"
                    align="left"
                    to="/coordinator/subjects"
                    label="Gérer les Matières & Profs"
                  />
                </div>
                <div class="col-12">
                  <q-btn
                    outline
                    color="secondary"
                    class="full-width q-py-md text-weight-bold action-btn text-left"
                    icon="fact_check"
                    align="left"
                    to="/coordinator/grades"
                    label="Valider les Notes"
                  />
                </div>
                <div class="col-12">
                  <q-btn
                    unelevated
                    color="accent"
                    class="full-width q-py-md text-weight-bold action-btn main-action-btn text-left"
                    icon="calendar_month"
                    align="left"
                    to="/planning"
                    label="Consulter / Ajuster Planning"
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
import { fetchGroupGradesStatus } from "@/stores/grades/gradesService";

definePageMeta({
  middleware: "auth",
  roles: ["coordinator"],
});

const { t } = useI18n();

useHead({
  title: computed(() => t("useHead.coordinator.index")),
});

const usersList = ref<any[]>([]);
const groupStore = useGroupModule();
const pendingValidationsCount = ref(0);
const pendingGroups = ref<any[]>([]);
const loading = ref(true);

const refreshData = async () => {
  loading.value = true;
  try {
    const [resUsers] = await Promise.all([
      getAllUsers(),
      groupStore.fetchGroups()
    ]);
    usersList.value = resUsers || [];
    
    // Count pending validations by querying group statuses
    let unvalidated = 0;
    const groups = groupStore.groups;
    const list: any[] = [];
    
    if (groups && groups.length > 0) {
      await Promise.all(groups.map(async (g) => {
        const groupId = typeof g === "string" ? g : (g.id || g._id || g.name);
        const groupName = typeof g === "string" ? g : (g.name || g.label);
        if (groupId) {
          try {
            const status = await fetchGroupGradesStatus(groupId);
            if (status && status.students) {
              const pendingForGroup = status.students.filter((s: any) => !s.validated).length;
              if (pendingForGroup > 0) {
                unvalidated += pendingForGroup;
                list.push({
                  id: groupId,
                  name: groupName,
                  pendingCount: pendingForGroup
                });
              }
            }
          } catch (e) {
            console.error("Failed to fetch status for group " + groupId, e);
          }
        }
      }));
    }
    pendingValidationsCount.value = unvalidated;
    pendingGroups.value = list;
  } catch (error) {
    console.error("Failed to load coordinator index stats", error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await refreshData();
});

const totalGroups = computed(() => groupStore.groups.length);
const totalStudents = computed(() => usersList.value.filter(u => u.role === "student").length);

const stats = computed(() => [
  { 
    title: t("coordinator.index.stats.managedGroups"), 
    value: totalGroups.value.toString(), 
    color: "primary", 
    icon: "diversity_3",
    route: "/coordinator/subjects"
  },
  {
    title: t("coordinator.index.stats.totalStudents"),
    value: totalStudents.value.toString(),
    color: "secondary",
    icon: "school",
    route: "/coordinator/subjects"
  },
  {
    title: t("coordinator.index.stats.pendingValidations"),
    value: pendingValidationsCount.value.toString(),
    color: "warning",
    icon: "pending_actions",
    route: "/coordinator/grades"
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
.border-thin {
  border: 1px solid rgba(0, 0, 0, 0.05);
}
</style>

