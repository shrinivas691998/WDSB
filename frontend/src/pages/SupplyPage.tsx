import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { ExcelUpload } from '../components/ExcelUpload';
import { SupplyForm } from '../components/SupplyForm';
import { SupplyTable } from '../components/SupplyTable';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useSupply } from '../hooks/useSupply';
import { Supply } from '../types/Supply';

export function SupplyPage() {
  const [showForm, setShowForm] = useState(false);
  const { data: supplies, loading, error, createSupply, refetch } = useSupply();

  const handleSubmit = async (supply: Supply) => {
    const success = await createSupply(supply);
    if (success) {
      setShowForm(false);
    }
  };

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Supply Management</h1>
        <div className="flex gap-4">
          <ExcelUpload onUploadSuccess={refetch} endpoint="/api/supply/upload" />
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <PlusCircle size={20} />
            New Supply
          </button>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {showForm && (
        <div className="mb-8">
          <SupplyForm
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <SupplyTable 
          supplies={supplies || []} 
          refetch={refetch} 
        />
      )}
    </div>
  );
} 