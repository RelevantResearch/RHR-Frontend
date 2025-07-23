'use client';

import { Badge } from '@/components/ui/badge';
import { Project } from '@/types/projects';
import { viewStatusColor } from '@/lib/utils/status-color';

interface ProjectDescriptionCardProps {
  project: Project;
}

export default function ProjectDescriptionCard({ project }: ProjectDescriptionCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Project Description</h3>
        <Badge className={`${viewStatusColor(project.status)} px-3 py-1 text-sm`}>
          {project.status.replace('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
        </Badge>
      </div>
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-gray-700 leading-relaxed">
          {project.description || 'No description provided.'}
        </p>
      </div>
    </div>
  );
}
