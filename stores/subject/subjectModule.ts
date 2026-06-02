import { defineStore } from "pinia";
import {
  fetchAllSubjects,
  createSubjectApi,
  updateSubjectApi,
  deleteSubjectApi,
  type Subject,
} from "./subjectService";

const LS_KEY = "scolaris_subjects";

// ─── localStorage fallback helpers ─────────────────────────────────────────
function lsLoad(): Subject[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw) as Subject[];
  } catch {}
  // Seed with default subjects when empty
  const defaults: Subject[] = [
    { id: "1", code: "MATH01",  name: "Mathématiques",     coefficient: 4, specialty: "Informatique" },
    { id: "2", code: "PHY01",   name: "Physique",           coefficient: 3, specialty: "Informatique" },
    { id: "3", code: "FRA01",   name: "Français",           coefficient: 3, specialty: "Gestion" },
    { id: "4", code: "INFO01",  name: "Algorithmique",      coefficient: 5, specialty: "Informatique" },
    { id: "5", code: "GEST01",  name: "Comptabilité",       coefficient: 4, specialty: "Gestion" },
    { id: "6", code: "ELEC01",  name: "Électronique",       coefficient: 4, specialty: "Électronique" },
  ];
  localStorage.setItem(LS_KEY, JSON.stringify(defaults));
  return defaults;
}

function lsSave(list: Subject[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(list));
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// ─── State interface ────────────────────────────────────────────────────────
export interface SubjectState {
  subjects: Subject[];
  loading: boolean;
  useFallback: boolean;
}

// ─── Store ──────────────────────────────────────────────────────────────────
export const useSubjectModule = defineStore("subjectModule", {
  state: (): SubjectState => ({
    subjects: [],
    loading: false,
    useFallback: false,
  }),

  getters: {
    getSubjects: (state) => state.subjects,
    isLoading:   (state) => state.loading,
  },

  actions: {
    // ── Fetch ──────────────────────────────────────────────────────────────
    async loadSubjects() {
      this.loading = true;
      try {
        if (this.useFallback) throw new Error("already in fallback mode");
        const list = await fetchAllSubjects();
        this.subjects = list;
      } catch {
        // API unavailable – silently switch to localStorage
        this.useFallback = true;
        this.subjects = lsLoad();
      } finally {
        this.loading = false;
      }
    },

    // ── Create ─────────────────────────────────────────────────────────────
    async addSubject(data: Omit<Subject, "id">) {
      if (this.useFallback) {
        const newItem: Subject = { ...data, id: generateId() };
        this.subjects.push(newItem);
        lsSave(this.subjects);
        return newItem;
      }
      try {
        const created = await createSubjectApi(data);
        this.subjects.push(created);
        return created;
      } catch {
        this.useFallback = true;
        const newItem: Subject = { ...data, id: generateId() };
        this.subjects.push(newItem);
        lsSave(this.subjects);
        return newItem;
      }
    },

    // ── Update ─────────────────────────────────────────────────────────────
    async editSubject(id: string, data: Omit<Subject, "id">) {
      if (this.useFallback) {
        const idx = this.subjects.findIndex((s) => s.id === id);
        if (idx !== -1) { this.subjects[idx] = { id, ...data }; lsSave(this.subjects); }
        return;
      }
      try {
        const updated = await updateSubjectApi(id, data);
        const idx = this.subjects.findIndex((s) => s.id === id);
        if (idx !== -1) this.subjects[idx] = updated;
      } catch {
        this.useFallback = true;
        const idx = this.subjects.findIndex((s) => s.id === id);
        if (idx !== -1) { this.subjects[idx] = { id, ...data }; lsSave(this.subjects); }
      }
    },

    // ── Delete ─────────────────────────────────────────────────────────────
    async removeSubject(id: string) {
      if (this.useFallback) {
        this.subjects = this.subjects.filter((s) => s.id !== id);
        lsSave(this.subjects);
        return;
      }
      try {
        await deleteSubjectApi(id);
        this.subjects = this.subjects.filter((s) => s.id !== id);
      } catch {
        this.useFallback = true;
        this.subjects = this.subjects.filter((s) => s.id !== id);
        lsSave(this.subjects);
      }
    },
  },
});
