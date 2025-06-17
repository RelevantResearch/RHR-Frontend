import axiosInstance from "./axios";

export const getMyInfo = async () => {
  try {
    const response = await axiosInstance.get("/user/me");
    // Return the nested user object
    return response.data.user;
  } catch (error) {
    console.error("Failed to fetch my info", error);
    return null;
  }
};

interface CreateUserParams {
  name: string;
  email: string;
  password: string;
  phone: string;
  roleId: number;         
  fullTimer: boolean;
  address: string;
  document?: string;
  salary?: number;
}


//create user api
export const createUserApi = async (data: CreateUserParams) => {
  try {
    const response = await axiosInstance.post('/user/admin/create', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to create user');
  }
};

export const updateUserProfile = async (payload: any) => {
  try {
    const response = await axiosInstance.put("/user/me", payload);
    return response.data;
  } catch (error) {
    console.error("Failed to update user profile via /me endpoint", error);
    throw error;
  }
};


// Fetch all users (admin only)
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
    await axiosInstance.delete(`/user/admin/${id}`);
  } catch (error) {
    throw new Error("Failed to delete user");
  }
};
