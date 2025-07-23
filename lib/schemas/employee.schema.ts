import { z } from 'zod';

const baseEmployeeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(15, 'Phone number must not exceed 15 digits'),
  address: z.string().optional(),
  department: z.string().min(1, 'Please select a department'),
  position: z.string().min(2, 'Position must be at least 2 characters long').max(100, 'Position must not exceed 100 characters'),
  salary: z.string().min(1, 'Salary is required').refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, 'Please enter a valid salary amount'),
  joinDate: z.string().min(1, 'Join date is required'),
  employmentType: z.enum(['full-time', 'part-time'], {
    errorMap: () => ({ message: 'Please select an employment type' }),
  }),
  role: z.string().min(1, 'Please select a role'),
  status: z.enum(['active', 'inactive'], {
    errorMap: () => ({ message: 'Please select a status' }),
  }),
  bankDetails: z.object({
    accountHolder: z.string().optional(),
    accountNumber: z.string().optional(),
    bankName: z.string().optional(),
    panId: z.string().optional(),
    bankAddress: z.string().optional(),
  }).optional(),
});

export const addEmployeeSchema = baseEmployeeSchema.extend({
  password: z.string()
    .min(8, 'Password must be at least 8 characters long')
    .max(100, 'Password must not exceed 100 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
});

export const editEmployeeSchema = z.object({
  department: z.string().min(1, 'Please select a department'),
  position: z.string().min(2, 'Position must be at least 2 characters long').max(100, 'Position must not exceed 100 characters'),
  role: z.string().min(1, 'Please select a role'),
  employmentType: z.enum(['full-time', 'part-time'], {
    errorMap: () => ({ message: 'Please select an employment type' }),
  }),
  status: z.enum(['active', 'inactive'], {
    errorMap: () => ({ message: 'Please select a status' }),
  }),
  salary: z.string().min(1, 'Salary is required').refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, 'Please enter a valid salary amount'),
});

export const fullEmployeeSchema = baseEmployeeSchema.extend({
  password: z.string().optional(),
});

export type AddEmployeeFormData = z.infer<typeof addEmployeeSchema>;
export type EditEmployeeFormData = z.infer<typeof editEmployeeSchema>;
export type FullEmployeeFormData = z.infer<typeof fullEmployeeSchema>;