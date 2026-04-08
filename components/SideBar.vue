<template>
  <div class="sidebar-container column full-height">
    <q-list style="padding-top: 10px" class="col-grow">
      <q-item v-for="r in mainRoutes" clickable @click="r.action ? r.action() : r.route ? navigateTo(r.route) : ''"
        :active="selectedRoute(r)" active-class="bg-grey-3" style="min-height: 52px">
        <q-item-section avatar style="min-width: none">
          <q-icon :name="r.icon" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ r.label }}</q-item-label>
          <q-item-label caption>{{ r.caption }}</q-item-label>
        </q-item-section>
        <q-tooltip v-if="!leftDrawerOpen" self="center left" class="bg-white text-dark shadow-10">
          <div class="row no-wrap items-center q-pa-xs">
            <q-icon :name="r.icon" size="24px" color="primary" class="q-mr-md" />
            <div>
              <div class="text-weight-bold text-subtitle2">{{ r.label }}</div>
              <div class="text-caption text-grey-8">{{ r.caption }}</div>
            </div>
          </div>
        </q-tooltip>
      </q-item>
    </q-list>
    <div v-if="footerRoutes.length > 0" class="sidebar-footer">
      <q-separator />
      <q-list>
        <q-item v-for="r in footerRoutes" clickable @click="r.action ? r.action() : r.route ? navigateTo(r.route) : ''"
          :active="selectedRoute(r)" active-class="bg-grey-3" style="min-height: 52px">
          <q-item-section avatar style="min-width: none">
            <q-icon :name="r.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ r.label }}</q-item-label>
            <q-item-label caption>{{ r.caption }}</q-item-label>
          </q-item-section>
          <q-tooltip v-if="!leftDrawerOpen" self="center left" class="bg-white text-dark shadow-10">
            <div class="row no-wrap items-center q-pa-xs">
              <q-icon :name="r.icon" size="24px" color="primary" class="q-mr-md" />
              <div>
                <div class="text-weight-bold text-subtitle2">{{ r.label }}</div>
                <div class="text-caption text-grey-8">{{ r.caption }}</div>
              </div>
            </div>
          </q-tooltip>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthModule } from "~/stores/auth/authModule";
import { Role, type RouteConfig, ALL_ROLES } from "~/utils/types";
const props = defineProps({
  leftDrawerOpen: {
    type: Boolean,
    required: true,
  },
});
const { $router } = useNuxtApp();
function navigateTo(path: string) {
  $router.push(path);
}

const authModule = useAuthModule();
const role = computed(() => authModule.getRole);

function selectedRoute(r: RouteConfig) {
  const actualRoute = $router.currentRoute.value.fullPath;
  return r.route === actualRoute || r?.secondaryRoutes?.includes(actualRoute);
}
const routes: ComputedRef<RouteConfig[]> = computed(() => [
  {
    icon: "manage_accounts",
    label: "Administration",
    caption: "Espace de gestion du système",
    roles: [Role.admin],
    route: "/admin",
  },
  {
    caption: "Statistiques et actions rapides",
    icon: "dashboard",
    label: "Tableau de bord",
    roles: [Role.admin],
    route: "/admin/dashboard",
  },
  {
    caption: "Approuver les offres de stage",
    icon: "assignment_turned_in",
    label: "Validation des offres",
    roles: [Role.admin],
    route: "/admin/offers-approval",
  },
  {
    caption: "Gestion des comptes",
    icon: "people",
    label: "Utilisateurs",
    roles: [Role.admin],
    route: "/admin/users",
  },
  {
    caption: "Approuver enseignants et entreprises",
    icon: "verified_user",
    label: "Validation des utilisateurs",
    roles: [Role.admin],
    route: "/admin/users-approval",
  },
  {
    caption: "Gestion des stages entreprise",
    icon: "dashboard",
    label: "Tableau de bord",
    roles: [Role.coordinator],
    route: "/coordinator",
  },
  {
    caption: "Approuver ou refuser les demandes",
    icon: "how_to_reg",
    label: "Candidatures",
    roles: [Role.coordinator],
    route: "/coordinator/applications",
  },
  {
    caption: "Publier une nouvelle offre de stage",
    icon: "add_business",
    label: "Créer une offre",
    roles: [Role.coordinator],
    route: "/coordinator/create-offer",
  },
  {
    caption: "Évaluer les stagiaires",
    icon: "rate_review",
    label: "Évaluations",
    roles: [Role.coordinator],
    route: "/coordinator/evaluations",
  },
  {
    caption: "Suivi et validation des étapes",
    icon: "track_changes",
    label: "Suivi des stages",
    roles: [Role.coordinator],
    route: "/coordinator/follow",
  },
  {
    caption: "Vue générale de mon stage",
    icon: "dashboard",
    label: "Tableau de bord",
    roles: [Role.student],
    route: "/student",
  },
  {
    caption: "Journal, rapport et pièces jointes",
    icon: "folder",
    label: "Mes documents",
    roles: [Role.student],
    route: "/student/documents",
  },
  {
    caption: "Avancement et étapes du stage",
    icon: "timeline",
    label: "Suivi du stage",
    roles: [Role.student],
    route: "/student/follow",
  },
  {
    caption: "Consulter et postuler aux stages",
    icon: "work_outline",
    label: "Offres de stage",
    roles: [Role.student],
    route: "/student/offers",
  },
  {
    caption: "Informations personnelles et CV",
    icon: "account_circle",
    label: "Mon profil",
    roles: ALL_ROLES,
    route: "/profile",
    secondaryRoutes: ["/mon-profil", "/account"],
  },
  {
    caption: "Détails du stage en cours",
    icon: "assignment",
    label: "Mon stage",
    roles: [Role.student],
    route: "/student/stage",
  },
  {
    caption: "Suivi pédagogique global",
    icon: "dashboard",
    label: "Tableau de bord",
    roles: [Role.teacher],
    route: "/teacher",
  },
  {
    caption: "Valider journaux et rapports",
    icon: "fact_check",
    label: "Validation & suivi",
    roles: [Role.teacher],
    route: "/teacher/follow",
  },
  {
    caption: "Stages sous ma responsabilité",
    icon: "school",
    label: "Stages encadrés",
    roles: [Role.teacher],
    route: "/teacher/stages",
  },
  {
    caption: "Liste des étudiants encadrés",
    icon: "groups",
    label: "Mes étudiants",
    roles: [Role.teacher],
    route: "/teacher/students",
  },
  {
    icon: "help_outline",
    label: "Centre d'aide",
    caption: "FAQ et guides",
    roles: ALL_ROLES,
    route: "/help",
    isFooter: true,
  },
  {
    icon: "settings",
    label: "Paramètres",
    caption: "Préférences du compte",
    roles: ALL_ROLES,
    route: "/settings",
    isFooter: true,
  },
  {
    icon: "logout",
    label: "Déconnexion",
    caption: "Quitter la session",
    roles: ALL_ROLES,
    isFooter: true,
    action: logout,
  },
  {
    icon: "calendar_month",
    label: "Vue Cal Test",
    caption: "Vue Cal Test",
    roles: ALL_ROLES,
    route: "/vue-cal-test",
  },
]);

const filtredRoutesByRole = computed(() =>
  routes.value.filter((r: RouteConfig) => r.roles.includes(role.value)),
);
const mainRoutes = computed(() =>
  filtredRoutesByRole.value.filter((r: RouteConfig) => !r?.isFooter),
);
const footerRoutes = computed(() =>
  filtredRoutesByRole.value.filter((r: RouteConfig) => r?.isFooter),
);

function logout() {
  authModule.initAuth();
  $router.push("/login");
}
</script>

<style scoped lang="scss">
.sidebar-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.col-grow {
  flex-grow: 1;
  overflow-y: auto;
  /* Permet le scroll si trop d'éléments */
}

.sidebar-footer {
  flex-shrink: 0;
  /* Empêche le footer de rétrécir */
  width: 100%;
}
</style>
