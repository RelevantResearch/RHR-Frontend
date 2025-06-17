// hooks/useLeaveTypes.ts
import { useEffect, useState } from 'react';
import { getAllLeaveTypes, LeaveType } from '@/api/leave';

export const useLeaveTypes = () => {
    const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaveTypes = async () => {
            const types = await getAllLeaveTypes();
            if (Array.isArray(types)) {
                setLeaveTypes(types.filter((type) => !type.isDeleted));
            } else {
                setLeaveTypes([]);
            }
            setLoading(false);
        };


        fetchLeaveTypes();
    }, []);

    return { leaveTypes, loading };
};
