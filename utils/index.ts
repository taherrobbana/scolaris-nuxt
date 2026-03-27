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

