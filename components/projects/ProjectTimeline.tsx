'use client';

import { format } from 'date-fns';
import { Project } from '@/types/projects';

interface ProjectTimelineProps {
  project: Project;
}

export default function ProjectTimeline({ project }: ProjectTimelineProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Timeline</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200/50 hover:shadow-md transition-shadow">
          <p className="text-xs text-gray-500 mb-1">Start Date</p>
          <p className="font-semibold text-gray-900">{format(new Date(project.startDate), 'MMM dd, yyyy')}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200/50 hover:shadow-md transition-shadow">
          <p className="text-xs text-gray-500 mb-1">Deadline</p>
          <p className="font-semibold text-gray-900">{format(new Date(project.deadline), 'MMM dd, yyyy')}</p>
        </div>
        {project.endDate && (
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200/50 hover:shadow-md transition-shadow">
            <p className="text-xs text-gray-500 mb-1">End Date</p>
            <p className="font-semibold text-gray-900">{format(new Date(project.endDate), 'MMM dd, yyyy')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
