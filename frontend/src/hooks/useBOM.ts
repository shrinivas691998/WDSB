import { useState, useEffect } from 'react';
import { BOM } from '../types/BOM';
import { buildApiUrl } from '../config';

export function useBOM() {
  const [data, setData] = useState<BOM[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBOMs = async () => {
    try {
      setLoading(true);
      const response = await fetch(buildApiUrl('/api/bom'));
      if (!response.ok) {
        throw new Error('Failed to fetch BOMs');
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

  const createBOM = async (bom: BOM): Promise<boolean> => {
    try {
      const response = await fetch(buildApiUrl('/api/bom'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bom),
      });

      if (!response.ok) {
        throw new Error('Failed to create BOM');
      }

      await fetchBOMs();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  };

  useEffect(() => {
    fetchBOMs();
  }, []);

  return {
    data,
    loading,
    error,
    createBOM,
    refetch: fetchBOMs,
  };
} 