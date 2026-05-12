import { useAuthModule } from "./authModule";

export async function login(body: any) {
  const config = useRuntimeConfig();
  try {
    const res = await $fetch(`${config.public.authApiBase}auth/login`, {
      method: "POST",
      body: body,
    });
    return res;
  } catch (error: any) {
    Notify.create({
      type: "negative",
      message: error.response._data.error,
    });
  }
}
export async function register(body: any) {
  const config = useRuntimeConfig();
  try {
    const data = {
      firstName: body.firstName,
      lastName: body.lastName,
      username: body.username,
      password: body.password,
      role: body.role || Role.student,
    };
    const res = await $fetch(`${config.public.authApiBase}auth/register`, {
      method: "POST",
      body: data,
    });
    return res;
  } catch (error: any) {
    Notify.create({
      type: "negative",
      message: error.response._data.error,
    });
  }
}
export async function sendRecoveryMail(body: any) {
  const config = useRuntimeConfig();
  try {
    const res = await $fetch(
      `${config.public.authApiBase}auth/forgot-password`,
      {
        method: "POST",
        body: body,
      },
    );
    return res;
  } catch (error: any) {
    Notify.create({
      type: "negative",
      message: error.response._data.error,
    });
  }
}
export async function resetPassword(body: any) {
  const config = useRuntimeConfig();
  try {
    const data = {
      code: body.token,
      newPassword: body.newPassword,
    };
    const res = await $fetch(
      `${config.public.authApiBase}auth/reset-password`,
      {
        method: "POST",
        body: data,
      },
    );
    return res;
  } catch (error: any) {
    Notify.create({
      type: "negative",
      message: error.response._data.fields.newPassword,
    });
  }
}

export async function bulkCreateUsers(users: any[]) {
  const config = useRuntimeConfig();
  const authModule = useAuthModule();
  const token = authModule.getToken;
  try {
    const res = await $fetch(`${config.public.authApiBase}users/bulk`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: users,
    });
    return res;
  } catch (error: any) {
    Notify.create({
      type: "negative",
      message:
        error.response?._data?.error || "Erreur lors de la création en masse",
    });
  }
}

export async function updateUser(id: string, data: any) {
  const config = useRuntimeConfig();
  const authModule = useAuthModule();
  const token = authModule.getToken;
  try {
    const res = await $fetch(`${config.public.authApiBase}users/${id}`, {
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
      message: error.response?._data?.error || "Erreur lors de la modification",
    });
  }
}

export async function getAllUsers() {
  const config = useRuntimeConfig();
  const authModule = useAuthModule();
  const token = authModule.getToken;
  try {
    const res: any = await $fetch(`${config.public.authApiBase}users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.content;
  } catch (error: any) {
    Notify.create({
      type: "negative",
      message:
        error.response?._data?.error ||
        "Erreur lors de la récupération des utilisateurs",
    });
  }
}
