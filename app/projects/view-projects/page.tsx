'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { getProjectId } from '@/api/project'; 
import { BreadcrumbNavigation } from '@/components/ui/breadcrumbs-navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit } from 'lucide-react';
import { Project, UserAssignment } from '@/types/projects';

export default function ProjectViewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams?.get('id');

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      try {
        if (!projectId) throw new Error('Project ID is required');
        const projectData = await getProjectId(projectId);
        setProject(projectData);
      } catch (error) {
        console.error('Failed to load project:', error);
        router.push('/projects');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      loadProject();
    } else {
      router.push('/projects');
    }
  }, [projectId, router]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-orange-50 text-orange-700 border border-orange-200/60 hover:bg-orange-200';
      case 'processing':
        return 'bg-blue-50 text-blue-700 border border-blue-200/60 hover:bg-blue-200';
      case 'on_hold':
        return 'bg-amber-50 text-amber-700 border border-amber-200/60 hover:bg-amber-200';
      case 'completed':
        return 'bg-violet-50 text-violet-700 border border-violet-200/60 hover:bg-violet-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border border-rose-200/60 hover:bg-rose-200';
      case 'archived':
        return 'bg-slate-50 text-slate-700 border border-slate-200/60 hover:bg-slate-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200/60 hover:bg-gray-200';
    }
  };

  const handleEditProject = () => {
    router.push(`/projects/edit-projects?id=${projectId}`);
  };

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
    <div className="min-h-screen">
      <div className="flex flex-row justify-between items-center w-full mb-6">
        <BreadcrumbNavigation dynamicData={{ projectName: project.name }} />
        <Button onClick={handleEditProject} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2">
          <Edit className="h-4 w-4 mr-2" />
          Edit Project
        </Button>
      </div>

      <div className="container space-y-8">
        {/* Project Info & Description */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Information</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <dt className="text-sm text-gray-500">Project Name</dt>
                <dd className="text-lg font-medium text-gray-900">{project.name}</dd>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <dt className="text-sm text-gray-500">Department</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {project.department?.name || `Department ID: ${project.departmentId}`}
                </dd>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <dt className="text-sm text-gray-500">Client</dt>
                <dd className="text-lg font-medium text-gray-900">{project.client}</dd>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <dt className="text-sm text-gray-500">Budget</dt>
                <dd className="text-base font-medium text-gray-900">
                  ${parseFloat(project.budget).toLocaleString()}
                </dd>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Project Description</h3>
              <Badge className={`${getStatusColor(project.status)} px-3 py-1 text-sm`}>
                {project.status.replace('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
              </Badge>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed">{project.description || 'No description provided.'}</p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Timeline</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200/50 hover:shadow-md transition-shadow gap-3 p-3">
              <p className="text-xs text-gray-500 mb-1">Start Date</p>
              <p className="font-semibold text-gray-900">{format(new Date(project.startDate), 'MMM dd, yyyy')}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200/50 hover:shadow-md transition-shadow gap-3 p-3">
              <p className="text-xs text-gray-500 mb-1">Deadline</p>
              <p className="font-semibold text-gray-900">{format(new Date(project.deadline), 'MMM dd, yyyy')}</p>
            </div>
            {project.endDate && (
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200/50 hover:shadow-md transition-shadow gap-3 p-3">
                <p className="text-xs text-gray-500 mb-1">End Date</p>
                <p className="font-semibold text-gray-900">{format(new Date(project.endDate), 'MMM dd, yyyy')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
            <Badge variant="secondary">
              {project.userAssignments.length} member{project.userAssignments.length !== 1 && 's'}
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {project.userAssignments.map((assignment: UserAssignment) => (
              <div key={assignment.id} className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 rounded-lg p-4 border border-gray-300/50 hover:shadow-md hover:bg-gray-100 transition-shadow gap-3">
                <div className="min-w-0">
                  <div className="font-medium text-gray-900">
                    {assignment.user.name || 'Unknown User'}
                  </div>
                  <div className="text-sm text-gray-500">{assignment.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}