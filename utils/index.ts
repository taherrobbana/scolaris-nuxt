import moment from "moment";

export function isEmpty(value: any): boolean {
  return value === undefined || value === null || value === "";
}

export function deepClone(obj: any): any {
  return JSON.parse(JSON.stringify(obj));
}
export function detectRoleFromHeader(token: any) {
  try {
    if (!token || typeof token !== "string") {
      throw new Error("Token doit être une chaîne de caractères");
    }

    if (!token || !token.startsWith("Bearer ")) {
      throw createError({
        statusCode: 401,
        statusMessage: "Authorization token is missing or invalid",
      });
    }

    // Extract the token part (remove "Bearer ")
    const tokenValue = token.slice(7);
    const payloadBase64 = tokenValue.split(".")[1];

    if (!payloadBase64) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid token: missing payload",
      });
    }

    // Decode base64 URL-safe to base64
    let base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    // Add padding if needed
    while (base64.length % 4) {
      base64 += "=";
    }

    // Use atob() for browser, or fallback for Node.js
    const payloadStr =
      typeof window !== "undefined" && window.atob
        ? atob(base64)
        : Buffer.from(base64, "base64").toString("utf-8");

    const payload = JSON.parse(payloadStr);

    // Check multiple possible locations for roles
    const roles =
      payload.roles ||
      payload.realm_access?.roles ||
      payload.resource_access?.account?.roles ||
      [];

    if (!roles || roles.length === 0 || !Array.isArray(roles)) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid token: missing roles",
      });
    }

    const is_admin = roles.includes("admin");
    const is_coordinator = roles.includes("coordinator");
    const is_teacher = roles.includes("teacher");
    const is_student = roles.includes("student");

    console.log("payload in header", {
      is_admin,
      is_coordinator,
      is_teacher,
      is_student,
      available_roles: roles,
    });

    return {
      is_admin,
      is_coordinator,
      is_teacher,
      is_student,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid token",
    });
  }
}

export function decodeJWTBuffer(token: any) {
  try {
    if (!token || typeof token !== "string") {
      throw new Error("Token doit être une chaîne de caractères");
    }
    
    // Enlever le préfixe "Bearer " si présent
    const cleanToken = token.startsWith("Bearer ") ? token.slice(7) : token;
    const parts = cleanToken.split(".");

    if (parts.length !== 3) {
      throw new Error("Format JWT invalide. Doit avoir 3 parties.");
    }

    const decodeBase64 = (str: any) => {
      let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
      while (base64.length % 4) {
        base64 += "=";
      }
      // Node.js uniquement
      return Buffer.from(base64, "base64").toString("utf-8");
    };

    const header = JSON.parse(decodeBase64(parts[0]));
    const payload = JSON.parse(decodeBase64(parts[1]));

    return {
      header: header,
      payload: payload,
      signature: parts[2],
    };
  } catch (error: any) {
    throw new Error(`Erreur de décodage JWT: ${error.message}`);
  }
}


export function decodeJWT(token: any) {
  try {
    if (!token || typeof token !== "string") {
      throw new Error("Token doit être une chaîne de caractères");
    }
    const cleanToken = token.startsWith("Bearer ") ? token.slice(7) : token;
    const parts = cleanToken.split(".");

    if (parts.length !== 3) {
      throw new Error("Format JWT invalide. Doit avoir 3 parties.");
    }

    const decodeBase64 = (str: string) => {
      let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
      while (base64.length % 4) {
        base64 += "=";
      }
      return typeof window !== "undefined" && window.atob
        ? atob(base64)
        : Buffer.from(base64, "base64").toString("utf-8");
    };

    const header = JSON.parse(decodeBase64(parts[0]));
    const payload = JSON.parse(decodeBase64(parts[1]));

    return {
      header: header,
      payload: payload,
      signature: parts[2],
    };
  } catch (error: any) {
    throw new Error(`Erreur de décodage JWT: ${error.message}`);
  }
}

export function formatDate(
  dateString: any,
  inputFormat: any,
  outputFormat: any,
) {
  // Crée un objet moment à partir de la chaîne et du format d'entrée
  const date = moment(dateString, inputFormat);

  // Vérifie si la date est valide
  if (!date.isValid()) {
    throw new Error("Date invalide ou format d'entrée incorrect.");
  }

  // Retourne la date formatée
  return date.format(outputFormat);
}
import { computed } from "vue";
import { ALL_ROLES } from "./types";

export const routes = computed(() => {
  const { $t } = useNuxtApp();
  return [
    {
      caption: $t("sidebar.usersCaption"),
      icon: "people",
      label: $t("sidebar.users"),
      roles: ["admin"],
      route: "/admin/users",
    },
    {
      caption: $t("sidebar.groupsCaption"),
      icon: "diversity_3",
      label: $t("sidebar.groups"),
      roles: ["admin"],
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
        window.location.href = "/login";
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
      roles: ["coordinator"],
      route: "/coordinator/subjects",
    },
    {
      icon: "event_busy",
      label: $t("sidebar.absences"),
      caption: $t("sidebar.absencesCaption"),
      roles: ["student"],
      route: "/student/absences",
    },
    {
      icon: "grade",
      label: $t("sidebar.grades"),
      caption: $t("sidebar.gradesCaption"),
      roles: ["student"],
      route: "/student/grades",
    },
  ];
});
