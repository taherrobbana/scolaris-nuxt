<template>
  <q-list style="padding-top: 20px">
    <q-item v-for="r in filtredRoutesByRole" clickable @click="route(r.route)" :active="selectedRoute(r.route)"
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

const { $router } = useNuxtApp();
function route(path: string) {
  $router.push(path);
}

const authModule = useAuthModule();
// const role = authModule.getRole
const role = "student"

function selectedRoute(route: string) {
  const actualRoute = $router.currentRoute.value.fullPath
  return route === actualRoute
}
const routes = [
  {
    icon: "manage_accounts",
    label: "Administration",
    caption: "Espace de gestion du système",
    role: "admin",
    route: "/admin",
  },
  {
    caption: "Statistiques et actions rapides",
    icon: "dashboard",
    label: "Tableau de bord",
    role: "admin",
    route: "/admin/dashboard",
  },
  {
    caption: "Approuver les offres de stage",
    icon: "assignment_turned_in",
    label: "Validation des offres",
    role: "admin",
    route: "/admin/offers-approval",
  },
  {
    caption: "Gestion des comptes",
    icon: "people",
    label: "Utilisateurs",
    role: "admin",
    route: "/admin/users",
  },
  {
    caption: "Approuver enseignants et entreprises",
    icon: "verified_user",
    label: "Validation des utilisateurs",
    role: "admin",
    route: "/admin/users-approval",
  },
  {
    caption: "Gestion des stages entreprise",
    icon: "dashboard",
    label: "Tableau de bord",
    role: "company",
    route: "/company",
  },
  {
    caption: "Approuver ou refuser les demandes",
    icon: "how_to_reg",
    label: "Candidatures",
    role: "company",
    route: "/company/applications",
  },
  {
    caption: "Publier une nouvelle offre de stage",
    icon: "add_business",
    label: "Créer une offre",
    role: "company",
    route: "/company/create-offer",
  },
  {
    caption: "Évaluer les stagiaires",
    icon: "rate_review",
    label: "Évaluations",
    role: "company",
    route: "/company/evaluations",
  },
  {
    caption: "Suivi et validation des étapes",
    icon: "track_changes",
    label: "Suivi des stages",
    role: "company",
    route: "/company/follow",
  },
  {
    caption: "Vue générale de mon stage",
    icon: "dashboard",
    label: "Tableau de bord",
    role: "student",
    route: "/student",
  },
  {
    caption: "Journal, rapport et pièces jointes",
    icon: "folder",
    label: "Mes documents",
    role: "student",
    route: "/student/documents",
  },
  {
    caption: "Avancement et étapes du stage",
    icon: "timeline",
    label: "Suivi du stage",
    role: "student",
    route: "/student/follow",
  },
  {
    caption: "Consulter et postuler aux stages",
    icon: "work_outline",
    label: "Offres de stage",
    role: "student",
    route: "/student/offers",
  },
  {
    caption: "Informations personnelles et CV",
    icon: "account_circle",
    label: "Mon profil",
    role: "student",
    route: "/student/profile",
  },
  {
    caption: "Détails du stage en cours",
    icon: "assignment",
    label: "Mon stage",
    role: "student",
    route: "/student/stage",
  },
  {
    caption: "Suivi pédagogique global",
    icon: "dashboard",
    label: "Tableau de bord",
    role: "teacher",
    route: "/teacher",
  },
  {
    caption: "Valider journaux et rapports",
    icon: "fact_check",
    label: "Validation & suivi",
    role: "teacher",
    route: "/teacher/follow",
  },
  {
    caption: "Stages sous ma responsabilité",
    icon: "school",
    label: "Stages encadrés",
    role: "teacher",
    route: "/teacher/stages",
  },
  {
    caption: "Liste des étudiants encadrés",
    icon: "groups",
    label: "Mes étudiants",
    role: "teacher",
    route: "/teacher/students",
  },
];
const filtredRoutesByRole = routes.filter((r) => r.role === role);
</script>

<style scoped></style>
