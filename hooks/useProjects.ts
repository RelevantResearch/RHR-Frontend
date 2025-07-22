// hooks/useProjects.ts
import { useQuery } from "@tanstack/react-query";
import { getAllProject, getProjectId } from "@/api/project";
import { Project } from "@/types/projects"; // your defined Project type

export const useProjects = () => {
  return useQuery<Project[], Error>({
    queryKey: ["projects"],
    queryFn: getAllProject,
    staleTime: 5 * 60 * 1000,
  });
};

export const useProjectById = (id: string | number | undefined) => {
  return useQuery<Project, Error>({
    queryKey: ['project', id],
    queryFn: () => getProjectId(id!),
    enabled: !!id, 
    staleTime: 5 * 60 * 1000,
  });
};