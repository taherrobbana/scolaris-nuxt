import { useAuthModule } from "../auth/authModule";
import { Notify } from "quasar";

export async function getAllGroups() {
  const config = useRuntimeConfig();
  const authModule = useAuthModule();
  const token = authModule.getToken;
  try {
    const res: any = await $fetch(`${config.public.authApiBase}groups`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error: any) {
    Notify.create({
      type: "negative",
      message: error.response?._data?.error || "Erreur lors de la récupération des groupes",
    });
  }
}

export async function createGroup(data: any) {
  const config = useRuntimeConfig();
  const authModule = useAuthModule();
  const token = authModule.getToken;
  try {
    const res = await $fetch(`${config.public.authApiBase}groups`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });
    return res;
  } catch (error: any) {
    Notify.create({
      type: "negative",
      message: error.response?._data?.error || "Erreur lors de la création du groupe",
    });
  }
}

export async function updateGroup(id: string, data: any) {
  const config = useRuntimeConfig();
  const authModule = useAuthModule();
  const token = authModule.getToken;
  try {
    const res = await $fetch(`${config.public.authApiBase}groups/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });
    return res;
  } catch (error: any) {
    Notify.create({
      type: "negative",
      message: error.response?._data?.error || "Erreur lors de la modification du groupe",
    });
  }
}

export async function deleteGroup(id: string) {
  const config = useRuntimeConfig();
  const authModule = useAuthModule();
  const token = authModule.getToken;
  try {
    await $fetch(`${config.public.authApiBase}groups/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return true;
  } catch (error: any) {
    Notify.create({
      type: "negative",
      message: error.response?._data?.error || "Erreur lors de la suppression du groupe",
    });
    return false;
  }
}
