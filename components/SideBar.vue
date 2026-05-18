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
    caption: "Gestion des comptes",
    icon: "people",
    label: "Utilisateurs",
    roles: [Role.admin],
    route: "/admin/users",
  },
  {
    caption: "Gestion des groupes",
    icon: "diversity_3",
    label: "Groupes",
    roles: [Role.admin],
    route: "/admin/groups",
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
