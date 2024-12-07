import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { ExcelUpload } from '../components/ExcelUpload';
import { BOMForm } from '../components/BOMForm';
import { BOMTable } from '../components/BOMTable';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useBOM } from '../hooks/useBOM';
import { BOM } from '../types/BOM';

export function BOMPage() {
  const [showForm, setShowForm] = useState(false);
  const { data: boms, loading, error, createBOM, refetch } = useBOM();

  const handleSubmit = async (bom: BOM) => {
    const success = await createBOM(bom);
    if (success) {
      setShowForm(false);
    }
  };

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Bill of Materials Management</h1>
        <div className="flex gap-4">
          <ExcelUpload onUploadSuccess={refetch} endpoint="/api/bom/upload" />
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <PlusCircle size={20} />
            New BOM Entry
          </button>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {showForm && (
        <div className="mb-8">
          <BOMForm
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <BOMTable 
          boms={boms || []} 
          refetch={refetch} 
        />
      )}
    </div>
  );
} 