'use client';

import { Badge } from '@/components/ui/badge';
import { UserAssignment } from '@/types/projects';

interface TeamMemberListProps {
  members: UserAssignment[];
}

export default function TeamMemberList({ members }: TeamMemberListProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
        <Badge variant="secondary">
          {members.length} member{members.length !== 1 && 's'}
        </Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {members.map((assignment) => (
          <div
            key={assignment.id}
            className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 border border-gray-300/50 hover:shadow-md hover:bg-gray-100 transition-shadow"
          >
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
  );
}
