"use client";

import { usePagination } from '@/hooks/usePagination';
import Pagination from '@/components/ui/pagination';
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, Users, Eye, Trash2, ChevronLeft, ChevronRight, Check, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { useAuth } from '@/lib/auth-context';
import { cn } from "@/lib/utils";

type ProjectStatus = 'ACTIVE' | 'PROCESSING' | 'CANCELLED' | 'COMPLETED' | 'ON_HOLD';

interface Project {
  id: string;
  name: string;
  description: string;
  clientName: string;
  budget: number;
  department: string;
  startDate: string;
  endDate: string;
  deadline: string;
  status: ProjectStatus;
  assignedEmployees: string[];
}

const demoProjects: Project[] = [

  {
    id: '1',
    name: 'E-commerce Platform Redesign',
    description: 'Complete overhaul of the existing e-commerce platform with modern UI/UX principles, improved performance, and enhanced security features.',
    clientName: 'TechRetail Solutions',
    budget: 85000,
    department: 'Web Development',
    startDate: '2024-03-01',
    endDate: '2024-08-31',
    deadline: '2024-08-31',
    status: 'ACTIVE',
    assignedEmployees: ['1', '2', '3']
  },
  {
    id: '2',
    name: 'E-commerce Platform Redesign',
    description: 'Complete overhaul of the existing e-commerce platform with modern UI/UX principles, improved performance, and enhanced security features.',
    clientName: 'TechRetail Solutions',
    budget: 85000,
    department: 'Web Development',
    startDate: '2024-03-01',
    endDate: '2024-08-31',
    deadline: '2024-08-31',
    status: 'ACTIVE',
    assignedEmployees: ['1', '2', '3']
  },

  {
    id: '3',
    name: 'E-commerce Platform Redesign',
    description: 'Complete overhaul of the existing e-commerce platform with modern UI/UX principles, improved performance, and enhanced security features.',
    clientName: 'TechRetail Solutions',
    budget: 85000,
    department: 'Web Development',
    startDate: '2024-03-01',
    endDate: '2024-08-31',
    deadline: '2024-08-31',
    status: 'ACTIVE',
    assignedEmployees: ['1', '2', '3']
  },

  {
    id: '4',
    name: 'E-commerce Platform Redesign',
    description: 'Complete overhaul of the existing e-commerce platform with modern UI/UX principles, improved performance, and enhanced security features.',
    clientName: 'TechRetail Solutions',
    budget: 85000,
    department: 'Web Development',
    startDate: '2024-03-01',
    endDate: '2024-08-31',
    deadline: '2024-08-31',
    status: 'ACTIVE',
    assignedEmployees: ['1', '2', '3']
  },

  {
    id: '5',
    name: 'E-commerce Platform Redesign',
    description: 'Complete overhaul of the existing e-commerce platform with modern UI/UX principles, improved performance, and enhanced security features.',
    clientName: 'TechRetail Solutions',
    budget: 85000,
    department: 'Web Development',
    startDate: '2024-03-01',
    endDate: '2024-08-31',
    deadline: '2024-08-31',
    status: 'ACTIVE',
    assignedEmployees: ['1', '2', '3']
  },

  {
    id: '6',
    name: 'E-commerce Platform Redesign',
    description: 'Complete overhaul of the existing e-commerce platform with modern UI/UX principles, improved performance, and enhanced security features.',
    clientName: 'TechRetail Solutions',
    budget: 85000,
    department: 'Web Development',
    startDate: '2024-03-01',
    endDate: '2024-08-31',
    deadline: '2024-08-31',
    status: 'ACTIVE',
    assignedEmployees: ['1', '2', '3']
  },

  {
    id: '7',
    name: 'E-commerce Platform Redesign',
    description: 'Complete overhaul of the existing e-commerce platform with modern UI/UX principles, improved performance, and enhanced security features.',
    clientName: 'TechRetail Solutions',
    budget: 85000,
    department: 'Web Development',
    startDate: '2024-03-01',
    endDate: '2024-08-31',
    deadline: '2024-08-31',
    status: 'ACTIVE',
    assignedEmployees: ['1', '2', '3']
  },

  {
    id: '8',
    name: 'E-commerce Platform Redesign',
    description: 'Complete overhaul of the existing e-commerce platform with modern UI/UX principles, improved performance, and enhanced security features.',
    clientName: 'TechRetail Solutions',
    budget: 85000,
    department: 'Web Development',
    startDate: '2024-03-01',
    endDate: '2024-08-31',
    deadline: '2024-08-31',
    status: 'ACTIVE',
    assignedEmployees: ['1', '2', '3']
  },

  {
    id: '9',
    name: 'E-commerce Platform Redesign',
    description: 'Complete overhaul of the existing e-commerce platform with modern UI/UX principles, improved performance, and enhanced security features.',
    clientName: 'TechRetail Solutions',
    budget: 85000,
    department: 'Web Development',
    startDate: '2024-03-01',
    endDate: '2024-08-31',
    deadline: '2024-08-31',
    status: 'ACTIVE',
    assignedEmployees: ['1', '2', '3']
  },

  {
    id: '10',
    name: 'E-commerce Platform Redesign',
    description: 'Complete overhaul of the existing e-commerce platform with modern UI/UX principles, improved performance, and enhanced security features.',
    clientName: 'TechRetail Solutions',
    budget: 85000,
    department: 'Web Development',
    startDate: '2024-03-01',
    endDate: '2024-08-31',
    deadline: '2024-08-31',
    status: 'ACTIVE',
    assignedEmployees: ['1', '2', '3']
  },

  {
    id: '11',
    name: 'E-commerce Platform Redesign',
    description: 'Complete overhaul of the existing e-commerce platform with modern UI/UX principles, improved performance, and enhanced security features.',
    clientName: 'TechRetail Solutions',
    budget: 85000,
    department: 'Web Development',
    startDate: '2024-03-01',
    endDate: '2024-08-31',
    deadline: '2024-08-31',
    status: 'ACTIVE',
    assignedEmployees: ['1', '2', '3']
  },
];

const departments = ['Web Development', 'Data Analysis', 'Public Impact'];

const projectStatuses: { value: ProjectStatus; label: string; color: string }[] = [
  { value: 'ACTIVE', label: 'Active', color: 'bg-green-100 text-green-800' },
  { value: 'PROCESSING', label: 'Processing', color: 'bg-blue-100 text-blue-800' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  { value: 'COMPLETED', label: 'Completed', color: 'bg-purple-100 text-purple-800' },
  { value: 'ON_HOLD', label: 'On Hold', color: 'bg-yellow-100 text-yellow-800' },
];

const mockEmployees = [
  { id: '1', name: 'Bishal Timsina', department: 'Web Development', role: 'Senior Developer' }
];

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>(demoProjects);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    clientName: '',
    budget: '',
    department: 'Web Development',
    startDate: '',
    endDate: '',
    deadline: '',
    status: 'ACTIVE' as ProjectStatus,
    assignedEmployees: [] as string[],
  });
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editForm, setEditForm] = useState({
    budget: '',
    department: '',
    deadline: '',
    endDate: '',
    status: 'ACTIVE' as ProjectStatus,
    assignedEmployees: [] as string[],
  });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [employeePopoverOpen, setEmployeePopoverOpen] = useState(false);
  const [editEmployeeSearch, setEditEmployeeSearch] = useState('');
  const [editEmployeePopoverOpen, setEditEmployeePopoverOpen] = useState(false);
  const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState<string | null>(null);
  const [editSelectedDepartmentFilter, setEditSelectedDepartmentFilter] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const filteredEmployees = mockEmployees
    .filter(emp =>
      (!selectedDepartmentFilter || emp.department === selectedDepartmentFilter) &&
      (emp.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
        emp.role.toLowerCase().includes(employeeSearch.toLowerCase()))
    );

  const editFilteredEmployees = mockEmployees
    .filter(emp =>
      (!editSelectedDepartmentFilter || emp.department === editSelectedDepartmentFilter) &&
      (emp.name.toLowerCase().includes(editEmployeeSearch.toLowerCase()) ||
        emp.role.toLowerCase().includes(editEmployeeSearch.toLowerCase()))
    );

  const handleAddProject = () => {
    if (!newProject.name || !newProject.description || !newProject.clientName || !newProject.budget || !newProject.startDate || !newProject.endDate || !newProject.deadline) {
      toast.error('Please fill in all required fields');
      return;
    }

    const project: Project = {
      id: Date.now().toString(),
      ...newProject,
      budget: parseFloat(newProject.budget),
    };

    setProjects([...projects, project]);
    setNewProject({
      name: '',
      description: '',
      clientName: '',
      budget: '',
      department: 'Web Development',
      startDate: '',
      endDate: '',
      deadline: '',
      status: 'ACTIVE',
      assignedEmployees: [],
    });
    setShowAddDialog(false);
    toast.success('Project added successfully');
  };

  const handleEditProject = () => {
    if (!editingProject || !editForm.budget || !editForm.deadline || !editForm.endDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const updatedProjects = projects.map(project =>
      project.id === editingProject.id
        ? {
          ...project,
          budget: parseFloat(editForm.budget),
          department: editForm.department,
          deadline: editForm.deadline,
          endDate: editForm.endDate,
          status: editForm.status,
          assignedEmployees: editForm.assignedEmployees,
        }
        : project
    );

    setProjects(updatedProjects);
    setEditingProject(null);
    setShowEditDialog(false);
    toast.success('Project updated successfully');
  };

  const openEditDialog = (project: Project) => {
    setEditingProject(project);
    setEditForm({
      budget: project.budget.toString(),
      department: project.department,
      deadline: project.deadline,
      endDate: project.endDate,
      status: project.status,
      assignedEmployees: [...project.assignedEmployees],
    });
    setEditSelectedDepartmentFilter(project.department);
    setShowEditDialog(true);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
    toast.success('Project deleted successfully');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: ProjectStatus) => {
    const statusConfig = projectStatuses.find(s => s.value === status);
    return statusConfig?.color || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: ProjectStatus) => {
    const statusConfig = projectStatuses.find(s => s.value === status);
    return statusConfig?.label || status;
  };

  const filteredProjects = projects.filter(project => {
    const matchesDepartment = departmentFilter === 'all' || project.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDepartment && matchesStatus && matchesSearch;
  });


  const projectsPerPage = 10;
  const { paginated: currentProjects, totalPages, startIndex } = usePagination(
    filteredProjects,
    currentPage,
    projectsPerPage
  );

  const endIndex = startIndex + currentProjects.length;


  // Reset to first page when filters change
  const handleFilterChange = (filterType: string, value: string) => {
    setCurrentPage(1);
    if (filterType === 'department') {
      setDepartmentFilter(value);
    } else if (filterType === 'status') {
      setStatusFilter(value);
    } else if (filterType === 'search') {
      setSearchTerm(value);
    }
  };


  return (
    <div className="container">
      <div className="flex items-center gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Projects</h1>
        </div>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-2 md:grid-cols-4 mb-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm md:text-base">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl md:text-4xl font-bold">
              {projects.filter(p => p.status === 'ACTIVE').length}
            </p>
            <p className="text-xs md:text-sm text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm md:text-base">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl md:text-4xl font-bold">
              {projects.filter(p => p.status === 'COMPLETED').length}
            </p>
            <p className="text-xs md:text-sm text-muted-foreground">Successfully completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm md:text-base">Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl md:text-4xl font-bold">
              {projects.filter(p => p.status === 'PROCESSING').length}
            </p>
            <p className="text-xs md:text-sm text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm md:text-base">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl md:text-4xl font-bold">
              ${projects.reduce((sum, p) => sum + p.budget, 0).toLocaleString()}
            </p>
            <p className="text-xs md:text-sm text-muted-foreground">Across all projects</p>
          </CardContent>
        </Card>
      </div>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6 pt-4">
          <div className="mt-6 md:mt-8 flex flex-col gap-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex flex-col sm:flex-row gap-2 md:gap-4 flex-1 w-full">
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full sm:max-w-xs"
                />
                <div className="flex gap-2 w-full sm:w-auto">
                  <Select value={departmentFilter} onValueChange={(value) => handleFilterChange('department', value)}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {user?.role?.name === 'Admin' && (
                    <Select value={statusFilter} onValueChange={(value) => handleFilterChange('status', value)}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        {projectStatuses.map(status => (
                          <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
              {user?.role?.name === 'Admin' && (
                <Button onClick={() => setShowAddDialog(true)} className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Project
                </Button>
              )}
            </div>
          </div>

          {/* Add Project Dialog */}
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogContent className="w-[95vw] max-w-4xl h-[90vh] max-h-[90vh] overflow-y-auto p-4 md:p-6">
              <DialogHeader>
                <DialogTitle className="text-lg md:text-xl">Add New Project</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 md:space-y-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Project Name</label>
                    <Input
                      placeholder="Enter project name"
                      value={newProject.name}
                      onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Client Name</label>
                    <Input
                      placeholder="Enter client name"
                      value={newProject.clientName}
                      onChange={(e) => setNewProject({ ...newProject, clientName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Project Description</label>
                  <Textarea
                    placeholder="Enter detailed project description"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="min-h-[80px] md:min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Department</label>
                    <Select
                      value={newProject.department}
                      onValueChange={(value) => {
                        setNewProject({
                          ...newProject,
                          department: value,
                          assignedEmployees: []
                        });
                        setSelectedDepartmentFilter(value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Budget</label>
                    <Input
                      type="number"
                      placeholder="Enter project budget"
                      value={newProject.budget}
                      onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select
                      value={newProject.status}
                      onValueChange={(value: ProjectStatus) => setNewProject({ ...newProject, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectStatuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Start Date</label>
                    <Input
                      type="date"
                      value={newProject.startDate}
                      onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">End Date</label>
                    <Input
                      type="date"
                      value={newProject.endDate}
                      onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Deadline</label>
                    <Input
                      type="date"
                      value={newProject.deadline}
                      onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Assign Team Members</label>
                    <span className="text-sm text-muted-foreground">
                      {newProject.assignedEmployees.length} selected
                    </span>
                  </div>
                  <Popover open={employeePopoverOpen} onOpenChange={setEmployeePopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        Select team members
                        <Users className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput
                          placeholder="Search employees..."
                          value={employeeSearch}
                          onValueChange={setEmployeeSearch}
                        />
                        <CommandList>
                          <CommandEmpty>No employees found.</CommandEmpty>
                          <CommandGroup>
                            <div className="p-2">
                              <Select
                                value={selectedDepartmentFilter || "all"}
                                onValueChange={(value) => setSelectedDepartmentFilter(value === "all" ? null : value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Filter by department" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">All Departments</SelectItem>
                                  {departments.map((dept) => (
                                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <CommandSeparator />
                            {filteredEmployees.map((employee) => (
                              <CommandItem
                                key={employee.id}
                                onSelect={() => {
                                  setNewProject(prev => ({
                                    ...prev,
                                    assignedEmployees: prev.assignedEmployees.includes(employee.id)
                                      ? prev.assignedEmployees.filter(id => id !== employee.id)
                                      : [...prev.assignedEmployees, employee.id]
                                  }));
                                }}
                              >
                                <div className="flex items-center justify-between w-full">
                                  <div>
                                    <p className="font-medium">{employee.name}</p>
                                    <p className="text-sm text-muted-foreground">{employee.role}</p>
                                  </div>
                                  <div className={cn(
                                    "flex h-4 w-4 items-center justify-center rounded-sm border",
                                    newProject.assignedEmployees.includes(employee.id)
                                      ? "bg-primary border-primary"
                                      : "border-input"
                                  )}>
                                    {newProject.assignedEmployees.includes(employee.id) && (
                                      <Check className="h-3 w-3 text-primary-foreground" />
                                    )}
                                  </div>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {newProject.assignedEmployees.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {newProject.assignedEmployees.map(id => {
                        const employee = mockEmployees.find(emp => emp.id === id);
                        return employee && (
                          <div
                            key={employee.id}
                            className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                          >
                            <span>{employee.name}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 p-0 hover:bg-transparent"
                              onClick={() => setNewProject(prev => ({
                                ...prev,
                                assignedEmployees: prev.assignedEmployees.filter(empId => empId !== employee.id)
                              }))}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddDialog(false)}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddProject} className="w-full sm:w-auto">
                    Create Project
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Project Dialog */}
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="w-[95vw] max-w-2xl h-[90vh] max-h-[90vh] overflow-y-auto p-4 md:p-6">
              <DialogHeader>
                <DialogTitle className="text-lg md:text-xl">Edit Project</DialogTitle>
              </DialogHeader>
              {editingProject && (
                <div className="space-y-4 md:space-y-6 py-4">
                  {/* Read-only fields */}
                  <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground">Project Information (Read Only)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Project Name</label>
                        <Input value={editingProject.name} disabled />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Client Name</label>
                        <Input value={editingProject.clientName} disabled />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <Textarea value={editingProject.description} disabled className="min-h-[80px]" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Start Date</label>
                      <Input value={editingProject.startDate} disabled />
                    </div>
                  </div>

                  {/* Editable fields */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Editable Fields</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Budget</label>
                        <Input
                          type="number"
                          placeholder="Enter project budget"
                          value={editForm.budget}
                          onChange={(e) => setEditForm({ ...editForm, budget: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Department</label>
                        <Select
                          value={editForm.department}
                          onValueChange={(value) => {
                            setEditForm({ ...editForm, department: value });
                            setEditSelectedDepartmentFilter(value);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((dept) => (
                              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Deadline</label>
                        <Input
                          type="date"
                          value={editForm.deadline}
                          onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">End Date</label>
                        <Input
                          type="date"
                          value={editForm.endDate}
                          onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Status</label>
                        <Select
                          value={editForm.status}
                          onValueChange={(value: ProjectStatus) => setEditForm({ ...editForm, status: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {projectStatuses.map((status) => (
                              <SelectItem key={status.value} value={status.value}>
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">Team Members</label>
                        <span className="text-sm text-muted-foreground">
                          {editForm.assignedEmployees.length} selected
                        </span>
                      </div>
                      <Popover open={editEmployeePopoverOpen} onOpenChange={setEditEmployeePopoverOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                          >
                            Select team members
                            <Users className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                          <Command>
                            <CommandInput
                              placeholder="Search employees..."
                              value={editEmployeeSearch}
                              onValueChange={setEditEmployeeSearch}
                            />
                            <CommandList>
                              <CommandEmpty>No employees found.</CommandEmpty>
                              <CommandGroup>
                                <div className="p-2">
                                  <Select
                                    value={editSelectedDepartmentFilter || "all"}
                                    onValueChange={(value) => setEditSelectedDepartmentFilter(value === "all" ? null : value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Filter by department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="all">All Departments</SelectItem>
                                      {departments.map((dept) => (
                                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <CommandSeparator />
                                {editFilteredEmployees.map((employee) => (
                                  <CommandItem
                                    key={employee.id}
                                    onSelect={() => {
                                      setEditForm(prev => ({
                                        ...prev,
                                        assignedEmployees: prev.assignedEmployees.includes(employee.id)
                                          ? prev.assignedEmployees.filter(id => id !== employee.id)
                                          : [...prev.assignedEmployees, employee.id]
                                      }));
                                    }}
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      <div>
                                        <p className="font-medium">{employee.name}</p>
                                        <p className="text-sm text-muted-foreground">{employee.role}</p>
                                      </div>
                                      <div className={cn(
                                        "flex h-4 w-4 items-center justify-center rounded-sm border",
                                        editForm.assignedEmployees.includes(employee.id)
                                          ? "bg-primary border-primary"
                                          : "border-input"
                                      )}>
                                        {editForm.assignedEmployees.includes(employee.id) && (
                                          <Check className="h-3 w-3 text-primary-foreground" />
                                        )}
                                      </div>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      {editForm.assignedEmployees.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {editForm.assignedEmployees.map(id => {
                            const employee = mockEmployees.find(emp => emp.id === id);
                            return employee && (
                              <div
                                key={employee.id}
                                className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                              >
                                <span>{employee.name}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-4 w-4 p-0 hover:bg-transparent"
                                  onClick={() => setEditForm(prev => ({
                                    ...prev,
                                    assignedEmployees: prev.assignedEmployees.filter(empId => empId !== employee.id)
                                  }))}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowEditDialog(false)}
                      className="w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleEditProject} className="w-full sm:w-auto">
                      Update Project
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          <div className="mt-6">
            {/* Mobile Card View */}
            <div className="block md:hidden space-y-4">
              {currentProjects.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8 text-muted-foreground">
                    No projects found
                  </CardContent>
                </Card>
              ) : (
                currentProjects.map((project) => (
                  <Card key={project.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{project.name}</h3>
                          <p className="text-sm text-muted-foreground">{project.clientName}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(project.status)}`}>
                          {getStatusLabel(project.status)}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Department:</span>
                          <span>{project.department}</span>
                        </div>
                        {user?.role?.name === 'Admin' && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Budget:</span>
                            <span>${project.budget.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Deadline:</span>
                          <span>{formatDate(project.deadline)}</span>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="w-[95vw] max-w-2xl h-[90vh] max-h-[90vh] overflow-y-auto">
                            <DialogTitle>{project.name}</DialogTitle>
                            <div className="space-y-4">
                              <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                                <p className="text-sm">{project.description}</p>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">Client</p>
                                  <p className="font-medium">{project.clientName}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Budget</p>
                                  <p className="font-medium">${project.budget.toLocaleString()}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Department</p>
                                  <p className="font-medium">{project.department}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Status</p>
                                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(project.status)}`}>
                                    {getStatusLabel(project.status)}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Start Date</p>
                                  <p className="font-medium">{formatDate(project.startDate)}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">End Date</p>
                                  <p className="font-medium">{formatDate(project.endDate)}</p>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Deadline</p>
                                <p className="font-medium">{formatDate(project.deadline)}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Team Members</p>
                                <p className="font-medium">
                                  {mockEmployees
                                    .filter(emp => project.assignedEmployees.includes(emp.id))
                                    .map(emp => emp.name)
                                    .join(', ')}
                                </p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        {user?.role?.name === 'Admin' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(project)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteProject(project.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">Project Name</TableHead>
                    <TableHead>Client</TableHead>
                    {user?.role?.name === 'Admin' && <TableHead>Budget</TableHead>}
                    <TableHead>Department</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentProjects.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={user?.role?.name === 'Admin' ? 7 : 6} className="text-center text-muted-foreground h-24">
                        No projects found
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentProjects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">{project.name}</TableCell>
                        <TableCell>{project.clientName}</TableCell>
                        {user?.role?.name === 'Admin' && (
                          <TableCell>${project.budget.toLocaleString()}</TableCell>
                        )}
                        <TableCell>{project.department}</TableCell>
                        <TableCell>{formatDate(project.deadline)}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(project.status)}`}>
                            {getStatusLabel(project.status)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="w-[600px] h-[500px] max-w-[90vw] max-h-[90vh] overflow-y-auto">
                                <DialogTitle>{project.name}</DialogTitle>
                                <div className="space-y-4">
                                  <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                                    <p className="text-sm">{project.description}</p>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm text-muted-foreground">Client</p>
                                      <p className="font-medium">{project.clientName}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Budget</p>
                                      <p className="font-medium">${project.budget.toLocaleString()}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Department</p>
                                      <p className="font-medium">{project.department}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Status</p>
                                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(project.status)}`}>
                                        {getStatusLabel(project.status)}
                                      </span>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Start Date</p>
                                      <p className="font-medium">{formatDate(project.startDate)}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">End Date</p>
                                      <p className="font-medium">{formatDate(project.endDate)}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Deadline</p>
                                    <p className="font-medium">{formatDate(project.deadline)}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Team Members</p>
                                    <p className="font-medium">
                                      {mockEmployees
                                        .filter(emp => project.assignedEmployees.includes(emp.id))
                                        .map(emp => emp.name)
                                        .join(', ')}
                                    </p>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            {user?.role?.name === 'Admin' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openEditDialog(project)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteProject(project.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalItems={filteredProjects.length}
              itemsPerPage={projectsPerPage}
              onPageChange={setCurrentPage}
              label="projects"
            />

          </div>
        </div>
      </div>
    </div>
  );
}