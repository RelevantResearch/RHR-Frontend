export type ProjectStatus = 'ACTIVE' | 'PROCRESSING' | 'CANCELLED' | 'COMPLETED' | 'ON_HOLD';

export interface Project {
  id: string;
  name: string;
  client: string; // DB field
  budget: number;
  description: string;
  department: string;      // for frontend display (department name)
  departmentId: number;    // for backend
  startDate: string;
  endDate: string;
  deadline: string;
  status: ProjectStatus;
  createdAt?: string;
  updatedAt?: string;

  // Frontend-only field (not sent to API)
  assignedEmployees?: string[];

}