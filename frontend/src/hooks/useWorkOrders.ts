import { useState, useEffect } from 'react';
import { WorkOrder } from '../types/WorkOrder';
import { buildApiUrl } from '../config';

export function useWorkOrders() {
  const [data, setData] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(buildApiUrl('/api/workorder'));
      if (!response.ok) {
        throw new Error('Failed to fetch work orders');
      }
      const data = await response.json();
      setData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createWorkOrder = async (workOrder: WorkOrder): Promise<boolean> => {
    try {
      const response = await fetch(buildApiUrl('/api/workorder'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workOrder),
      });

      if (!response.ok) {
        throw new Error('Failed to create work order');
      }

      await fetchWorkOrders();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  };

  useEffect(() => {
    fetchWorkOrders();
  }, []);

  return {
    data,
    loading,
    error,
    createWorkOrder,
    refetch: fetchWorkOrders,
  };
}