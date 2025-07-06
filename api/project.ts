
import axiosInstance from "./axios";
import { Project } from '@/types/project';

export const createProject = async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
  const payload = {
    ...project,
    assignedEmployees: undefined,
  };

  const { data } = await axiosInstance.post('/project/create', payload);
  return data;
};

