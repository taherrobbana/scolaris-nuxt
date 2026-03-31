<template>
  <q-list style="padding-top: 20px">
    <q-item v-for="r in filtredRoutesByRole" clickable @click="navigateTo(r.route)" :active="selectedRoute(r)"
      active-class="bg-grey-3">
      <q-item-section avatar>
        <q-icon :name="r.icon" />
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ r.label }}</q-item-label>
        <q-item-label caption>{{ r.caption }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import { useAuthModule } from '~/stores/auth/authModule';
import { Role, type RouteConfig } from '~/utils/types';

const { $router } = useNuxtApp();
function navigateTo(path: string) {
  $router.push(path);
}

const authModule = useAuthModule();
// const role = authModule.getRole
const role = Role.student
// const role = Role.teacher
// const role = Role.admin
// const role = Role.coordinator

function selectedRoute(r: RouteConfig) {
  const actualRoute = $router.currentRoute.value.fullPath
  return r.route === actualRoute || r?.secondaryRoutes?.includes(actualRoute)
}
const routes: RouteConfig[] = [
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
    roles: [Role.student, Role.teacher, Role.admin, Role.coordinator],
    route: "/profile",
    secondaryRoutes: ["/mon-profil", "/account"]
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
];
const filtredRoutesByRole = routes.filter((r) => r.roles.includes(role));
</script>

<style scoped></style>
