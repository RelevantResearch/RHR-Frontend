// lib/utils/project-payload.ts

import { ProjectFormData } from '@/types/projects';

const statusMap: Record<string, string> = {
  processing: 'PROCRESSING',
  active: 'ACTIVE',
  'on-hold': 'ON_HOLD',
  completed: 'COMPLETED',
  cancelled: 'CANCELLED',
};

export function transformFormDataToPayload(
  formData: ProjectFormData,
  userAssignments: { userId: number; role: string }[],
  departmentIdMap: Record<string, number>
) {
  const normalizedStatus = formData.status.toLowerCase();

  return {
    name: formData.name,
    client: formData.clientName,
    budget: formData.budget,
    deadline: new Date(formData.deadline).toISOString(),
    departmentId: departmentIdMap[formData.department] || 1,
    description: formData.description,
    status: statusMap[normalizedStatus] || 'ACTIVE',
    startDate: new Date(formData.startDate).toISOString(),
    endDate: new Date(formData.endDate).toISOString(),
    userAssignments,
  };
}
