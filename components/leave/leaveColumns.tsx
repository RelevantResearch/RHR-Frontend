import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { getStatusColor } from '@/lib/utils/status-color';
import type { TableColumn } from '@/components/customeTable/DataTable';
import type { LeaveRequest } from '@/types/leave';

interface LeaveColumnsProps {
  handleUpdateStatus: (id: number, status: 'approved' | 'rejected') => void;
  calculateLeaveBalance: (employeeId: string) => Record<string, number>;
}

export const getLeaveColumns = ({
  handleUpdateStatus,
  calculateLeaveBalance,
}: LeaveColumnsProps): TableColumn<LeaveRequest>[] => [
  {
    key: 'employeeName',
    header: 'Employee',
    render: (item) => <div className="font-medium">{item.employeeName}</div>,
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
