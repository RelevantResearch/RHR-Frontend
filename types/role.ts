export interface Role {
    id: number;
    name: string;
    priority?: number;
    priorityLabel?: string;
    description?: string; // (add these if missing)
    permissions?: string[];
    assignedEmployees?: string[];
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
  }
  