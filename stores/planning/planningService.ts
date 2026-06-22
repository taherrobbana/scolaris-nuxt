import { useAuthModule } from "../auth/authModule";

export interface ScheduleEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  subjectId?: string;
  groupId?: string;
  teacherId?: string;
  specialty?: string;
  discription?: string;
  class?: string;
}

function getAuthHeaders(): Record<string, string> {
  const authModule = useAuthModule();
  return { Authorization: `Bearer ${authModule.getToken}` };
}

function getApiBase(): string {
  const config = useRuntimeConfig();
  return config.public.planningApiBase as string;
}

export async function fetchAllPlanning(): Promise<ScheduleEvent[]> {
  const res: any = await $fetch(getApiBase(), {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return res || [];
}

export async function createPlanningApi(data: Omit<ScheduleEvent, "id">): Promise<ScheduleEvent> {
  const res: any = await $fetch(getApiBase(), {
    method: "POST",
    headers: getAuthHeaders(),
    body: data,
  });
  return res;
}

export async function bulkCreatePlanningApi(data: Omit<ScheduleEvent, "id">[]): Promise<ScheduleEvent[]> {
  const res: any = await $fetch(`${getApiBase()}/bulk`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: data,
  });
  return res;
}

export async function updatePlanningApi(id: string, data: Omit<ScheduleEvent, "id">): Promise<ScheduleEvent> {
  const res: any = await $fetch(`${getApiBase()}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: data,
  });
  return res;
}

export async function deletePlanningApi(id: string): Promise<void> {
  await $fetch(`${getApiBase()}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
}
