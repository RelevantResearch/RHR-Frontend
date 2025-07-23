'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getProjectId } from '@/api/project';
import { BreadcrumbNavigation } from '@/components/ui/breadcrumbs-navigation';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { Project } from '@/types/projects';
import TeamMemberList from '@/components/projects/TeamMemberList';
import ProjectTimeline from '@/components/projects/ProjectTimeline';
import ProjectInfoCard from '@/components/projects/ProjectInfoCard';
import ProjectDescriptionCard from '@/components/projects/ProjectDescriptionCard';

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
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
          <ProjectInfoCard project={project} />
          <ProjectDescriptionCard project={project} />
        </div>

        <ProjectTimeline project={project} />
        <TeamMemberList members={project.userAssignments} />
      </div>
    </div>
  );
}