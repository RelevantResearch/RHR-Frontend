'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X, Users, ChevronDown, ChevronUp, Loader2, AlertCircle } from "lucide-react";
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useEmployeesQuery } from '@/lib/queries';
import { validateProjectForm, validateField } from '@/lib/schemas/project.schema';
import {
  ApiProject,
  ProjectFormData,
  ProjectFormProps,
  User,
  UserAssignment
} from '@/types/projects';

export default function ProjectForm({
  initialData,
  departments,
  statuses,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitButtonText = 'Create Project',
  title = 'Project Information'
}: ProjectFormProps) {
  const [showAddMemberCard, setShowAddMemberCard] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [newMemberRole, setNewMemberRole] = useState('');
  const [addMemberDepartmentFilter, setAddMemberDepartmentFilter] = useState('all');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Fetch employees from API - removed the argument
  const { data: employees, isLoading, error } = useEmployeesQuery();

  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    clientName: '',
    description: '',
    department: '',
    budget: '',
    status: 'processing',
    startDate: '',
    endDate: '',
    deadline: '',
  });

  const [userAssignments, setUserAssignments] = useState<UserAssignment[]>([]);

  const getUserById = (userId: number): User | null => {
    return employees?.find((user: User) => user.id === userId) || null;
  };

  const getDisplayName = (user: User | null, fallbackName?: string): string => {
    if (!user) {
      return fallbackName || 'Unknown User';
    }

    if (user.name && user.name.trim()) {
      return user.name;
    }

    // Use email prefix as fallback
    if (user.email && user.email.includes('@')) {
      const emailName = user.email.split('@')[0];
      return emailName;
    }

    return fallbackName || `User ${user.id}`;
  };

  const formatDateForInput = (dateString: string | null | undefined): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  const isApiProject = (data: any): data is ApiProject => {
    return data && typeof data === 'object' &&
      'client' in data &&
      'userAssignments' in data &&
      'department' in data &&
      typeof data.department === 'object';
  };

  // Validate field on change
  const validateFieldOnChange = (field: keyof ProjectFormData | 'userAssignments', value: string | UserAssignment[]) => {
    if (!touched[field]) return;
    
    const error = validateField(field, value, formData);
    setFieldErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  // Mark field as touched
  const handleFieldTouch = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  useEffect(() => {
    if (initialData) {
      if (isApiProject(initialData)) {
        setFormData({
          name: initialData.name || '',
          clientName: initialData.client || '',
          description: initialData.description || '',
          department: initialData.department?.name || '',
          budget: initialData.budget || '',
          status: initialData.status?.toLowerCase() || 'processing',
          startDate: formatDateForInput(initialData.startDate),
          endDate: formatDateForInput(initialData.endDate),
          deadline: formatDateForInput(initialData.deadline),
        });

        // Use existing userAssignments from API response
        if (initialData.userAssignments && Array.isArray(initialData.userAssignments)) {
          setUserAssignments(initialData.userAssignments);
        } else {
          setUserAssignments([]);
        }
      } else {
        setFormData({
          name: initialData.name || '',
          clientName: (initialData as any).clientName || '',
          description: initialData.description || '',
          department: (initialData as any).department || '',
          budget: (initialData as any).budget || '',
          status: (initialData as any).status || 'processing',
          startDate: (initialData as any).startDate || '',
          endDate: (initialData as any).endDate || '',
          deadline: (initialData as any).deadline || '',
        });

        if ((initialData as any).userAssignments && Array.isArray((initialData as any).userAssignments)) {
          const legacyAssignments = (initialData as any).userAssignments.map((assignment: any, index: number) => ({
            id: assignment.id || index,
            userId: typeof assignment.userId === 'string' ? parseInt(assignment.userId) : assignment.userId,
            projectId: 0, 
            assignedAt: new Date().toISOString(),
            role: assignment.role || 'Team Member',
            user: getUserById(typeof assignment.userId === 'string' ? parseInt(assignment.userId) : assignment.userId) || {
              id: typeof assignment.userId === 'string' ? parseInt(assignment.userId) : assignment.userId,
              name: `User ${assignment.userId}`,
              email: '',
              phone: '',
              document: '',
              fullTimer: true,
              profilePic: null,
              salary: 0,
              address: '',
              DOB: '',
              position: null,
              isDeleted: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              departmentId: 0,
            }
          }));
          setUserAssignments(legacyAssignments);
        } else {
          setUserAssignments([]);
        }
      }
    } else {
      // Reset form
      setFormData({
        name: '',
        clientName: '',
        description: '',
        department: '',
        budget: '',
        status: 'processing',
        startDate: '',
        endDate: '',
        deadline: '',
      });
      setUserAssignments([]);
    }
    
    // Clear validation states when initialData changes
    setFieldErrors({});
    setTouched({});
  }, [initialData, employees]);

  const handleInputChange = (field: keyof ProjectFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateFieldOnChange(field, value);
  };

  // Update user assignments validation when assignments change
  useEffect(() => {
    validateFieldOnChange('userAssignments', userAssignments);
  }, [userAssignments, touched]);

  const handleMemberSelection = (userId: number, checked: boolean) => {
    if (checked) {
      setSelectedMembers(prev => [...prev, userId]);
    } else {
      setSelectedMembers(prev => prev.filter(id => id !== userId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const availableIds = filteredAvailableMembers.map((user: User) => user.id);
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

    const newAssignments: UserAssignment[] = selectedMembers.map((userId, index) => {
      const user = getUserById(userId);
      return {
        id: Date.now() + index, 
        userId,
        projectId: 0,
        assignedAt: new Date().toISOString(),
        role: newMemberRole.trim(),
        user: user || {
          id: userId,
          name: `User ${userId}`,
          email: '',
          phone: '',
          document: '',
          fullTimer: true,
          profilePic: null,
          salary: 0,
          address: '',
          DOB: '',
          position: null,
          isDeleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          departmentId: 0,
        }
      };
    });

    setUserAssignments(prev => [...prev, ...newAssignments]);
    setSelectedMembers([]);
    setNewMemberRole('');
    setShowAddMemberCard(false);
    handleFieldTouch('userAssignments');
  };

  const handleRemoveTeamMember = (assignmentId: number) => {
    const assignment = userAssignments.find(a => a.id === assignmentId);
    setUserAssignments(prev => prev.filter(a => a.id !== assignmentId));
    if (assignment) {
      const displayName = getDisplayName(assignment.user, `User ${assignment.userId}`);
      toast.success(`Removed ${displayName} from the project`);
    }
    handleFieldTouch('userAssignments');
  };

  const handleUpdateMemberRole = (assignmentId: number, newRole: string) => {
    setUserAssignments(prev => prev.map(assignment =>
      assignment.id === assignmentId ? { ...assignment, role: newRole } : assignment
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched for validation display
    const allFields = ['name', 'clientName', 'description', 'department', 'budget', 'startDate', 'endDate', 'deadline', 'userAssignments'];
    const newTouched = allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {});
    setTouched(newTouched);

    // Validate the entire form
    const validation = validateProjectForm(formData, userAssignments);
    setFieldErrors(validation.fieldErrors);

    if (!validation.isValid) {
      // Scroll to first error field
      const firstError = validation.errors[0];
      if (firstError) {
        const element = document.querySelector(`[name="${firstError.field}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      return;
    }

    try {
      const assignmentsForSubmit = userAssignments.map(assignment => ({
        userId: assignment.userId,
        role: assignment.role
      }));

      await onSubmit(formData, assignmentsForSubmit);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit form. Please try again.');
    }
  };

  const filteredAvailableMembers = (employees || []).filter((user: User) => {
    if (userAssignments.some(assignment => assignment.userId === user.id)) {
      return false;
    }

    if (addMemberDepartmentFilter !== 'all') {
      const userDepartment = user.department?.name || '';
      if (userDepartment !== addMemberDepartmentFilter) {
        return false;
      }
    }

    return true;
  });

  const allFilteredSelected = filteredAvailableMembers.length > 0 &&
    filteredAvailableMembers.every((user: { id: number; }) => selectedMembers.includes(user.id));
  const someFilteredSelected = filteredAvailableMembers.some((user: User) => selectedMembers.includes(user.id));

  // Error message component
  const ErrorMessage = ({ error }: { error?: string }) => {
    if (!error) return null;
    return (
      <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
        <AlertCircle className="h-4 w-4" />
        <span>{error}</span>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Name *</label>
              <Input
                name="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                onBlur={() => handleFieldTouch('name')}
                placeholder="Enter project name"
                className={fieldErrors.name ? 'border-red-500' : ''}
              />
              <ErrorMessage error={fieldErrors.name} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Client Name *</label>
              <Input
                name="clientName"
                value={formData.clientName}
                onChange={(e) => handleInputChange('clientName', e.target.value)}
                onBlur={() => handleFieldTouch('clientName')}
                placeholder="Enter client name"
                className={fieldErrors.clientName ? 'border-red-500' : ''}
              />
              <ErrorMessage error={fieldErrors.clientName} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Project Description *</label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              onBlur={() => handleFieldTouch('description')}
              placeholder="Describe the project objectives and scope"
              rows={3}
              className={fieldErrors.description ? 'border-red-500' : ''}
            />
            <ErrorMessage error={fieldErrors.description} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Department *</label>
              <Select 
                name="department"
                value={formData.department} 
                onValueChange={(value) => {
                  handleInputChange('department', value);
                  handleFieldTouch('department');
                }}
              >
                <SelectTrigger className={fieldErrors.department ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <ErrorMessage error={fieldErrors.department} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Budget *</label>
              <Input
                name="budget"
                type="number"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                onBlur={() => handleFieldTouch('budget')}
                placeholder="Enter budget amount"
                min="0"
                step="1"
                className={fieldErrors.budget ? 'border-red-500' : ''}
              />
              <ErrorMessage error={fieldErrors.budget} />
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

      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Project Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date *</label>
              <Input
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                onBlur={() => handleFieldTouch('startDate')}
                className={fieldErrors.startDate ? 'border-red-500' : ''}
              />
              <ErrorMessage error={fieldErrors.startDate} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <Input
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                onBlur={() => handleFieldTouch('endDate')}
                className={fieldErrors.endDate ? 'border-red-500' : ''}
              />
              <ErrorMessage error={fieldErrors.endDate} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Deadline *</label>
              <Input
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
                onBlur={() => handleFieldTouch('deadline')}
                className={fieldErrors.deadline ? 'border-red-500' : ''}
              />
              <ErrorMessage error={fieldErrors.deadline} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Users className="h-5 w-5" />
            Team Members ({userAssignments.length})
          </CardTitle>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowAddMemberCard(!showAddMemberCard)}
            className="w-full sm:w-auto"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            Add Team Member
            {showAddMemberCard ? (
              <ChevronUp className="h-4 w-4 ml-2" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-2" />
            )}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          {fieldErrors.userAssignments && (
            <ErrorMessage error={fieldErrors.userAssignments} />
          )}
          
          {showAddMemberCard && (
            <Card className="border-2 border-dashed border-primary/20">
              <CardContent className="p-4 space-y-4">
                <h4 className="font-medium">Add New Team Members</h4>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    Error loading employees: {error.message}
                  </div>
                )}

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

                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <label className="text-sm font-medium">Select Team Members</label>
                    {!isLoading && filteredAvailableMembers.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={allFilteredSelected}
                          indeterminate={!allFilteredSelected && someFilteredSelected}
                          onCheckedChange={handleSelectAll}
                        />
                        <span className="text-sm">Select All ({selectedMembers.length} selected)</span>
                      </div>
                    )}
                  </div>

                  <div className="border rounded-lg max-h-64 overflow-y-auto">
                    {isLoading ? (
                      <div className="p-8 text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
                        <div className="text-muted-foreground">Loading employees...</div>
                      </div>
                    ) : error ? (
                      <div className="p-4 text-center text-red-600">
                        Failed to load employees. Please try again.
                      </div>
                    ) : filteredAvailableMembers.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        {(employees || []).length === 0 ?
                          'No employees found' :
                          addMemberDepartmentFilter === 'all' ?
                            'All available employees are already assigned' :
                            `No employees available in ${addMemberDepartmentFilter} department`
                        }
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-2">
                        {filteredAvailableMembers.map((user: User) => {
                          return (
                            <div
                              key={user.id}
                              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                            >
                              <Checkbox
                                checked={selectedMembers.includes(user.id)}
                                onCheckedChange={(checked) =>
                                  handleMemberSelection(user.id, checked as boolean)
                                }
                              />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">{user.name}</div>
                                <div className="text-sm text-muted-foreground truncate">
                                  {user.department?.name || 'No Department'}
                                </div>
                              </div>
                            </div>
                          );
                        })}

                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Project Role *</label>
                  <Input
                    placeholder="e.g., Frontend Developer, Project Manager, Designer"
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
                      setAddMemberDepartmentFilter('all');
                    }}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleAddSelectedMembers}
                    className="w-full sm:w-auto"
                    disabled={isLoading || selectedMembers.length === 0 || !newMemberRole.trim()}
                  >
                    Add Selected Members ({selectedMembers.length})
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {userAssignments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <div className="text-lg font-medium mb-2">No team members assigned yet</div>
              <div className="text-sm">Click "Add Team Member" to get started building your project team.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {userAssignments.map((assignment) => {
                const displayName = getDisplayName(assignment.user, `User ${assignment.userId}`);

                return (
                  <div
                    key={assignment.id}
                    className="relative p-4 border rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200/50 hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="font-medium text-gray-900 mb-1">
                          {displayName}
                        </div>
                        <div className="text-sm text-purple-600 font-medium mb-1">
                          {assignment.role || 'No Role'}
                        </div>
                       
          
                      </div>
                      <ConfirmDialog
                        title="Remove Member"
                        description={`Are you sure you want to remove ${displayName} from the project?`}
                        confirmText="Remove"
                        cancelText="Cancel"
                        onConfirm={() => handleRemoveTeamMember(assignment.id)}
                        triggerButton={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0 hover:bg-red-100 hover:text-red-600"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {submitButtonText.split(' ')[0]}ing...
            </>
          ) : (
            submitButtonText
          )}
        </Button>
      </div>
    </form>
  );
}