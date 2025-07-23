'use client';

import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ReusableTable } from '@/components/customeTable/DataTable';
import { BreadcrumbNavigation } from '@/components/ui/breadcrumbs-navigation';
import { useAuth } from '@/lib/auth-context';
import { useLeaveStore } from '@/lib/leave-store';
import { dummyRequests } from '@/lib/constants/dummy-leaves';
import { getLeaveColumns } from '@/components/leave/leaveColumns';
import { StatusCard } from '@/components/StatusCard';

export default function AdminLeavePage() {
  const { user } = useAuth();
  const { updateLeaveRequest, updateLeaveBalance } = useLeaveStore();

  const calculateLeaveBalance = (employeeId: string): Record<string, number> => ({
    annual: 10,
    personal: 5,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [tab, setTab] = useState<'pending' | 'approved' | 'rejected'>('pending');

  const filteredRequests = useMemo(() => {
    return dummyRequests
      .filter((r) => r.status === tab)
      .filter((r) => r.employeeName.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [tab, searchTerm]);

  const handleUpdateStatus = (id: number, status: 'approved' | 'rejected') => {
    const request = dummyRequests.find((r) => r.id === id);
    if (!request) return;

    updateLeaveRequest(String(id), status, user?.name || 'Admin');
    if (status === 'approved') {
      updateLeaveBalance(String(request.employeeId), request.type, request.hours);
    }
    toast.success(`Request ${status}`);
  };

  const leaveColumns = getLeaveColumns({
    handleUpdateStatus,
    calculateLeaveBalance,
  });

  const counts = {
    pending: dummyRequests.filter((r) => r.status === 'pending').length,
    approved: dummyRequests.filter((r) => r.status === 'approved').length,
    rejected: dummyRequests.filter((r) => r.status === 'rejected').length,
  };

  const statusCards = [
    { key: 'pending', title: 'Pending', description: 'Awaiting Review' },
    { key: 'approved', title: 'Approved', description: 'This Month' },
    { key: 'rejected', title: 'Rejected', description: 'This Month' },
  ];

  return (
    <div className="container mx-auto">
      <BreadcrumbNavigation />

      <div className="grid gap-6 md:grid-cols-3 mt-4">
        {statusCards.map(({ key, title, description }) => (
          <StatusCard
            key={key}
            title={title}
            count={counts[key as keyof typeof counts]}
            description={description}
          />
        ))}
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex justify-between items-center">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <ReusableTable
          data={filteredRequests}
          columns={leaveColumns}
          currentPage={1}
          totalPages={1}
          pageSize={filteredRequests.length}
          totalItems={filteredRequests.length}
          onPageChange={() => {}}
          onPageSizeChange={() => {}}
        />
      </div>
    </div>
  );
}
