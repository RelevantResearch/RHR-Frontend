export type LeaveType = 'annual' | 'personal';

export type LeaveRequest = {
  id: number;
  employeeId: number;
  employeeName: string;
  reason: string;
  status: 'approved' | 'pending' | 'rejected';
  type: LeaveType;
  hours: number;
  startDate: string;
  endDate: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
};

export type LeaveBalance = {
  [key in LeaveType]: number;
};
