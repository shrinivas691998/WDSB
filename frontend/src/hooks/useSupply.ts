import { useState, useEffect } from 'react';
import { Supply } from '../types/Supply';
import { buildApiUrl } from '../config';

export function useSupply() {
  const [data, setData] = useState<Supply[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSupplies = async () => {
    try {
      setLoading(true);
      const response = await fetch(buildApiUrl('/api/supply'));
      if (!response.ok) {
        throw new Error('Failed to fetch supplies');
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

  const createSupply = async (supply: Supply): Promise<boolean> => {
    try {
      const response = await fetch(buildApiUrl('/api/supply'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(supply),
      });

      if (!response.ok) {
        throw new Error('Failed to create supply');
      }

      await fetchSupplies();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  };

  useEffect(() => {
    fetchSupplies();
  }, []);

  return {
    data,
    loading,
    error,
    createSupply,
    refetch: fetchSupplies,
  };
} 