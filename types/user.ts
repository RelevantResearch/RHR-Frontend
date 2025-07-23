import { Role } from "./role";

export type EmploymentType = 'full-time' | 'part-time';

export interface BankDetails {
  accountHolder: string;
  accountNumber: string;
  bankName: string;
  panId: string;
  bankAddress: string;
}

export interface userForm {
  name: string;
  email: string;
  password: string;
  phone: string;
  department: string;
  position: string;
  joinDate: string;
  employmentType: EmploymentType;
  role: string;
  address: string;
  bankDetails: BankDetails;
}

export type userStatus = 'active' | 'inactive';


export interface Employee {
  joinDate: any;
  id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  salary: string,
  address: string;
  document: string;
  fullTimer: boolean;
  isDeleted: boolean;
  profilePic?: string | null;
  department: {
    id: number;
    name: string;
    description: string;
  };
  bankInfo: {
    id: number;
    name: string;
    address: string;
    acName: string;
    acNumber: string;
    branch: string;
    additionalInformation: string;
    tax: string;
    documentType: string;
    document: string;
  };
  DOB: string;
  UserRole: {
    role: {
      id: number;
      name: string;
    };
  }[];
}


export type SortableEmployeeKey = 'name' | 'email' | 'role';

