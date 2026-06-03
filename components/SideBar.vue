<template>
  <div class="sidebar-container column full-height">
    <q-list style="padding-top: 10px" class="col-grow">
      <q-item v-for="r in mainRoutes" :key="r.route" clickable @click="r.action ? r.action() : r.route ? navigateTo(r.route) : ''"
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
        <q-item v-for="r in footerRoutes" :key="r.route || r.label" clickable @click="r.action ? r.action() : r.route ? navigateTo(r.route) : ''"
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
import { computed, type ComputedRef } from 'vue';
import { useAuthModule } from "~/stores/auth/authModule";
import { Role, type RouteConfig, ALL_ROLES } from "~/utils/types";
import { useI18n } from 'vue-i18n';

const props = defineProps({
  leftDrawerOpen: {
    type: Boolean,
    required: true,
  },
});

const { $router } = useNuxtApp();
const { t } = useI18n();
const authModule = useAuthModule();

function navigateTo(path: string) {
  $router.push(path);
}

const role = computed(() => authModule.getRole);

function selectedRoute(r: RouteConfig) {
  const actualRoute = $router.currentRoute.value.fullPath;
  return r.route === actualRoute || r?.secondaryRoutes?.includes(actualRoute);
}

const routes: ComputedRef<RouteConfig[]> = computed(() => [
  {
    caption: t("sidebar.usersCaption"),
    icon: "people",
    label: t("sidebar.users"),
    roles: [Role.admin],
    route: "/admin/users",
  },
  {
    caption: t("sidebar.groupsCaption"),
    icon: "diversity_3",
    label: t("sidebar.groups"),
    roles: [Role.admin],
    route: "/admin/groups",
  },
  {
    caption: t("sidebar.profileCaption"),
    icon: "account_circle",
    label: t("sidebar.profile"),
    roles: ALL_ROLES,
    route: "/profile",
    secondaryRoutes: ["/mon-profil", "/account"],
  },
  {
    icon: "help_outline",
    label: t("sidebar.help"),
    caption: t("sidebar.helpCaption"),
    roles: ALL_ROLES,
    route: "/help",
    isFooter: true,
  },
  {
    icon: "settings",
    label: t("sidebar.settings"),
    caption: t("sidebar.settingsCaption"),
    roles: ALL_ROLES,
    route: "/settings",
    isFooter: true,
  },
  {
    icon: "logout",
    label: t("sidebar.logout"),
    caption: t("sidebar.logoutCaption"),
    roles: ALL_ROLES,
    isFooter: true,
    action: logout,
  },
  {
    icon: "calendar_month",
    label: t("sidebar.calTest"),
    caption: t("sidebar.calTest"),
    roles: ALL_ROLES,
    route: "/planning",
  },
  {
    icon: "menu_book",
    label: t("sidebar.subjects"),
    caption: t("sidebar.subjectsCaption"),
    roles: [Role.coordinator],
    route: "/coordinator/subjects",
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
}

.sidebar-footer {
  flex-shrink: 0;
  width: 100%;
}
</style>
