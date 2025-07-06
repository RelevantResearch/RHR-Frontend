'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Plus, X, Users, Search, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from 'sonner';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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

interface TeamMember {
  id: string;
  name: string;
  email: string;
  department: string;
  avatar?: string;
}

interface AssignedMember extends TeamMember {
  projectRole: string;
}

interface Project {
  id: string;
  name: string;
  clientName: string;
  description: string;
  department: string;
  budget: number;
  status: string;
  startDate: string;
  endDate?: string;
  deadline: string;
  assignedTeamMembers: AssignedMember[];
}

const availableTeamMembers: TeamMember[] = [
  { id: '1', name: 'John Smith', email: 'john.smith@company.com', department: 'Web Development', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256&h=256&fit=crop&crop=faces' },
  { id: '2', name: 'Jane Doe', email: 'jane.doe@company.com', department: 'Web Development', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=256&h=256&fit=crop&crop=faces' },
  { id: '3', name: 'Mike Johnson', email: 'mike.johnson@company.com', department: 'Web Development', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&h=256&fit=crop&crop=faces' },
  { id: '4', name: 'Sarah Wilson', email: 'sarah.wilson@company.com', department: 'Data Analysis', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=256&h=256&fit=crop&crop=faces' },
  { id: '5', name: 'David Brown', email: 'david.brown@company.com', department: 'Data Analysis', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&h=256&fit=crop&crop=faces' },
  { id: '6', name: 'Emily Davis', email: 'emily.davis@company.com', department: 'Public Impact', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=256&h=256&fit=crop&crop=faces' },
  { id: '7', name: 'Alex Chen', email: 'alex.chen@company.com', department: 'Public Impact', avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=256&h=256&fit=crop&crop=faces' },
  { id: '8', name: 'Robert Taylor', email: 'robert.taylor@company.com', department: 'Web Development', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=256&h=256&fit=crop&crop=faces' },
  { id: '9', name: 'Lisa Anderson', email: 'lisa.anderson@company.com', department: 'Data Analysis', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=256&h=256&fit=crop&crop=faces' },
  { id: '10', name: 'Mark Wilson', email: 'mark.wilson@company.com', department: 'Public Impact', avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=256&h=256&fit=crop&crop=faces' },
];

const departments = ['Web Development', 'Data Analysis', 'Public Impact'];
const statuses = ['planning', 'active', 'on-hold', 'completed', 'cancelled'];

// Mock project data - in real app, this would come from API
const mockProjects: Record<string, Project> = {
  '1': {
    id: '1',
    name: 'E-commerce Platform Redesign',
    clientName: 'TechCorp Solutions',
    description: 'Complete redesign of the e-commerce platform with modern UI/UX and improved performance.',
    department: 'Web Development',
    budget: 75000,
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    deadline: '2024-06-30',
    assignedTeamMembers: [
      { id: '1', name: 'John Smith', email: 'john.smith@company.com', department: 'Web Development', projectRole: 'Project Lead', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256&h=256&fit=crop&crop=faces' },
      { id: '2', name: 'Jane Doe', email: 'jane.doe@company.com', department: 'Web Development', projectRole: 'Frontend Developer', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=256&h=256&fit=crop&crop=faces' },
      { id: '3', name: 'Mike Johnson', email: 'mike.johnson@company.com', department: 'Web Development', projectRole: 'Backend Developer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&h=256&fit=crop&crop=faces' },
    ],
  },
  '2': {
    id: '2',
    name: 'Data Analytics Dashboard',
    clientName: 'Analytics Inc',
    description: 'Development of a comprehensive data analytics dashboard for business intelligence.',
    department: 'Data Analysis',
    budget: 45000,
    status: 'planning',
    startDate: '2024-03-01',
    deadline: '2024-08-15',
    assignedTeamMembers: [
      { id: '4', name: 'Sarah Wilson', email: 'sarah.wilson@company.com', department: 'Data Analysis', projectRole: 'Data Scientist', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=256&h=256&fit=crop&crop=faces' },
      { id: '5', name: 'David Brown', email: 'david.brown@company.com', department: 'Data Analysis', projectRole: 'Data Analyst', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&h=256&fit=crop&crop=faces' },
    ],
  },
};

export default function EditProjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('id');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddMemberCard, setShowAddMemberCard] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [newMemberRole, setNewMemberRole] = useState('');
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Team member filtering states
  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState('all');
  
  // Add member filtering states
  const [addMemberDepartmentFilter, setAddMemberDepartmentFilter] = useState('all');
  
  const [formData, setFormData] = useState({
    department: '',
    budget: '',
    status: '',
    endDate: '',
    deadline: '',
  });

  const [assignedMembers, setAssignedMembers] = useState<AssignedMember[]>([]);

  useEffect(() => {
    // Simulate loading project data
    const loadProject = async () => {
      try {
        if (!projectId) {
          throw new Error('Project ID is required');
        }

        await new Promise(resolve => setTimeout(resolve, 500));
        
        const projectData = mockProjects[projectId];
        if (!projectData) {
          throw new Error('Project not found');
        }

        setProject(projectData);
        setFormData({
          department: projectData.department,
          budget: projectData.budget.toString(),
          status: projectData.status,
          endDate: projectData.endDate || '',
          deadline: projectData.deadline,
        });
        setAssignedMembers(projectData.assignedTeamMembers);
      } catch (error) {
        toast.error('Failed to load project');
        router.push('/projects');
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId, router]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMemberSelection = (memberId: string, checked: boolean) => {
    if (checked) {
      setSelectedMembers(prev => [...prev, memberId]);
    } else {
      setSelectedMembers(prev => prev.filter(id => id !== memberId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const availableIds = filteredAvailableMembers.map(member => member.id);
      setSelectedMembers(availableIds);
    } else {
      setSelectedMembers([]);
    }
  };

  const handleAddSelectedMembers = () => {
    if (selectedMembers.length === 0) {
      toast.error('Please select at least one team member');
      return;
    }

    if (!newMemberRole.trim()) {
      toast.error('Please enter a project role');
      return;
    }

    const membersToAdd = availableTeamMembers
      .filter(member => selectedMembers.includes(member.id))
      .map(member => ({
        ...member,
        projectRole: newMemberRole.trim(),
      }));

    setAssignedMembers(prev => [...prev, ...membersToAdd]);
    setSelectedMembers([]);
    setNewMemberRole('');
    setShowAddMemberCard(false);
    toast.success(`${membersToAdd.length} team member(s) added successfully`);
  };

  const handleRemoveTeamMember = (memberId: string) => {
    setAssignedMembers(prev => prev.filter(member => member.id !== memberId));
    toast.success('Team member removed');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.department || !formData.budget || !formData.deadline) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (assignedMembers.length === 0) {
      toast.error('Please assign at least one team member');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Project updated successfully');
      router.push('/projects');
    } catch (error) {
      toast.error('Failed to update project');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter assigned members (removed project role filter)
  const filteredAssignedMembers = assignedMembers.filter(member => {
    // Filter by search term
    if (memberSearchTerm && !member.name.toLowerCase().includes(memberSearchTerm.toLowerCase())) {
      return false;
    }

    // Filter by department
    if (selectedDepartmentFilter !== 'all' && member.department !== selectedDepartmentFilter) {
      return false;
    }

    return true;
  });

  // Filter available members for adding
  const filteredAvailableMembers = availableTeamMembers.filter(member => {
    // Exclude already assigned members
    if (assignedMembers.some(assigned => assigned.id === member.id)) {
      return false;
    }

    // Filter by department
    if (addMemberDepartmentFilter !== 'all' && member.department !== addMemberDepartmentFilter) {
      return false;
    }

    return true;
  });

  const allFilteredSelected = filteredAvailableMembers.length > 0 && 
    filteredAvailableMembers.every(member => selectedMembers.includes(member.id));
  const someFilteredSelected = filteredAvailableMembers.some(member => selectedMembers.includes(member.id));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Project not found</p>
        <Button onClick={() => router.push('/projects')} className="mt-4">
          Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit Project</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header with Back Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* <Button
          variant="outline"
          onClick={() => router.push('/projects')}
          className="shrink-0"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button> */}
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Edit Project</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        {/* Read-only Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Project Information (Read-only)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-blue-700">Project Name</label>
                  <p className="text-blue-900 font-medium break-words">{project.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-blue-700">Client Name</label>
                  <p className="text-blue-900 font-medium break-words">{project.clientName}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-blue-700">Project Description</label>
                  <p className="text-blue-900 break-words">{project.description}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-blue-700">Start Date</label>
                  <p className="text-blue-900 font-medium">{new Date(project.startDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Editable Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Editable Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Department *</label>
                <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
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
                <label className="text-sm font-medium">Budget *</label>
                <Input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  placeholder="Enter budget amount"
                  min="0"
                  step="1000"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Deadline *</label>
                <Input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => handleInputChange('deadline', e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Users className="h-5 w-5" />
              Assigned Team Members ({assignedMembers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6">
            {/* Add Member Button */}
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddMemberCard(!showAddMemberCard)}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Member
              {showAddMemberCard ? (
                <ChevronUp className="h-4 w-4 ml-2" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-2" />
              )}
            </Button>

            {/* Add Member Card */}
            {showAddMemberCard && (
              <Card className="border-2 border-dashed border-primary/20">
                <CardContent className="p-4 space-y-4">
                  <h4 className="font-medium">Add New Team Members</h4>
                  
                  {/* Department Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Department Filter</label>
                    <Select value={addMemberDepartmentFilter} onValueChange={setAddMemberDepartmentFilter}>
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

                  {/* Employee Selection List */}
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <label className="text-sm font-medium">Select Team Members</label>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={allFilteredSelected}
                          indeterminate={!allFilteredSelected && someFilteredSelected}
                          onCheckedChange={handleSelectAll}
                        />
                        <span className="text-sm">Select All ({selectedMembers.length} selected)</span>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg max-h-60 overflow-y-auto">
                      {filteredAvailableMembers.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground">
                          No employees available for the selected department
                        </div>
                      ) : (
                        <div className="space-y-1 p-2">
                          {filteredAvailableMembers.map((member) => (
                            <div
                              key={member.id}
                              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                            >
                              <Checkbox
                                checked={selectedMembers.includes(member.id)}
                                onCheckedChange={(checked) => handleMemberSelection(member.id, checked as boolean)}
                              />
                              <Avatar className="h-8 w-8 md:h-10 md:w-10">
                                <AvatarImage src={member.avatar} alt={member.name} />
                                <AvatarFallback className="text-xs md:text-sm">{member.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">{member.name}</div>
                                <div className="text-sm text-muted-foreground truncate">{member.department}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Project Role Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Project Role</label>
                    <Input
                      placeholder="Enter project role (e.g., Frontend Developer, Project Manager)"
                      value={newMemberRole}
                      onChange={(e) => setNewMemberRole(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setShowAddMemberCard(false);
                        setSelectedMembers([]);
                        setNewMemberRole('');
                      }}
                      className="w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="button" 
                      onClick={handleAddSelectedMembers}
                      className="w-full sm:w-auto"
                    >
                      Add Selected Members ({selectedMembers.length})
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Team Member Filters */}
            <div className="space-y-4">
              <h4 className="font-medium">Filter Team Members</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search team members..."
                      value={memberSearchTerm}
                      onChange={(e) => setMemberSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Department</label>
                  <Select value={selectedDepartmentFilter} onValueChange={setSelectedDepartmentFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Team Members List */}
            {filteredAssignedMembers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {assignedMembers.length === 0 
                  ? "No team members assigned yet. Click \"Add Member\" to get started."
                  : "No team members match the current filters."
                }
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAssignedMembers.map((member) => (
                  <div key={member.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Avatar className="h-8 w-8 md:h-10 md:w-10 shrink-0">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="text-xs md:text-sm">{member.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{member.name}</div>
                        <div className="text-sm text-muted-foreground truncate">{member.email}</div>
                        <div className="text-sm text-muted-foreground sm:hidden">
                          Role: {member.projectRole}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground hidden sm:block">
                        {member.projectRole}
                      </div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="max-w-md mx-4">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
                          <AlertDialogDescription>
                            Do you want to remove {member.name} from this project?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRemoveTeamMember(member.id)}
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/projects')}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? 'Updating Project...' : 'Update Project'}
          </Button>
        </div>
      </form>
    </div>
  );
}