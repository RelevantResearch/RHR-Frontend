import { EmployeeFormData } from "@/components/employeeForm";
import axiosInstance from "./axios";

export const getMyInfo = async () => {
  try {
    const response = await axiosInstance.get("/user/me");
    return response.data.user;
  } catch (error) {
    console.error("Failed to fetch my info", error);
    return null;
  }
};

export const getUserById = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/user/admin/${id}`);
    return response.data.user;
  } catch (error) {
    console.error(`Failed to fetch user with ID ${id}`, error);
    return null;
  }
};


export const updateUserByAdmin = async (id: number, formData: EmployeeFormData) => {
  try {
    const payload = {
      departmentId: parseInt(formData.department), 
      roleId: parseInt(formData.role),   
      position: formData.position,
      salary: parseFloat(formData.salary),         
      fullTimer: formData.employmentType === 'full-time', 
      isDeleted: formData.status === 'inactive'
    };

    console.log('API payload being sent:', payload); 

    const response = await axiosInstance.put(`/user/admin/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error(`Failed to update user with ID ${id}`, error);
    throw error;
  }
};
export interface CreateUserPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  fullTimer: boolean;
  salary: number;
  address?: string;
  roleId: number;
  position: string;
  departmentId: number;
  document?: string;
}

export async function createUserApi(userData: CreateUserPayload) {
  const response = await axiosInstance.post('/user/admin/create', userData);
  return response.data;
}

export const updateUserProfile = async (payload: any) => {
  try {
    const response = await axiosInstance.put("/user/me", payload);
    return response.data;
  } catch (error) {
    console.error("Failed to update user profile via /me endpoint", error);
    throw error;
  }
};



export const getAllEmployees = async () => {
  try {
    const response = await axiosInstance.get("/user/admin/all");
    return response.data?.users || [];
  } catch (error) {
    console.error("Failed to fetch employee list from /user/admin/all", error);
    throw error;
  }
};



// Delete users
export const deleteUserApi = async (id: number | string) => {
  try {
    await axiosInstance.patch(`/user/admin/${id}`);
  } catch (error) {
    throw new Error("Failed to delete user");
  }
};

