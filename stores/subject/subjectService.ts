import { useAuthModule } from "../auth/authModule";

export interface Subject {
  id: string;
  code: string;
  name: string;
  coefficient: number;
  description?: string;
  specialty?: string;
  sessionsCount?: number;
  toleratedAbsences?: number;
}

function getAuthHeaders(): Record<string, string> {
  const authModule = useAuthModule();
  return { Authorization: `Bearer ${authModule.getToken}` };
}

function getApiBase(): string {
  const config = useRuntimeConfig();
  return config.public.subjectApiBase as string;
}

export async function fetchAllSubjects(): Promise<Subject[]> {
  const res: any = await $fetch(`${getApiBase()}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  // Support both array and paginated { content: [] } responses
  return Array.isArray(res) ? res : (res?.content ?? []);
}

export async function createSubjectApi(
  data: Omit<Subject, "id">,
): Promise<Subject> {
  const res: any = await $fetch(`${getApiBase()}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: data,
  });
  return res;
}

export async function updateSubjectApi(
  id: string,
  data: Omit<Subject, "id">,
): Promise<Subject> {
  const res: any = await $fetch(`${getApiBase()}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: data,
  });
  return res;
}

export async function deleteSubjectApi(id: string): Promise<void> {
  await $fetch(`${getApiBase()}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
}
