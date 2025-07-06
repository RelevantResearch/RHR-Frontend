
'use client';

import { useEffect, useState } from 'react';
import { getAllRoles } from '@/api/roles';
import { Role } from '@/types/role';

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRoles() {
      try {
        const data = await getAllRoles();
        setRoles(data);
      } catch (err) {
        console.error('Failed to fetch roles:', err);
        setError('Failed to fetch roles');
      } finally {
        setLoading(false);
      }
    }

    fetchRoles();
  }, []);

  return { roles, loading, error };
}
