import axiosInstance from "./axios";


//fetch departments
export interface DepartmentFromAPI {
  id: string;
  name: string;
  description: string;
}

export async function fetchDepartments(): Promise<DepartmentFromAPI[]> {
  try {
    const res = await axiosInstance.get('/department/all');
    return res.data; 
  } catch (error: any) {
    console.error("Failed to fetch departments:", error.response?.data || error.message);
    throw new Error('Failed to fetch departments');
  }
}


// create department
export async function createDepartment(data: {
  name: string;
  description: string;
}) {
  try {
    const res = await axiosInstance.post('/department/create', data);
    return res.data;
    console.log(res.data)
  } catch (error: any) {
    console.error("Failed to create department:", error.response.data || error.message);
    throw new Error('Failed to create department');
  }
}


export async function deleteDepartment(id: string): Promise<void> {
  try {
    await axiosInstance.delete(`/department/${id}`);
  } catch (error: any) {
    console.error("Failed to delete department:", error.response?.data || error.message);
    throw new Error('Failed to delete department');
  }
}