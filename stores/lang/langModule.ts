import { defineStore } from "pinia";
export interface LangState {
  language: string;
  test: boolean;
}
export const useLangModule = defineStore("langModule", {
  state: (): LangState => ({
    language: "fr",
    test: false,
  }),
  getters: {
    getLanguage: (state) => state.language,
  },
  actions: {
    setLanguage() {
      this.language = this.language === "fr" ? "en" : "fr";
    },
  },
  persist: true,
});
