'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function AddProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddMemberCard, setShowAddMemberCard] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [newMemberRole, setNewMemberRole] = useState('');
  
  // Employee filtering states
  const [addMemberDepartmentFilter, setAddMemberDepartmentFilter] = useState('all');
  
  const [formData, setFormData] = useState({
    name: '',
    clientName: '',
    description: '',
    department: '',
    budget: '',
    status: 'planning',
    startDate: '',
    endDate: '',
    deadline: '',
  });

  const [assignedMembers, setAssignedMembers] = useState<AssignedMember[]>([]);

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

  const handleUpdateMemberRole = (memberId: string, newRole: string) => {
    setAssignedMembers(prev => prev.map(member => 
      member.id === memberId ? { ...member, projectRole: newRole } : member
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.clientName || !formData.description || !formData.department || !formData.budget || !formData.startDate || !formData.deadline) {
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
      
      toast.success('Project created successfully');
      router.push('/projects');
    } catch (error) {
      toast.error('Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Add New Project</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header with Back Button */}

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Project Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Project Name </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter project name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Client Name </label>
                <Input
                  value={formData.clientName}
                  onChange={(e) => handleInputChange('clientName', e.target.value)}
                  placeholder="Enter client name"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Description </label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the project objectives and scope"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Department </label>
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
                <label className="text-sm font-medium">Budget </label>
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
            </div>
          </CardContent>
        </Card>

        {/* Dates */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Project Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date </label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  required
                />
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
                <label className="text-sm font-medium">Deadline </label>
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

        {/* Team Members Management */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Users className="h-5 w-5" />
              Team Members ({assignedMembers.length})
            </CardTitle>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddMemberCard(!showAddMemberCard)}
              className="w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Team Member
              {showAddMemberCard ? (
                <ChevronUp className="h-4 w-4 ml-2" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-2" />
              )}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6">
            {/* Add Member Expandable Card */}
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

            {assignedMembers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No team members assigned yet. Click "Add Team Member" to get started.
              </div>
            ) : (
              <div className="space-y-3">
                {assignedMembers.map((member) => (
                  <div key={member.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Avatar className="h-8 w-8 md:h-10 md:w-10 shrink-0">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="text-xs md:text-sm">{member.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{member.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <div className="flex-1 sm:min-w-[200px]">
                        <Input
                          placeholder="Enter project role"
                          value={member.projectRole}
                          onChange={(e) => handleUpdateMemberRole(member.id, e.target.value)}
                          className="h-8"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveTeamMember(member.id)}
                        className="shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
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
            {isSubmitting ? 'Creating Project...' : 'Create Project'}
          </Button>
        </div>
      </form>
    </div>
  );
}