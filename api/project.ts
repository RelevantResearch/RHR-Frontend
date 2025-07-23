import axiosInstance from "./axios";
import { 
  Project, 
  ProjectPayload, 
  ProjectResponse 
} from '@/types/projects';

export const createProject = async (
  projectData: ProjectPayload
): Promise<Project> => {
  const response = await axiosInstance.post("/project/create", projectData);
  return response.data;
};

export const updateProject = async (
  id: number | string,
  projectData: ProjectPayload
): Promise<Project> => {
  const response = await axiosInstance.put(`/project/${id}`, projectData);
  return response.data;
};

export const getAllProject = async (): Promise<Project[]> => {
  const res = await axiosInstance.get("/project/");
  return res.data;
};

export const getProjectId = async (id: string | number): Promise<Project> => {
  const response = await axiosInstance.get(`/project/${id}`);
  return response.data;
};

export const deleteProject = async (id: number | string): Promise<ProjectResponse> => {
  const response = await axiosInstance.delete(`/project/delete/${id}`);
  return response.data;
};