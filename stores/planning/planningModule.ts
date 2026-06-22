import { defineStore } from "pinia";
import {
  fetchAllPlanning,
  createPlanningApi,
  bulkCreatePlanningApi,
  updatePlanningApi,
  deletePlanningApi,
  type ScheduleEvent,
} from "./planningService";

export interface PlanningState {
  events: ScheduleEvent[];
  loading: boolean;
}

export const usePlanningModule = defineStore("planningModule", {
  state: (): PlanningState => ({
    events: [],
    loading: false,
  }),

  getters: {
    getEvents: (state) => state.events,
    isLoading: (state) => state.loading,
  },

  actions: {
    async loadPlanning() {
      this.loading = true;
      try {
        const list = await fetchAllPlanning();
        this.events = list;
      } catch (error) {
        console.error("Failed to load planning", error);
      } finally {
        this.loading = false;
      }
    },

    async addPlanning(data: Omit<ScheduleEvent, "id">) {
      this.loading = true;
      try {
        const created = await createPlanningApi(data);
        this.events.push(created);
        return created;
      } catch (error) {
        console.error("Failed to create planning event", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async bulkAddPlanning(data: Omit<ScheduleEvent, "id">[]) {
      this.loading = true;
      try {
        const createdList = await bulkCreatePlanningApi(data);
        this.events.push(...createdList);
        return createdList;
      } catch (error) {
        console.error("Failed to bulk create planning events", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async editPlanning(id: string, data: Omit<ScheduleEvent, "id">) {
      this.loading = true;
      try {
        const updated = await updatePlanningApi(id, data);
        const idx = this.events.findIndex((e) => e.id === id);
        if (idx !== -1) {
          this.events[idx] = updated;
        }
        return updated;
      } catch (error) {
        console.error("Failed to update planning event", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async removePlanning(id: string) {
      this.loading = true;
      try {
        await deletePlanningApi(id);
        this.events = this.events.filter((e) => e.id !== id);
      } catch (error) {
        console.error("Failed to delete planning event", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
