import { defineStore } from "pinia";
import {
  login,
  register,
  resetPassword,
  sendRecoveryMail,
} from "./authService";
import { Notify } from "quasar";
import { useNuxtApp } from "nuxt/app";

export interface AuthState {
  username: string;
  firstName: string;
  lastName: string;
  role: Role | string;
  connected: boolean;
  token: string;
  refreshToken: string;
}

export const useAuthModule = defineStore("authModule", {
  state: (): AuthState => ({
    username: "",
    firstName: "",
    lastName: "",
    role: Role.student,
    connected: false,
    token: "",
    refreshToken: "",
  }),

  getters: {
    getUsername: (state) => state.username,
    getFirstName: (state) => state.firstName,
    getLastName: (state) => state.lastName,
    getRole: (state) => state.role,
    isConnected: (state) => state.connected,
    getToken: (state) => state.token,
    getRefreshToken: (state) => state.refreshToken,
  },

  actions: {
    setUsername(username: string) {
      this.username = username;
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
    setToken(token: string) {
      this.token = token;
    },
    setRefreshToken(refreshToken: string) {
      this.refreshToken = refreshToken;
    },

    initAuth() {
      this.setUsername("");
      this.setFirstName("");
      this.setLastName("");
      this.setRole("");
      this.setConnected(false);
      this.setToken("");
      this.setRefreshToken("");
    },
    handleLoginResponse(res: any) {
      const { $router } = useNuxtApp();
      if (res) {
        let data = decodeJWT(res.token).payload;
        if (data.username) this.setUsername(data.username);
        if (data.firstName) this.setFirstName(data.firstName);
        if (data.lastName) this.setLastName(data.lastName);
        if (res.role) this.setRole(res.role);
        if (res.token) this.setToken(res.token);
        if (res.refreshToken) this.setRefreshToken(res.refreshToken);
        this.setConnected(true);
        $router.push("/" + res.role);
      }
    },
    async login(body: any) {
      await login(body).then((res: any) => {
        this.handleLoginResponse(res);
        Notify.create({
          type: "positive",
          message: res.message || "Successfully logged in",
        });
      });
    },
    async register(payload: any) {
      await register(payload).then((res: any) => {
        if (res) {
          Notify.create({
            type: "positive",
            message: res.message || "Account created successfully",
          });
          this.handleLoginResponse(res);
        }
      });
    },
    async sendRecoveryMail(payload: any) {
      await sendRecoveryMail(payload).then((res: any) => {
        if (res) {
          Notify.create({
            type: "positive",
            message: res.message || "Mail sent successfully",
          });
        }
      });
    },
    async resetPassword(payload: any) {
      const { $router } = useNuxtApp();
      await resetPassword(payload).then((res: any) => {
        if (res) {
          Notify.create({
            type: "positive",
            message: res.message || "Mot de passe réinitialisé avec succès",
          });
          $router.push("/login");
        }
      });
    },
  },

  persist: true,
});
