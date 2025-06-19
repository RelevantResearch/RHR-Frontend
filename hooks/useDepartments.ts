
import { useState, useEffect } from "react";
import { fetchDepartments, createDepartment as apiCreateDepartment, deleteDepartment as apiDeleteDepartment, DepartmentFromAPI } from "../api/department";

export interface Department extends DepartmentFromAPI {
  employeeCount: number;
}

export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDepartments();
      const deptsWithCount = data.map((dept) => ({
        ...dept,
        employeeCount: 3,
      }));
      setDepartments(deptsWithCount);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add Department from inside the hook
  const addDepartment = async (name: string, description: string) => {
    const created = await apiCreateDepartment({ name, description });

    const newDept: Department = {
      ...created,
      employeeCount: 3,
    };

    setDepartments((prev) => [...prev, newDept]);
  };

  const deleteDepartment = async (id: string) => {
    await apiDeleteDepartment(id);
    setDepartments((prev) => prev.filter((dept) => dept.id !== id));
  };

  return {
    departments,
    loading,
    error,
    setDepartments,
    addDepartment,
    deleteDepartment,
  };
}
