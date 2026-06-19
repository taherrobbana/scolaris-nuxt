import { defineStore } from "pinia";
import {
  fetchEventGrades,
  saveEventGrades,
  fetchStudentGrades,
  fetchGroupGradesStatus,
  validateReportCard,
} from "./gradesService";

export interface GradesState {
  eventGrades: any[];
  studentGrades: any[];
  groupGradesStatus: any[];
  gpa: number;
  coefficientSum: number;
  status: string;
  reportCardValidated: boolean;
  loading: boolean;
  saving: boolean;
}

export const useGradesModule = defineStore("gradesModule", {
  state: (): GradesState => ({
    eventGrades: [],
    studentGrades: [],
    groupGradesStatus: [],
    gpa: 0,
    coefficientSum: 0,
    status: "pending",
    reportCardValidated: false,
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
        this.reportCardValidated = res?.reportCardValidated || false;
        return res;
      } catch (error) {
        console.error("Failed to load student grades", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async loadGroupGradesStatus(groupId: string) {
      this.loading = true;
      try {
        const res = await fetchGroupGradesStatus(groupId);
        this.groupGradesStatus = res?.students || [];
        return this.groupGradesStatus;
      } catch (error) {
        console.error("Failed to load group grades status", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async validateStudentReportCard(studentId: string, validated: boolean) {
      this.saving = true;
      try {
        const res = await validateReportCard(studentId, validated);
        // Update local list
        const studentIndex = this.groupGradesStatus.findIndex((s) => s.studentId === studentId);
        if (studentIndex !== -1) {
          this.groupGradesStatus[studentIndex].validated = validated;
          this.groupGradesStatus[studentIndex].validatedAt = new Date();
        }
        return res;
      } catch (error) {
        console.error("Failed to validate report card", error);
        throw error;
      } finally {
        this.saving = false;
      }
    },
  },
});
