"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, Plus, Trash2, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import type { Department } from '@/types/department';



import { useDepartments } from "@/hooks/useDepartments";



export default function DepartmentsPage() {
  const { departments, loading, error, setDepartments, addDepartment, deleteDepartment } = useDepartments();
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null);

  // // State to track the department selected for deletion
  // const [departmentToDelete, setDepartmentToDelete] = useState<null | { id: string; name: string }>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);


  const [newDepartment, setNewDepartment] = useState<{
    name: string;
    description: string;
  }>({
    name: '',
    description: '',
  });

  const handleDeleteClick = (dept: Department) => {
    setDepartmentToDelete(dept);
    setIsDeleteDialogOpen(true);
  };
  

  const confirmDelete = async () => {
    if (!departmentToDelete) return;

    try {
      await deleteDepartment(String(departmentToDelete.id));
      toast.success(`Department "${departmentToDelete.name}" deleted successfully`);
    } catch (error) {
      toast.error("Failed to delete department");
    }

    setIsDeleteDialogOpen(false);
    setDepartmentToDelete(null);
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDepartmentToDelete(null);
  };

  const handleAddDepartment = async () => {
    if (!newDepartment.name || !newDepartment.description) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await addDepartment(newDepartment.name, newDepartment.description);

      setNewDepartment({
        name: "",
        description: "",
      });

      toast.success("Department added successfully");
    } catch (error) {
      toast.error("Failed to create department");
    }
  };


  const handleDeleteDepartment = (id: number) => {
    setDepartments(departments.filter((dept) => dept.id !== id));
    toast.success("Department deleted successfully");
  };
  
  if (loading) return <p>Loading departments...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="container">
      <div className="flex items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{departments.length}</p>
            <p className="text-sm text-muted-foreground">Active departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Services Offered</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">3</p>
            <p className="text-sm text-muted-foreground">Core service areas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {departments.reduce((sum, dept) => sum + dept.employeeCount, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Across all departments</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Department List</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Department
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Department</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Department Name</label>
                <Input
                  placeholder="Enter department name"
                  value={newDepartment.name}
                  onChange={(e) =>
                    setNewDepartment({ ...newDepartment, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input
                  placeholder="Enter department description"
                  value={newDepartment.description}
                  onChange={(e) =>
                    setNewDepartment({
                      ...newDepartment,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <Button className="w-full" onClick={handleAddDepartment}>
                Add Department
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {departments.map((department) => (
          <Card key={department.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{department.name}</CardTitle>
                <div className="flex gap-2">
                  {/* <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button> */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteClick(department)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {department.description}
              </p>
              <div className="flex justify-between items-center text-sm">
                <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                  {department.name}
                </span>
                <span>{department.employeeCount} employees</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Do you want to delete the department "{departmentToDelete?.name}"?</p>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
