"use client";

import { useEffect, useState } from "react";
import { getAllProjects } from "@/api/project";
import { toast } from "sonner";

export interface Project {
  id: string;
  name: string;
  budget: number;
  clientName: string;
  endDate: string; // backend field
  description: string;
  department: string;
  startDate: string;
  status: "active" | "archived";
  assignedEmployees: string[];
}

export interface FrontendProject {
  id: string;
  name: string;
  budget: number;
  clientName: string;
  endDate: string; // frontend field
  description: string;
  department: string;
  startDate: string;
  status: "active" | "archived";
  assignedEmployees: string[];
}

export const useProjects = () => {
  const [projects, setProjects] = useState<FrontendProject[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const dbProjects = await getAllProjects();

      // 👇 Log full API response to debug
      console.log("Raw API response for projects:", dbProjects);

      const mappedProjects: FrontendProject[] = dbProjects.map((p, idx) => ({
        id: p.id || String(idx + 1),
        name: p.name,
        budget: Number(p.budget) || 0,
        clientName: p.clientName || p.client || '',
        description: p.description || "This is a placeholder project description.",
        department: p.department || "Web Development",
        startDate: p.startDate || "2025-01-01",
        endDate: p.deadline,
        status: p.status || "active",
        assignedEmployees: p.assignedEmployees || [],
      }));

      console.log("Mapped frontend projects:", mappedProjects); // 👈 Optional

      setProjects(mappedProjects);
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to load projects");
      console.error("Error while fetching and mapping projects:", err);
    } finally {
      setLoading(false);
    }
  };





  const archiveProject = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "archived" } : p))
    );
    toast.success("Project archived successfully");
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    toast.success("Project deleted successfully");
  };

  // Add project receives frontend project without id/status
  const addProject = (project: Omit<FrontendProject, "id" | "status">) => {
    // Map frontend project with endDate → backend with deadline
    const newProject: FrontendProject = {
      ...project,
      id: Date.now().toString(),
      status: "active",
    };

    setProjects((prev) => [...prev, newProject]);
    toast.success("Project added successfully");
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    error,
    refetch: fetchProjects,
    archiveProject,
    deleteProject,
    addProject,
  };
};