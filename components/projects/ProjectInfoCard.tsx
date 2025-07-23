'use client';

import { Project } from '@/types/projects';

interface ProjectInfoCardProps {
  project: Project;
}

export default function ProjectInfoCard({ project }: ProjectInfoCardProps) {
  return (
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
  );
}
