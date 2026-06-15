import { defineStore } from "pinia";
import { fetchEventGrades, saveEventGrades, fetchStudentGrades } from "./gradesService";

export interface GradesState {
  eventGrades: any[];
  studentGrades: any[];
  gpa: number;
  coefficientSum: number;
  status: string;
  loading: boolean;
  saving: boolean;
}

export const useGradesModule = defineStore("gradesModule", {
  state: (): GradesState => ({
    eventGrades: [],
    studentGrades: [],
    gpa: 0,
    coefficientSum: 0,
    status: "pending",
    loading: false,
    saving: false,
  }),

  actions: {
    async loadEventGrades(eventId: string) {
      this.loading = true;
      try {
        const res = await fetchEventGrades(eventId);
        this.eventGrades = res?.records || [];
        return this.eventGrades;
      } catch (error) {
        console.error("Failed to load event grades", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async submitEventGrades(eventId: string, records: any[]) {
      this.saving = true;
      try {
        const res = await saveEventGrades(eventId, records);
        return res;
      } catch (error) {
        console.error("Failed to save event grades", error);
        throw error;
      } finally {
        this.saving = false;
      }
    },

    async loadStudentGrades(studentId: string) {
      this.loading = true;
      try {
        const res = await fetchStudentGrades(studentId);
        this.studentGrades = res?.grades || [];
        this.gpa = res?.gpa || 0;
        this.coefficientSum = res?.coefficientSum || 0;
        this.status = res?.status || "pending";
        return res;
      } catch (error) {
        console.error("Failed to load student grades", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
