export async function login(body: any) {
  try {
    const res = await $fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      body: body,
    });
    return res;
  } catch (error: any) {
    throw new Error(error.response._data.message);
  }
}
export async function register(body: any) {
  try {
    const res = await $fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      body: body,
    });
    return res;
  } catch (error: any) {
    throw new Error(error.response._data.message);
  }
}
export async function sendRecoveryMail(body: any) {
  try {
    const res: any = await $fetch(
      "http://localhost:8080/api/auth/forgot-password",
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
  try {
    const res: any = await $fetch(
      "http://localhost:8080/api/auth/reset-password",
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
