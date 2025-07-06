'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from '@/components/ui/data-table';
import { DataFilters, FilterGroup } from '@/components/ui/data-filters';
import { ActionButtons, commonActions, ActionButton } from '@/components/ui/action-buttons';
import { PageHeader } from '@/components/ui/page-header';
import { useTableState, useFilteredData } from '@/hooks/use-table-state';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, FolderKanban, Calendar, DollarSign, Users, Eye, Edit, Archive, Mail, Phone, Building2, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { BreadcrumbNavigation } from '@/components/ui/breadcrumbs-navigation';
import CustomSelect from '@/components/CustomSelect';
import { useDepartments } from '@/hooks/useDepartments';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar?: string;
}

interface Project {
  id: string;
  name: string;
  clientName: string;
  description: string;
  department: string;
  budget: number;
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled' | 'archived';
  startDate: string;
  endDate?: string;
  deadline: string;
  assignedTeamMembers: TeamMember[];
  progress: number;
}

const sampleProjects: Project[] = [
  {
    id: '1',
    name: 'E-commerce Platform Redesign',
    clientName: 'TechCorp Solutions',
    description: 'Complete redesign of the e-commerce platform with modern UI/UX and improved performance. This project involves updating the entire frontend architecture, implementing new design systems, and optimizing backend performance for better user experience.',
    department: 'Web Development',
    budget: 75000,
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    deadline: '2024-06-30',
    assignedTeamMembers: [
      { 
        id: '1', 
        name: 'John Smith', 
        role: 'Project Lead', 
        email: 'john.smith@company.com',
        phone: '+1 (555) 123-4567',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256&h=256&fit=crop&crop=faces' 
      },
      { 
        id: '2', 
        name: 'Jane Doe', 
        role: 'Frontend Developer', 
        email: 'jane.doe@company.com',
        phone: '+1 (555) 234-5678',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=256&h=256&fit=crop&crop=faces' 
      },
      { 
        id: '3', 
        name: 'Mike Johnson', 
        role: 'Backend Developer', 
        email: 'mike.johnson@company.com',
        phone: '+1 (555) 345-6789',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&h=256&fit=crop&crop=faces' 
      },
    ],
    progress: 65,
  },
  {
    id: '2',
    name: 'Data Analytics Dashboard',
    clientName: 'Analytics Inc',
    description: 'Development of a comprehensive data analytics dashboard for business intelligence. Features include real-time data visualization, custom reporting tools, and advanced analytics capabilities.',
    department: 'Data Analysis',
    budget: 45000,
    status: 'planning',
    startDate: '2024-03-01',
    deadline: '2024-08-15',
    assignedTeamMembers: [
      { 
        id: '4', 
        name: 'Sarah Wilson', 
        role: 'Data Scientist', 
        email: 'sarah.wilson@company.com',
        phone: '+1 (555) 456-7890',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=256&h=256&fit=crop&crop=faces' 
      },
      { 
        id: '5', 
        name: 'David Brown', 
        role: 'Data Analyst', 
        email: 'david.brown@company.com',
        phone: '+1 (555) 567-8901',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&h=256&fit=crop&crop=faces' 
      },
    ],
    progress: 25,
  },
  {
    id: '3',
    name: 'Community Outreach Program',
    clientName: 'Local Government',
    description: 'Digital platform for community engagement and public service delivery. Includes citizen portal, service request management, and community feedback systems.',
    department: 'Public Impact',
    budget: 30000,
    status: 'completed',
    startDate: '2023-09-01',
    endDate: '2024-02-28',
    deadline: '2024-02-28',
    assignedTeamMembers: [
      { 
        id: '6', 
        name: 'Emily Davis', 
        role: 'Program Manager', 
        email: 'emily.davis@company.com',
        phone: '+1 (555) 678-9012',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=256&h=256&fit=crop&crop=faces' 
      },
      { 
        id: '7', 
        name: 'Alex Chen', 
        role: 'Community Coordinator', 
        email: 'alex.chen@company.com',
        phone: '+1 (555) 789-0123',
        avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=256&h=256&fit=crop&crop=faces' 
      },
    ],
    progress: 100,
  },
  {
    id: '4',
    name: 'Mobile App Development',
    clientName: 'StartupXYZ',
    description: 'Cross-platform mobile application for task management and productivity. Features include task scheduling, team collaboration, and progress tracking.',
    department: 'Web Development',
    budget: 60000,
    status: 'on-hold',
    startDate: '2024-02-01',
    deadline: '2024-09-30',
    assignedTeamMembers: [
      { 
        id: '8', 
        name: 'Tom Anderson', 
        role: 'Mobile Developer', 
        email: 'tom.anderson@company.com',
        phone: '+1 (555) 890-1234',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256&h=256&fit=crop&crop=faces' 
      },
    ],
    progress: 40,
  },
];

const statuses = ['planning', 'active', 'on-hold', 'completed', 'cancelled', 'archived'];

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>(sampleProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const { departments, loading: loadingDepartments } = useDepartments()
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  
  const {
    state,
    setCurrentPage,
    setSearchTerm,
    setFilter,
    clearFilters,
    setSort,
  } = useTableState({
    initialPageSize: 10,
    initialFilters: { department: 'all', status: 'all' },
  });


  const filteredProject = projects.filter(project => {
    const matchesDepartment =
      selectedDepartment === 'all' || project.department === selectedDepartment;

    return matchesDepartment;
  })

  // Filter configuration
  const filterGroups: FilterGroup[] = [
    {
      key: 'status',
      label: 'Status',
      options: statuses.map(status => ({
        key: status,
        label: status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' '),
        value: status,
      })),
    },
  ];

  // Custom filter function
  const customFilter = (project: Project, filters: Record<string, string | string[]>) => {
    const { department, status } = filters;
    
    if (department && department !== 'all' && project.department !== department) {
      return false;
    }
    
    if (status && status !== 'all' && project.status !== status) {
      return false;
    }
    
    return true;
  };

  // Get filtered data
  const filteredProjects = useFilteredData(
    projects,
    state,
    ['name', 'clientName', 'description', 'department'],
    customFilter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'planning':
        return 'bg-blue-100 text-blue-800';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewProject = (project: Project) => {
    setSelectedProject(project);
    setShowViewDialog(true);
  };

  

  const handleManageProject = (id: string) => {
    router.push('/projects/edit');
  };

  const handleArchiveProject = (id: string) => {
    setProjects(prev => prev.map(project => 
      project.id === id ? { ...project, status: 'archived' as const } : project
    ));
    toast.success('Project archived successfully');
  };

  // Table columns configuration
  const columns: Column<Project>[] = [
    {
      key: 'name',
      header: 'Project Name',
      className: 'min-w-[200px]',
      sortable: true,
      render: (project) => (
        <div className="space-y-1">
          <div className="font-medium text-sm md:text-base truncate">{project.name}</div>
          <div className="text-xs md:text-sm text-gray-500 truncate">{project.clientName}</div>
          {/* Show department on mobile */}
          <div className="md:hidden text-xs text-gray-500">{project.department}</div>
        </div>
      ),
    },
    {
      key: 'department',
      header: 'Department',
      responsive: 'md',
      sortable: true,
      render: (project) => (
        <span className="text-sm">{project.department}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      responsive: 'sm',
      render: (project) => (
        <Badge className={`${getStatusColor(project.status)} text-xs`}>
          {project.status.charAt(0).toUpperCase() + project.status.slice(1).replace('-', ' ')}
        </Badge>
      ),
    },
    {
      key: 'budget',
      header: 'Budget',
      responsive: 'lg',
      sortable: true,
      render: (project) => (
        <span className="text-sm font-medium">${project.budget.toLocaleString()}</span>
      ),
    },
    {
      key: 'assignedTeamMembers',
      header: 'Team Size',
      responsive: 'md',
      render: (project) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-500" />
          <span className="font-medium text-sm">{project.assignedTeamMembers.length}</span>
          <span className="text-xs text-gray-500 hidden lg:inline">
            {project.assignedTeamMembers.length === 1 ? 'member' : 'members'}
          </span>
        </div>
      ),
    },
    {
      key: 'deadline',
      header: 'Deadline',
      responsive: 'lg',
      sortable: true,
      render: (project) => (
        <span className="text-sm">{format(new Date(project.deadline), 'MMM dd, yyyy')}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (project) => {
        const actions: ActionButton[] = [
          {
            label: 'View',
            onClick: () => handleViewProject(project),
            icon: Eye,
            variant: 'ghost',
          },
          {
            label: 'Manage',
            onClick: () => handleManageProject(project.id),
            icon: Edit,
            variant: 'ghost',
          },
          {
            label: 'Archive',
            onClick: () => {},
            icon: Archive,
            variant: 'ghost',
            className: 'text-orange-600 hover:text-orange-700',
            renderCustom: () => (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-orange-600 hover:text-orange-700">
                    <Archive className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-md mx-4">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Archive Project</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to archive "{project.name}"? This will move the project to archived status and it won't appear in active project lists.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-orange-500 hover:bg-orange-600"
                      onClick={() => handleArchiveProject(project.id)}
                    >
                      Archive Project
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ),
          },
        ];

        return <ActionButtons actions={actions} />;
      },
    },
  ];

  const handleAddProject = () => {
    router.push('/projects/add');
  };

  // Calculate statistics
  const totalProjects = projects.filter(p => p.status !== 'archived').length;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const totalBudget = projects.filter(p => p.status !== 'archived').reduce((sum, p) => sum + p.budget, 0);
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  
  const departmentFilter = [
    { label: "All Departments", value: "all" },
    ...departments.map(dept => ({
      label: dept.name,
      value: dept.name,
    })),
  ];

  return (
    <div className="space-y-4">
      <BreadcrumbNavigation/>

      {/* Statistics Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{totalProjects}</div>
            <p className="text-xs text-muted-foreground">Active projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{activeProjects}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold">${totalBudget.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{completedProjects}</div>
            <p className="text-xs text-muted-foreground">Delivered</p>
          </CardContent>
        </Card>
      </div>

      
      {/* Filters with Add Project Button */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="flex-1">
            <DataFilters
              searchValue={state.searchTerm}
              onSearchChange={setSearchTerm}
              searchPlaceholder="Search projects..."
              filterGroups={filterGroups}
              activeFilters={state.filters}
              onFilterChange={setFilter}
              onClearFilters={clearFilters}
            />
           
          </div>
          <CustomSelect
                options={departmentFilter}
                value={selectedDepartment}
                onValueChange={setSelectedDepartment}
                placeholder="All Department"
                className="w-full sm:w-[200px]"
              />
          <Button 
            onClick={handleAddProject}
            className="w-full sm:w-auto shrink-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>
      </div>

      {/* Data Table with Mobile Optimization */}
      <div className="bg-white rounded-lg border">
        <div className="overflow-hidden">
          <DataTable
            data={filteredProjects}
            columns={columns}
            currentPage={state.currentPage}
            pageSize={state.pageSize}
            onPageChange={setCurrentPage}
            onSort={setSort}
            sortKey={state.sortKey}
            sortDirection={state.sortDirection}
            emptyMessage="No projects found"
          />
        </div>
      </div>

      {/* Project View Dialog - Now Fully Responsive */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="w-[95vw] max-w-6xl max-h-[95vh] overflow-y-auto p-4 md:p-6">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-lg md:text-xl">Project Details</DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-6">
              {/* Project Overview */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold break-words">{selectedProject.name}</h3>
                    <p className="text-muted-foreground break-words">{selectedProject.clientName}</p>
                    <Badge className={`mt-2 ${getStatusColor(selectedProject.status)}`}>
                      {selectedProject.status.charAt(0).toUpperCase() + selectedProject.status.slice(1).replace('-', ' ')}
                    </Badge>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Project Description</h4>
                    <p className="text-sm text-muted-foreground break-words">{selectedProject.description}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Department:</span>
                      <p className="text-muted-foreground break-words">{selectedProject.department}</p>
                    </div>
                    <div>
                      <span className="font-medium">Budget:</span>
                      <p className="text-muted-foreground">${selectedProject.budget.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="font-medium">Start Date:</span>
                      <p className="text-muted-foreground">{format(new Date(selectedProject.startDate), 'PPP')}</p>
                    </div>
                    <div>
                      <span className="font-medium">Deadline:</span>
                      <p className="text-muted-foreground">{format(new Date(selectedProject.deadline), 'PPP')}</p>
                    </div>
                    {selectedProject.endDate && (
                      <div className="sm:col-span-2">
                        <span className="font-medium">End Date:</span>
                        <p className="text-muted-foreground">{format(new Date(selectedProject.endDate), 'PPP')}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Team Members */}
                <div className="space-y-4">
                  <h4 className="font-medium">Team Members ({selectedProject.assignedTeamMembers.length})</h4>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {selectedProject.assignedTeamMembers.map((member) => (
                      <div key={member.id} className="p-3 border rounded-lg">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10 shrink-0">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium break-words">{member.name}</div>
                            <div className="text-sm text-muted-foreground break-words">{member.role}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setShowViewDialog(false)} 
                  className="w-full sm:w-auto order-2 sm:order-1"
                >
                  Close
                </Button>
                <Button 
                  onClick={() => {
                    setShowViewDialog(false);
                    handleManageProject(selectedProject.id);
                  }} 
                  className="w-full sm:w-auto order-1 sm:order-2"
                >
                  Manage Project
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}