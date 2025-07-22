
'use client';

import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { ReusableTable, TableColumn } from '@/components/customeTable/DataTable';
import { BreadcrumbNavigation } from '@/components/ui/breadcrumbs-navigation';

import { useAuth } from '@/lib/auth-context';
import { useLeaveStore } from '@/lib/leave-store';
import type { LeaveRequest } from '@/types/leave';

const dummyRequests: LeaveRequest[] = [
  {
    id: 1,
    employeeId: 1,
    employeeName: 'John Admin',
    reason: 'Vacation janu parni xa',
    status: 'pending',
    type: 'personal',
    hours: 8,
    startDate: '2025-07-01',
    endDate: '2025-07-01',
    reviewedAt: null,
    reviewedBy: null,
  },
  {
    id: 2,
    employeeId: 2,
    employeeName: 'Jane Smith',
    reason: 'Vacation janu parni xa',
    status: 'approved',
    type: 'annual',
    hours: 16,
    startDate: '2025-07-05',
    endDate: '2025-07-06',
    reviewedAt: '2025-06-20T10:00:00Z',
    reviewedBy: 'HR Department',
  },
  {
    id: 3,
    employeeId: 3,
    employeeName: 'Alice Johnson',
    reason: 'Medical janu parni xa',
    status: 'rejected',
    type: 'personal',
    hours: 4,
    startDate: '2025-06-25',
    endDate: '2025-06-25',
    reviewedAt: '2025-06-22T14:30:00Z',
    reviewedBy: 'HR Department',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-yellow-100 text-yellow-800';
  }
};

export default function AdminLeavePage() {
  const { user } = useAuth();
  const { updateLeaveRequest, updateLeaveBalance, calculateLeaveBalance } = useLeaveStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [tab, setTab] = useState<'pending' | 'approved' | 'rejected'>('pending');

  const filteredRequests = useMemo(() => {
    return dummyRequests
      .filter((r) => r.status === tab)
      .filter((r) => r.employeeName.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [tab, searchTerm]);

  const handleUpdateStatus = (id: number, status: 'approved' | 'rejected') => {
    const request = dummyRequests.find(r => r.id === id);
    if (!request) return;

    updateLeaveRequest(String(id), status, user?.name || 'Admin');
    if (status === 'approved') {
      updateLeaveBalance(String(request.employeeId), request.type, request.hours);
    }
    toast.success(`Request ${status}`);
  };

  const leaveColumns: TableColumn<LeaveRequest>[] = [
    {
      key: 'employeeName',
      header: 'Employee',
      render: (item) => (
        <div className="font-medium">
          {item.employeeName}
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (item) => <span className="capitalize">{item.type}</span>,
    },
    {
      key: 'description',
      header: 'Description',
      render: (item) => <span className="capitalize">{item.reason}</span>,
    },
    {
      key: 'hours',
      header: 'Hours',
    },
    {
      key: 'startDate',
      header: 'Start',
      render: (item) => format(new Date(item.startDate), 'PP'),
    },
    {
      key: 'endDate',
      header: 'End',
      render: (item) => format(new Date(item.endDate), 'PP'),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => (
        <span className={`px-2 py-1 text-xs rounded ${getStatusColor(item.status)}`}>
          {item.status}
        </span>
      ),
    },
    {
      key: 'available',
      header: 'Balance',
      render: (item) =>
        `${calculateLeaveBalance(String(item.employeeId))?.[item.type] ?? 0}h`,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => {
        if (item.status !== 'pending') {
          return item.reviewedAt ? (
            <div className="text-xs text-muted-foreground">
              Reviewed by {item.reviewedBy} on {format(new Date(item.reviewedAt), 'PPp')}
            </div>
          ) : null;
        }
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleUpdateStatus(item.id, 'rejected')}
            >
              Reject
            </Button>
            <Button size="sm" onClick={() => handleUpdateStatus(item.id, 'approved')}>
              Approve
            </Button>
          </div>
        );
      },
    },
  ];

  const counts = {
    pending: dummyRequests.filter(r => r.status === 'pending').length,
    approved: dummyRequests.filter(r => r.status === 'approved').length,
    rejected: dummyRequests.filter(r => r.status === 'rejected').length,
  };

  return (
    <div className="container mx-auto">
      <BreadcrumbNavigation />

      <div className="grid gap-6 md:grid-cols-3 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{counts.pending}</p>
            <p className="text-sm text-muted-foreground">Awaiting Review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{counts.approved}</p>
            <p className="text-sm text-muted-foreground">This Month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{counts.rejected}</p>
            <p className="text-sm text-muted-foreground">This Month</p>
          </CardContent>
        </Card>
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
