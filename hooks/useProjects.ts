"use client";
import { useEffect, useState } from 'react';
import { Project } from '@/types/project';
import { createProject as apiCreateProject } from '@/api/project';
import { toast } from 'sonner';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);


  const createProject = async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newProject = await apiCreateProject(project);
      setProjects(prev => [...prev, newProject]);
      toast.success("Project created successfully");
    } catch (error) {
      toast.error("Error creating project");
    }
  };

  return {
    projects,
    loading,
    createProject,
  };
};
