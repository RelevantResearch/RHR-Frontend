// types/projects.ts

export interface Department {
  id: number;
  name: string;
  description: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  document: string;
  fullTimer: boolean;
  profilePic: string | null;
  salary: number;
  address: string;
  DOB: string;
  position: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  departmentId: number;
  department?: Department;
}

// Base user assignment without populated user
export interface BaseUserAssignment {
  id: number;
  userId: number;
  projectId: number;
  assignedAt: string;
  role: string;
}

// User assignment with populated user data
export interface UserAssignment extends BaseUserAssignment {
  user: User;
}

// API Project type that might not have populated user data
export interface Project {
  isdeleted: boolean;
  id: number;
  name: string;
  client: string;
  budget: string;
  deadline: string;
  description: string;
  endDate: string | null;
  startDate: string;
  status: string;
  departmentId: number;
  department?: Department;
  userAssignments: UserAssignment[];
}

export interface ApiProject {
  id: number;
  name: string;
  client: string;
  budget: string;
  deadline: string;
  description: string;
  endDate: string | null;
  startDate: string;
  status: string;
  departmentId: number;
  department?: Department;
  userAssignments: UserAssignment[];
}

export interface ApiProject {
  id: number;
  name: string;
  client: string;
  budget: string;
  deadline: string;
  description: string;
  endDate: string | null;
  startDate: string;
  status: string;
  departmentId: number;
  department?: Department;
  userAssignments: UserAssignment[];
}

export interface ProjectFormData {
  name: string;
  clientName: string;
  description: string;
  department: string;
  budget: string;
  status: string;
  startDate: string;
  endDate: string;
  deadline: string;
}

// Create a specific interface for form initial data that includes id
export interface ProjectFormInitialData extends ProjectFormData {
  id?: number;
  userAssignments: {
    userId: number | string;
    role: string;
    name?: string;
    email?: string;
    department?: string;
  }[];
}

export interface ProjectFormProps {
  initialData?: Partial<ProjectFormInitialData>;
  departments: string[];
  statuses: string[];
  onSubmit: (data: ProjectFormData, userAssignments: { userId: number; role: string }[]) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
  title?: string;
}