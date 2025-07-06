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
