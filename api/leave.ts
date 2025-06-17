// api/leave.ts
import axiosInstance from "./axios";

export interface LeaveType {
    id: number;
    name: string;
    isDeleted: boolean;
}

export const getAllLeaveTypes = async (): Promise<LeaveType[]> => {
    try {
        const response = await axiosInstance.get('/leaveType/all');
        return response.data.data; // ✅ Only return the actual array
    } catch (error) {
        console.error('Error fetching leave types:', error);
        return [];
    }
};