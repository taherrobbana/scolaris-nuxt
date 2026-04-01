import { useAuthModule } from "~/stores/auth/authModule";

export default defineNuxtRouteMiddleware((to, from) => {
  const authModule = useAuthModule();
  const userRole = authModule.getRole;

  if (!authModule.isConnected) {
    return navigateTo("/login");
  }

  const allowedRoles = to.meta.roles as string[];

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return navigateTo("/unauthorized");
  }
});
