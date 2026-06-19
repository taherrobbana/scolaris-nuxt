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

export async function fetchGroupGradesStatus(groupId: string): Promise<any> {
  return await $fetch(`/api/grades/coordinator/group-status`, {
    method: "GET",
    headers: getAuthHeaders(),
    query: { groupId },
  });
}

export async function validateReportCard(studentId: string, validated: boolean): Promise<any> {
  return await $fetch(`/api/grades/coordinator/validate`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: { studentId, validated },
  });
}
