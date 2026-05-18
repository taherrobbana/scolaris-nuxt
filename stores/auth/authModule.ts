import { defineStore } from "pinia";
import {
  login,
  register,
  resetPassword,
  sendRecoveryMail,
  updateProfile,
} from "./authService";
import { Notify } from "quasar";
import { useNuxtApp } from "nuxt/app";
import type { emergencyContactsType } from "~/utils/types";

export interface AuthState {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  localStorageTick: number;
  avatar?: string;
  group?: string;
  gender?: string;
  birthDate?: string;
  birthPlace?: string;
  nationality?: string;
  phone?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  emergencyContacts?: emergencyContactsType[];
  documents?: Record<string, string>;
  role: Role | string;
  connected: boolean;
  token: string;
  refreshToken: string;
}

export const useAuthModule = defineStore("authModule", {
  state: (): AuthState => ({
    id: "",
    username: "",
    firstName: "",
    lastName: "",
    localStorageTick: 0,
    avatar: "",
    group: "",
    gender: "",
    birthDate: "",
    birthPlace: "",
    nationality: "",
    phone: "",
    address: "",
    postalCode: "",
    city: "",
    country: "",
    emergencyContacts: [],
    documents: {},
    role: Role.student,
    connected: false,
    token: "",
    refreshToken: "",
  }),

  getters: {
    getId: (state) => state.id,
    getUsername: (state) => state.username,
    getFirstName: (state) => state.firstName,
    getLastName: (state) => state.lastName,
    getAvatar: (state) => {
      state.localStorageTick; // Crée une dépendance réactive
      return typeof window !== 'undefined' ? localStorage.getItem('avatar') : null;
    },
    getGroup: (state) => state.group,
    getGender: (state) => state.gender,
    getBirthDate: (state) => state.birthDate,
    getBirthPlace: (state) => state.birthPlace,
    getNationality: (state) => state.nationality,
    getPhone: (state) => state.phone,
    getAddress: (state) => state.address,
    getPostalCode: (state) => state.postalCode,
    getCity: (state) => state.city,
    getCountry: (state) => state.country,
    getEmergencyContacts: (state) => state.emergencyContacts,
    getDocuments: (state) => {
      state.localStorageTick;
      return typeof window !== 'undefined' && localStorage.getItem('user_documents') 
        ? JSON.parse(localStorage.getItem('user_documents')!) 
        : {};
    },
    getRole: (state) => state.role,
    isConnected: (state) => state.connected,
    getToken: (state) => state.token,
    getRefreshToken: (state) => state.refreshToken,
  },

  actions: {
    setId(id: string) {
      this.id = id;
    },
    setUsername(username: string) {
      this.username = username;
    },
    setFirstName(firstName: string) {
      this.firstName = firstName;
    },
    setLastName(lastName: string) {
      this.lastName = lastName;
    },
    setAvatar(avatar: string) {
      localStorage.setItem("avatar", avatar);
      this.localStorageTick++;
    },
    setGroup(group: string) {
      this.group = group;
    },
    setGender(gender: string) {
      this.gender = gender;
    },
    setBirthDate(birthDate: string) {
      this.birthDate = birthDate;
    },
    setBirthPlace(birthPlace: string) {
      this.birthPlace = birthPlace;
    },
    setNationality(nationality: string) {
      this.nationality = nationality;
    },
    setPhone(phone: string) {
      this.phone = phone;
    },
    setAddress(address: string) {
      this.address = address;
    },
    setPostalCode(postalCode: string) {
      this.postalCode = postalCode;
    },
    setCity(city: string) {
      this.city = city;
    },
    setCountry(country: string) {
      this.country = country;
    },
    setEmergencyContacts(emergencyContacts: emergencyContactsType[]) {
      this.emergencyContacts = emergencyContacts;
    },
    setDocuments(documents: Record<string, string>) {
      this.documents = documents;
      if (typeof window !== 'undefined') {
        localStorage.setItem("user_documents", JSON.stringify(documents));
      }
      this.localStorageTick++;
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
      this.setId("");
      this.setUsername("");
      this.setFirstName("");
      this.setLastName("");
      this.setRole("");
      this.setConnected(false);
      this.setToken("");
      this.setRefreshToken("");
      localStorage.removeItem("avatar");
      localStorage.removeItem("user_documents");
      this.localStorageTick++;
      this.setGroup("");
      this.setGender("");
      this.setBirthDate("");
      this.setBirthPlace("");
      this.setNationality("");
      this.setPhone("");
      this.setAddress("");
      this.setPostalCode("");
      this.setCity("");
      this.setCountry("");
      this.setEmergencyContacts([]);
    },
    handleLoginResponse(res: any) {
      const { $router } = useNuxtApp();
      if (res) {
        let data = decodeJWT(res.token).payload;
        if (res.id) this.setId(res.id);
        if (res.token) this.setToken(res.token);
        if (res.refreshToken) this.setRefreshToken(res.refreshToken);
        if (res.username) this.setUsername(res.username);
        if (res.role) this.setRole(res.role);
        if (res.firstName) this.setFirstName(res.firstName);
        if (res.lastName) this.setLastName(res.lastName);
        if (res.group) this.setGroup(res.group);
        if (res.avatar) this.setAvatar(res.avatar);
        if (res.gender) this.setGender(res.gender);
        if (res.birthDate) this.setBirthDate(res.birthDate);
        if (res.birthPlace) this.setBirthPlace(res.birthPlace);
        if (res.nationality) this.setNationality(res.nationality);
        if (res.phone) this.setPhone(res.phone);
        if (res.address) this.setAddress(res.address);
        if (res.postalCode) this.setPostalCode(res.postalCode);
        if (res.city) this.setCity(res.city);
        if (res.country) this.setCountry(res.country);
        if (res.emergencyContacts)
          this.setEmergencyContacts(res.emergencyContacts);
        if (res.documents) this.setDocuments(res.documents);
        this.setConnected(true);
        $router.push("/" + res.role);
      }
    },
    async login(body: any) {
      const { $t } = useNuxtApp();
      await login(body).then((res: any) => {
        this.handleLoginResponse(res);
        Notify.create({
          type: "positive",
          message: res.message || $t('auth.messages.loginSuccess'),
        });
      });
    },
    async register(payload: any) {
      const { $t } = useNuxtApp();
      await register(payload).then((res: any) => {
        if (res) {
          Notify.create({
            type: "positive",
            message: res.message || $t('auth.messages.registerSuccess'),
          });
          this.handleLoginResponse(res);
        }
      });
    },
    async sendRecoveryMail(payload: any) {
      const { $t } = useNuxtApp();
      await sendRecoveryMail(payload).then((res: any) => {
        if (res) {
          Notify.create({
            type: "positive",
            message: res.message || $t('auth.messages.mailSent'),
          });
        }
      });
    },
    async resetPassword(payload: any) {
      const { $router, $t } = useNuxtApp();
      await resetPassword(payload).then((res: any) => {
        if (res) {
          Notify.create({
            type: "positive",
            message: res.message || $t('auth.messages.resetSuccess'),
          });
          $router.push("/login");
        }
      });
    },
    async updateProfile(payload: any) {
      const res: any = await updateProfile(payload);
      if (res) {
        if (res.firstName) this.setFirstName(res.firstName);
        if (res.lastName) this.setLastName(res.lastName);
        if (res.avatar) this.setAvatar(res.avatar);
        if (res.group) this.setGroup(res.group);
        if (res.gender) this.setGender(res.gender);
        if (res.birthDate) this.setBirthDate(res.birthDate);
        if (res.birthPlace) this.setBirthPlace(res.birthPlace);
        if (res.nationality) this.setNationality(res.nationality);
        if (res.phone) this.setPhone(res.phone);
        if (res.address) this.setAddress(res.address);
        if (res.postalCode) this.setPostalCode(res.postalCode);
        if (res.city) this.setCity(res.city);
        if (res.country) this.setCountry(res.country);
        if (res.emergencyContacts) this.setEmergencyContacts(res.emergencyContacts);
        if (res.documents) this.setDocuments(res.documents);
        return res;
      }
    },
  },

  persist: true,
});
