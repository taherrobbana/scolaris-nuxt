import { useAuthModule } from "../auth/authModule";

function getAuthHeaders(): Record<string, string> {
  const authModule = useAuthModule();
  return { Authorization: `Bearer ${authModule.token}` };
}

export async function fetchEventGrades(eventId: string): Promise<any> {
  return await $fetch(`/api/grades/${eventId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
}

export async function saveEventGrades(eventId: string, records: any[]): Promise<any> {
  return await $fetch(`/api/grades/${eventId}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: { records },
  });
}

export async function fetchStudentGrades(studentId: string): Promise<any> {
  return await $fetch(`/api/grades/student/${studentId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
}
