import { defineStore } from "pinia";
import { getAllGroups, createGroup, updateGroup, deleteGroup } from "./groupService";

export const useGroupModule = defineStore("groupModule", {
  state: () => ({
    groups: [] as any[],
    loading: false,
  }),

  actions: {
    async fetchGroups() {
      this.loading = true;
      try {
        const res = await getAllGroups();
        this.groups = res || [];
      } finally {
        this.loading = false;
      }
    },

    async addGroup(data: any) {
      const res = await createGroup(data);
      if (res) {
        await this.fetchGroups();
      }
      return res;
    },

    async editGroup(id: string, data: any) {
      const res = await updateGroup(id, data);
      if (res) {
        await this.fetchGroups();
      }
      return res;
    },

    async removeGroup(id: string) {
      const success = await deleteGroup(id);
      if (success) {
        await this.fetchGroups();
      }
      return success;
    },
  },
});
