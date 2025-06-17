import axiosInstance from "./axios";


export const getAllRoles = async () => {
    const res = await axiosInstance.get("/role/all");
    return res.data.data;
  };