'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { BreadcrumbNavigation } from '@/components/ui/breadcrumbs-navigation';
import ProjectForm from '@/components/projectForm';
import { useDepartmentsQuery } from '@/lib/queries';
import { updateProject, getProjectId } from '@/api/project';
import {
  Department,
  ProjectFormData,
  ProjectFormProps,
  ApiProject,
  UserAssignment,
  Project,
  BaseUserAssignment,
} from '@/types/projects';

const statuses: ProjectFormProps['statuses'] = [
  'processing',
  'active',
  'on-hold',
  'completed',
  'cancelled',
];

const statusMap: Record<string, string> = {
  processing: 'PROCRESSING',
  active: 'ACTIVE',
  'on-hold': 'ON_HOLD',
  completed: 'COMPLETED',
  cancelled: 'CANCELLED',
};




export default function EditProjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<ProjectFormProps['initialData'] | null>(null);

  const {
    data: departmentsData,
    isLoading: isDepartmentsLoading,
    error: departmentsError,
  } = useDepartmentsQuery();

  const { departments, departmentIdMap } = useMemo(() => {
    if (!departmentsData) return { departments: [], departmentIdMap: {} };

    const departments = departmentsData.map((dept: Department) => dept.name);
    const departmentIdMap: Record<string, number> = {};

    departmentsData.forEach((dept: Department) => {
      departmentIdMap[dept.name] = dept.id;
    });

    return { departments, departmentIdMap };
  }, [departmentsData]);

  const projectId = searchParams?.get('id');

  useEffect(() => {
    if (!projectId) {
      toast.error('Project ID is missing in the URL');
      setLoading(false);
      return;
    }

    const fetchProject = async () => {
  try {
    const project: Project = await getProjectId(projectId);

    const adaptedData: ProjectFormProps['initialData'] = {
      id: project.id,
      name: project.name,
      clientName: project.client,
      description: project.description,
      department: departmentsData?.find((d) => d.id === project.departmentId)?.name || '',
      budget: project.budget,
      status:
        Object.entries(statusMap).find(([, apiStatus]) => apiStatus === project.status)?.[0] ||
        'active',
      startDate: project.startDate?.slice(0, 10),
      endDate: project.endDate?.slice(0, 10),
      deadline: project.deadline?.slice(0, 10),
      userAssignments:
        project.userAssignments?.map((ua: BaseUserAssignment) => ({
          userId: ua.userId,
          role: ua.role,
          name: '', // Since BaseUserAssignment doesn't have user data
          email: '',
          department: '',
          id: ua.userId.toString(),
        })) || [],
    };

    setInitialData(adaptedData);
  } catch (err) {
    toast.error('Failed to load project data');
    console.error(err);
  } finally {
    setLoading(false);
  }
};

    fetchProject();
  }, [projectId, departmentsData]);

  const transformFormDataToPayload = (
    formData: ProjectFormData,
    userAssignments: { userId: number; role: string }[]
  ) => ({
    name: formData.name,
    client: formData.clientName,
    budget: formData.budget,
    deadline: new Date(formData.deadline).toISOString(),
    departmentId: departmentIdMap[formData.department] || 1,
    description: formData.description,
    status: statusMap[formData.status] || 'ACTIVE',
    startDate: new Date(formData.startDate).toISOString(),
    endDate: new Date(formData.endDate).toISOString(),
    userAssignments,
  });

  const handleUpdate: ProjectFormProps['onSubmit'] = async (
    formData,
    assignedMembers
  ) => {
    if (!initialData?.id) {
      toast.error('Project ID is missing');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = transformFormDataToPayload(formData, assignedMembers);
      const result = await updateProject(initialData.id as number, payload);

      await queryClient.invalidateQueries({ queryKey: ['projects'] });
      await queryClient.invalidateQueries({ queryKey: ['project', initialData.id] });

      toast.success('Project updated successfully');
      router.push('/projects');
    } catch (error: any) {
      console.error('Error updating project:', error);
      toast.error(
        error?.response?.data?.message || error.message || 'Failed to update project'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/projects');
  };

  if (isDepartmentsLoading || loading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <BreadcrumbNavigation />
        <div className="flex items-center justify-center p-8">
          <div className="text-gray-500">Loading project data...</div>
        </div>
      </div>
    );
  }

  if (departmentsError) {
    return (
      <div className="space-y-4 md:space-y-6">
        <BreadcrumbNavigation />
        <div className="flex items-center justify-center p-8">
          <div className="text-red-500">Failed to load departments. Please try again.</div>
        </div>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="space-y-4 md:space-y-6">
        <BreadcrumbNavigation />
        <div className="flex items-center justify-center p-8">
          <div className="text-red-500">Project not found.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <BreadcrumbNavigation />
      <ProjectForm
        initialData={initialData}
        departments={departments}
        statuses={statuses}
        onSubmit={handleUpdate}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        submitButtonText="Update Project"
        title="Edit Project"
      />
    </div>
  );
}
