export interface Role {
  id: number;
  name: string;
  description: string | null;
  RolePermission: any[]; // adjust as needed
}
