'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from '@/components/ui/data-table';
import { DataFilters, FilterGroup } from '@/components/ui/data-filters';
import { ActionButtons, ActionButton } from '@/components/ui/action-buttons';
import { useTableState, useFilteredData } from '@/hooks/use-table-state';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, FolderKanban, Calendar, DollarSign, Users, Eye, Edit, Archive, Loader2, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BreadcrumbNavigation } from '@/components/ui/breadcrumbs-navigation';
import CustomSelect from '@/components/CustomSelect';
import { useDepartments } from '@/hooks/useDepartments';
import { useProjects } from '@/hooks/useProjects';
import { Project } from '@/types/projects';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { deleteProject } from '@/api/project';

type ProjectStatus = 'PROCESSING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED' | 'ARCHIVED';

const statusDisplayMap: Record<ProjectStatus, { label: string; color: string }> = {
  'ACTIVE': { label: 'Active', color: 'bg-green-100 text-green-800' },
  'PROCESSING': { label: 'Processing', color: 'bg-blue-100 text-blue-800' },
  'ON_HOLD': { label: 'On Hold', color: 'bg-yellow-100 text-yellow-800' },
  'COMPLETED': { label: 'Completed', color: 'bg-purple-100 text-purple-800' },
  'CANCELLED': { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  'ARCHIVED': { label: 'Archived', color: 'bg-gray-100 text-gray-800' }
};

const statuses = Object.keys(statusDisplayMap) as ProjectStatus[];

export default function ProjectsPage() {
  const router = useRouter();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const { departments, loading: loadingDepartments } = useDepartments();
  const { data: apiProjects, isLoading: loadingProjects, error, refetch } = useProjects();
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | 'all'>('all');


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

  const projects = useMemo(() => {
    if (!apiProjects || !departments.length) return [];
    return apiProjects
      .filter(project => !project.isdeleted)
      .map(project => ({
        ...project,
        department: departments.find(dept => dept.id === project.departmentId)
      }));
  }, [apiProjects, departments]);

  const statusFilterOptions = [
    { label: 'All Status', value: 'all' },
    ...statuses.map(status => ({
      label: statusDisplayMap[status].label,
      value: status,
    })),
  ];


  const filterGroups: FilterGroup[] = [
    {
      key: 'status',
      label: 'Status',
      options: statuses.map(status => ({
        key: status,
        label: statusDisplayMap[status].label,
        value: status,
      })),
    },
  ];

  const customFilter = (project: Project) => {

    if (selectedDepartment && selectedDepartment !== 'all' && project.department?.name !== selectedDepartment) {
      return false;
    }

    if (selectedStatus !== 'all' && project.status !== selectedStatus) {
      return false;
    }


    return true;
  };

  const filteredProjects = useFilteredData(
    projects,
    state,
    ['name', 'client', 'description'],
    customFilter
  );

  const getStatusDisplay = (status: string) => {
    const statusKey = status as ProjectStatus;
    return statusDisplayMap[statusKey] || { label: status, color: 'bg-gray-100 text-gray-800' };
  };

  const handleManageProject = (id: string) => {
    router.push(`/projects/edit-projects?id=${id}`);
  };

  const handleViewProject = (project: Project) => {
    router.push(`/projects/view-projects?id=${project.id}`);
  };

  const handleArchiveProject = async (id: string) => {
    try {
      // await archiveProject(id);
      await deleteProject(id);
      toast.success('Project archived successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to archive project');
    }
  };

  const columns: Column<Project>[] = [
    {
      key: 'name',
      header: 'Project Name',
      className: 'min-w-[200px]',
      sortable: true,
      render: (project) => (
        <div className="space-y-1">
          <div className="font-medium text-sm md:text-base truncate">{project.name}</div>
          <div className="text-xs md:text-sm text-gray-500 truncate">{project.client}</div>
          {/* Show department on mobile */}
          <div className="md:hidden text-xs text-gray-500">{project.department?.name || 'Unknown'}</div>
        </div>
      ),
    },
    {
      key: 'department',
      header: 'Department',
      responsive: 'md',
      sortable: true,
      render: (project) => (
        <span className="text-sm">{project.department?.name || 'Unknown'}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      responsive: 'sm',
      render: (project) => {
        const statusDisplay = getStatusDisplay(project.status);
        return (
          <Badge className={`${statusDisplay.color} text-xs`}>
            {statusDisplay.label}
          </Badge>
        );
      },
    },
    {
      key: 'budget',
      header: 'Budget',
      responsive: 'lg',
      sortable: true,
      render: (project) => (
        <span className="text-sm font-medium">${parseInt(project.budget).toLocaleString()}</span>
      ),
    },
    {
      key: 'userAssignments',
      header: 'Team Size',
      responsive: 'md',
      render: (project) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-500" />
          <span className="font-medium text-sm">{project.userAssignments?.length || 0}</span>
          <span className="text-xs text-gray-500 hidden lg:inline">
            {(project.userAssignments?.length || 0) === 1 ? 'member' : 'members'}
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
            onClick: () => handleManageProject(project.id.toString()),
            icon: Edit,
            variant: 'ghost',
          },
          {
            label: 'Archive',
            onClick: () => { },
            icon: Archive,
            variant: 'ghost',
            className: 'text-orange-600 hover:text-orange-700',
            renderCustom: () => (
              <ConfirmDialog
                triggerButton={
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-orange-600 hover:text-orange-700">
                    <Archive className="h-4 w-4" />
                  </Button>
                }
                title="Archive Project"
                description={`Are you sure you want to archive "${project.name}"? This will move the project to archived status and it won't appear in active project lists.`}
                confirmText="Archive Project"
                cancelText="Cancel"
                confirmClassName="bg-orange-500 hover:bg-orange-600"
                onConfirm={() => handleArchiveProject(project.id.toString())}
              />
            ),
          },
        ];

        return <ActionButtons actions={actions} />;
      },
    },
  ];

  const handleAddProject = () => {
    router.push('/projects/add-projects');
  };

  // Calculate statistics
  const totalProjects = projects.filter(p => p.status !== 'ARCHIVED').length;
  const activeProjects = projects.filter(p => p.status === 'ACTIVE').length;
  const totalBudget = projects
    .filter(p => p.status !== 'ARCHIVED')
    .reduce((sum, p) => sum + parseInt(p.budget), 0);
  const completedProjects = projects.filter(p => p.status === 'COMPLETED').length;

  const departmentFilter = [
    { label: "All Departments", value: "all" },
    ...departments.map(dept => ({
      label: dept.name,
      value: dept.name,
    })),
  ];

  // Loading state
  const isLoading = loadingProjects || loadingDepartments;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <BreadcrumbNavigation />
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-lg">Loading projects...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-4">
        <BreadcrumbNavigation />
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <AlertTriangle className="h-12 w-12 text-red-500" />
          <div className="text-center">
            <h3 className="text-lg font-semibold text-red-600">Error loading projects</h3>
            <p className="text-gray-600 mt-1">
              {error.message || 'Something went wrong while fetching projects'}
            </p>
            <Button
              onClick={() => refetch()}
              variant="outline"
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <BreadcrumbNavigation />

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

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="flex-1">
            <DataFilters
              searchValue={state.searchTerm}
              onSearchChange={setSearchTerm}
              searchPlaceholder="Search projects..."
              onFilterChange={setFilter}
              onClearFilters={clearFilters}
            />
          </div>
          <CustomSelect
            options={statusFilterOptions}
            value={selectedStatus}
            onValueChange={(val) => setSelectedStatus(val as ProjectStatus | 'all')}
            placeholder="All Status"
            className="w-full sm:w-[200px]"
          />
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

      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="w-[95vw] max-w-6xl max-h-[95vh] overflow-y-auto p-4 md:p-6">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-lg md:text-xl">Project Details</DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold break-words">{selectedProject.name}</h3>
                    <p className="text-muted-foreground break-words">{selectedProject.client}</p>
                    <Badge className={`mt-2 ${getStatusDisplay(selectedProject.status).color}`}>
                      {getStatusDisplay(selectedProject.status).label}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Project Description</h4>
                    <p className="text-sm text-muted-foreground break-words">{selectedProject.description}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Department:</span>
                      <p className="text-muted-foreground break-words">{selectedProject.department?.name || 'Unknown'}</p>
                    </div>
                    <div>
                      <span className="font-medium">Budget:</span>
                      <p className="text-muted-foreground">${parseInt(selectedProject.budget).toLocaleString()}</p>
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

                <div className="space-y-4">
                  <h4 className="font-medium">Team Members ({selectedProject.userAssignments?.length || 0})</h4>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {selectedProject.userAssignments && selectedProject.userAssignments.length > 0 ? (
                      selectedProject.userAssignments.map((assignment) => (
                        <div key={assignment.id} className="p-3 border rounded-lg">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10 shrink-0">
                              <AvatarImage src={assignment.user.profilePic || undefined} alt={assignment.user.name} />
                              <AvatarFallback>{assignment.user.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium break-words">{assignment.user.name}</div>
                              <div className="text-sm text-muted-foreground break-words">{assignment.role}</div>
                              <div className="text-xs text-muted-foreground break-words">{assignment.user.email}</div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No team members assigned</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

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
                    handleManageProject(selectedProject.id.toString());
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