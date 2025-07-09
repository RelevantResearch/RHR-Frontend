import { z } from 'zod';


export const employeeBaseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number too short'),
  department: z.string().min(1, 'Department is required'),
  position: z.string().optional(),
  salary: z.string().optional(),
  joinDate: z.string(),  // you can add date validation here if needed
  employmentType: z.enum(['full-time', 'part-time']),
  role: z.string().min(1, 'Role is required'),
  address: z.string().optional(),
  status: z.enum(['active', 'inactive']),
});

export const addEmployeeSchema = employeeBaseSchema.extend({
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const editEmployeeSchema = employeeBaseSchema.extend({
  password: z.string().min(6).optional(),
});
