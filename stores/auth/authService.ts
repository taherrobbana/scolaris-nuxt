export async function login(body: any) {
  const config = useRuntimeConfig();
  try {
    const res = await $fetch(`${config.public.authApiBase}auth/login`, {
      method: "POST",
      body: body,
    });
    return res;
  } catch (error: any) {
    throw new Error(error.response._data.message);
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
    const res: any = await $fetch(
      `${config.public.authApiBase}auth/forgot-password`,
      {
        method: "POST",
        body: body,
      },
    );
    return res.response;
  } catch (error: any) {
    throw new Error(error.response._data.message);
  }
}
export async function resetPassword(body: any) {
  const config = useRuntimeConfig();
  try {
    const res: any = await $fetch(
      `${config.public.authApiBase}auth/reset-password`,
      {
        method: "POST",
        body: body,
      },
    );
    return res.response;
  } catch (error: any) {
    throw new Error(error.response._data.message);
  }
}
