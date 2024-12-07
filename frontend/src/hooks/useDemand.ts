import { useState, useEffect } from 'react';
import { Demand } from '../types/Demand';
import { buildApiUrl } from '../config';

export function useDemand() {
  const [data, setData] = useState<Demand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDemands = async () => {
    try {
      setLoading(true);
      const response = await fetch(buildApiUrl('/api/demand'));
      if (!response.ok) {
        throw new Error('Failed to fetch demands');
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

  const createDemand = async (demand: Demand): Promise<boolean> => {
    try {
      const response = await fetch(buildApiUrl('/api/demand'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(demand),
      });

      if (!response.ok) {
        throw new Error('Failed to create demand');
      }

      await fetchDemands();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  };

  useEffect(() => {
    fetchDemands();
  }, []);

  return {
    data,
    loading,
    error,
    createDemand,
    refetch: fetchDemands,
  };
} 