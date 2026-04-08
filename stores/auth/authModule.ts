import { defineStore } from "pinia";
import { login, register, resetPassword, sendRecoveryMail } from "./authService";
import { Notify } from "quasar";
import { useNuxtApp } from "nuxt/app";

export interface AuthState {
  email: string;
  firstName: string;
  lastName: string;
  role: Role | string;
  connected: boolean;
}

export const useAuthModule = defineStore("authModule", {
  state: (): AuthState => ({
    email: "",
    firstName: "",
    lastName: "",
    role: Role.student,
    connected: true,
  }),

  getters: {
    getEmail: (state) => state.email,
    getFirstName: (state) => state.firstName,
    getLastName: (state) => state.lastName,
    getRole: (state) => state.role,
    isConnected: (state) => state.connected,
  },

  actions: {
    setMail(email: string) {
      this.email = email;
    },
    setFirstName(firstName: string) {
      this.firstName = firstName;
    },
    setLastName(lastName: string) {
      this.lastName = lastName;
    },
    setRole(role: Role | string) {
      this.role = role;
    },
    setConnected(connected: boolean) {
      this.connected = connected;
    },

    initAuth() {
      this.setMail("");
      this.setFirstName("");
      this.setLastName("");
      this.setRole("");
      this.setMail("");
      this.setConnected(false);
    },

    async login(credentials: any) {
      const { $router } = useNuxtApp();

      await login(credentials)
        .then((res: any) => {
          let data = decodeJWT(res.token).payload;
          if (data.email) this.setMail(data.email);
          if (data.firstName) this.setFirstName(data.firstName);
          if (data.lastName) this.setLastName(data.lastName);
          if (data.role) this.setRole(data.role);
          this.setConnected(true);
          $router.push("/" + data.role);
          Notify.create({
            type: "positive",
            message: "Successfully logged in",
          });
        })
        .catch((error: any) => {
          Notify.create({
            type: "negative",
            message: error || "Login failed",
          });
        });
    },
    async register(payload: any) {
      await register(payload)
        .then((res: any) => {
          Notify.create({
            type: "positive",
            message: "Registred successfully",
          });
        })
        .catch((error: any) => {
          Notify.create({
            type: "negative",
            message: error || "Failed to register",
          });
        });
    },
    async sendRecoveryMail(payload: any) {
      const res = await sendRecoveryMail(payload)
        .then((res: any) => {
          Notify.create({
            type: "positive",
            message: "Vous avez reçu votre courriel de récupération !",
          });
          return res;
        })
        .catch((error: any) => {
          Notify.create({
            type: "negative",
            message: error || "Failed to send recovery mail",
          });
          return error;
        });
      return res;
    },
    async resetPassword(body: any) {
      const { $router } = useNuxtApp();

      await resetPassword(body)
        .then((res: any) => {
          $router.push("/login");
          Notify.create({
            type: "positive",
            message: "Mot de passe réinitialisé avec succès",
          });
        })
        .catch((error: any) => {
          Notify.create({
            type: "negative",
            message: error || "Failed to reset password",
          });
        });
    },
  },

  persist: true,
});
