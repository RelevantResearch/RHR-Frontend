import axios from "./axios";

interface CreateProjectPayload {
    name: string;
    budget: string;
    client: string;
    deadline: string;
}

interface ProjectFromDB {
    client: string;
    id: string;
    name: string;
    description: string;
    clientName: string;
    budget: number;
    department: string;
    startDate: string;
    deadline: string;  // backend field, corresponds to frontend endDate
    status: 'active' | 'archived';
    assignedEmployees: string[];
  }
  

//Create a new project 
export const createProject = async (data: CreateProjectPayload) => {
    try {
        const response = await axios.post('/project/create', data);
        return response.data;
    } catch (error: any) {
        console.error("API createProject error:", error);
        throw new Error(error?.response?.data?.message || "Failed to create project");
    }
};



// Fetch all projects from the backend
export const getAllProjects = async (): Promise<ProjectFromDB[]> => {
    try {
      const response = await axios.get("/project/all");
      return response.data.data;
    } catch (error: any) {
      console.error("API getAllProjects error:", error);
      throw new Error(error?.response?.data?.message || "Failed to fetch projects");
    }
  };