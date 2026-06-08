import moment from "moment";

export function isEmpty(value: any): boolean {
  return value === undefined || value === null || value === "";
}

export function deepClone(obj: any): any {
  return JSON.parse(JSON.stringify(obj))
}

export function decodeJWT(token: any) {
  try {
    if (!token || typeof token !== "string") {
      throw new Error("Token doit être une chaîne de caractères");
    }
    const parts = token.split(".");

    if (parts.length !== 3) {
      throw new Error("Format JWT invalide. Doit avoir 3 parties.");
    }

    const header = JSON.parse(atob(parts[0]));
    const payload = JSON.parse(atob(parts[1]));

    return {
      header: header,
      payload: payload,
      signature: parts[2],
    };
  } catch (error: any) {
    throw new Error(`Erreur de décodage JWT: ${error.message}`);
  }
}

export function formatDate(dateString: any, inputFormat: any, outputFormat: any) {
    // Crée un objet moment à partir de la chaîne et du format d'entrée
    const date = moment(dateString, inputFormat);
    
    // Vérifie si la date est valide
    if (!date.isValid()) {
        throw new Error("Date invalide ou format d'entrée incorrect.");
    }
    
    // Retourne la date formatée
    return date.format(outputFormat);
}
import { computed } from 'vue';
import { ALL_ROLES } from './types';

export const routes = computed(() => {
  const { $t } = useNuxtApp();
  return [
    {
      caption: $t("sidebar.usersCaption"),
      icon: "people",
      label: $t("sidebar.users"),
      roles: ['admin'],
      route: "/admin/users",
    },
    {
      caption: $t("sidebar.groupsCaption"),
      icon: "diversity_3",
      label: $t("sidebar.groups"),
      roles: ['admin'],
      route: "/admin/groups",
    },
    {
      caption: $t("sidebar.profileCaption"),
      icon: "account_circle",
      label: $t("sidebar.profile"),
      roles: ALL_ROLES,
      route: "/profile",
      secondaryRoutes: ["/mon-profil", "/account"],
    },
    {
      icon: "help_outline",
      label: $t("sidebar.help"),
      caption: $t("sidebar.helpCaption"),
      roles: ALL_ROLES,
      route: "/help",
      isFooter: true,
    },
    {
      icon: "settings",
      label: $t("sidebar.settings"),
      caption: $t("sidebar.settingsCaption"),
      roles: ALL_ROLES,
      route: "/settings",
      isFooter: true,
    },
    {
      icon: "logout",
      label: $t("sidebar.logout"),
      caption: $t("sidebar.logoutCaption"),
      roles: ALL_ROLES,
      isFooter: true,
      action: () => {
        // Simulation de déconnexion ou appel à une fonction globale
        window.location.href = '/login';
      },
    },
    {
      icon: "calendar_month",
      label: $t("sidebar.planning"),
      caption: $t("sidebar.planningCaption"),
      roles: ALL_ROLES,
      route: "/planning",
    },
    {
      icon: "menu_book",
      label: $t("sidebar.subjects"),
      caption: $t("sidebar.subjectsCaption"),
      roles: ['coordinator'],
      route: "/coordinator/subjects",
    },
  ];
});
