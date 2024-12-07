import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { ExcelUpload } from '../components/ExcelUpload';
import { DemandForm } from '../components/DemandForm';
import { DemandTable } from '../components/DemandTable';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useDemand } from '../hooks/useDemand';
import { Demand } from '../types/Demand';
import { buildApiUrl } from '../config';

export function DemandPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingDemand, setEditingDemand] = useState<Demand | null>(null);
  const { data: demands, loading, error, createDemand, refetch } = useDemand();

  const handleSubmit = async (demand: Demand) => {
    const success = await createDemand(demand);
    if (success) {
      setShowForm(false);
      setEditingDemand(null);
    }
  };

  const handleDelete = async (demandNo: string) => {
    try {
      const response = await fetch(buildApiUrl(`/api/demand/${demandNo}`), {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete demand');
      }

      refetch();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete demand');
    }
  };

  const handleUpdate = async (demand: Demand) => {
    try {
      const response = await fetch(buildApiUrl(`/api/demand/${demand.demandNo}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(demand),
      });

      if (!response.ok) {
        throw new Error('Failed to update demand');
      }

      refetch();
      setEditingDemand(null);
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update demand');
    }
  };

  if (editingDemand) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-200 mb-8">Edit Demand</h1>
        <DemandForm
          onSubmit={handleUpdate}
          onCancel={() => setEditingDemand(null)}
          initialData={editingDemand}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-200">Demand Management</h1>
        <div className="flex gap-4">
          <ExcelUpload onUploadSuccess={refetch} endpoint="/api/demand/upload" />
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <PlusCircle size={20} />
            New Demand
          </button>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {showForm && (
        <div className="mb-8">
          <DemandForm
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <DemandTable 
          demands={demands || []} 
          refetch={refetch}
          onDelete={handleDelete}
          onUpdate={setEditingDemand}
        />
      )}
    </div>
  );
} 