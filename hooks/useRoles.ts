import { getAllRoles } from '@/api/roles';
import { Role } from '@/lib/types';
import { useEffect, useState } from 'react';

export const useRoles = () => {
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getAllRoles();
        // console.log("Fetched Roles:", response);
        setRoles(response);
      } catch (error) {
        console.error("Role fetch error:", error);
      }
    };

    fetchRoles();
  }, []);

  return { roles };
};
