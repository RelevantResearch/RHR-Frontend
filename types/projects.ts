// // types/projects.ts

// export interface Department {
//   id: number;
//   name: string;
//   description: string;
// }

// export interface User {
//   id: number;
//   name: string;
//   email: string;
//   phone: string;
//   document: string;
//   fullTimer: boolean;
//   profilePic: string | null;
//   salary: number;
//   address: string;
//   DOB: string;
//   position: string | null;
//   isDeleted: boolean;
//   createdAt: string;
//   updatedAt: string;
//   departmentId: number;
//   department?: Department;
// }

// export interface BaseUserAssignment {
//   id: number;
//   userId: number;
//   projectId: number;
//   assignedAt: string;
//   role: string;
// }

// export interface UserAssignment extends BaseUserAssignment {
//   user: User;
// }

// export interface Project {
//   isdeleted: boolean;
//   id: number;
//   name: string;
//   client: string;
//   budget: string;
//   deadline: string;
//   description: string;
//   endDate: string | null;
//   startDate: string;
//   status: string;
//   departmentId: number;
//   department?: Department;
//   userAssignments: UserAssignment[];
// }

// export interface ApiProject {
//   id: number;
//   name: string;
//   client: string;
//   budget: string;
//   deadline: string;
//   description: string;
//   endDate: string | null;
//   startDate: string;
//   status: string;
//   departmentId: number;
//   department?: Department;
//   userAssignments: UserAssignment[];
// }

// export interface ApiProject {
//   id: number;
//   name: string;
//   client: string;
//   budget: string;
//   deadline: string;
//   description: string;
//   endDate: string | null;
//   startDate: string;
//   status: string;
//   departmentId: number;
//   department?: Department;
//   userAssignments: UserAssignment[];
// }

// export interface ProjectFormData {
//   name: string;
//   clientName: string;
//   description: string;
//   department: string;
//   budget: string;
//   status: string;
//   startDate: string;
//   endDate: string;
//   deadline: string;
// }

// export interface ProjectFormInitialData extends ProjectFormData {
//   id?: number;
//   userAssignments: {
//     userId: number | string;
//     role: string;
//     name?: string;
//     email?: string;
//     department?: string;
//   }[];
// }

// export interface ProjectFormProps {
//   initialData?: Partial<ProjectFormInitialData>;
//   departments: string[];
//   statuses: string[];
//   onSubmit: (data: ProjectFormData, userAssignments: { userId: number; role: string }[]) => Promise<void>;
//   onCancel: () => void;
//   isSubmitting?: boolean;
//   submitButtonText?: string;
//   title?: string;
// }


// export interface UserAssignment {
//   userId: number;
//   role: string;
// }

// export interface ProjectPayload {
//   name: string;
//   client: string;
//   budget: string;
//   deadline: string;
//   departmentId: number;
//   description: string;
//   status: string;
//   startDate: string;
//   endDate: string;
//   userAssignments: UserAssignment[];
// }


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

export interface BaseUserAssignment {
  id: number;
  userId: number;
  projectId: number;
  assignedAt: string;
  role: string;
}

export interface UserAssignment extends BaseUserAssignment {
  user: User;
}

// For API requests/responses
export interface UserAssignmentPayload {
  userId: number;
  role: string;
}

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

// API payload for create/update operations
export interface ProjectPayload {
  name: string;
  client: string;
  budget: string;
  deadline: string;
  departmentId: number;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  userAssignments: UserAssignmentPayload[];
}

// Form-specific interfaces
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

export interface ProjectFormUserAssignment {
  userId: number | string;
  role: string;
  name?: string;
  email?: string;
  department?: string;
}

export interface ProjectFormInitialData extends ProjectFormData {
  id?: number;
  userAssignments: ProjectFormUserAssignment[];
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

// API response types
export interface ProjectResponse {
  message: string;
}