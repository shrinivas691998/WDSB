import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { ExcelUpload } from '../components/ExcelUpload';
import { WorkOrderForm } from '../components/WorkOrderForm';
import { WorkOrderTable } from '../components/WorkOrderTable';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useWorkOrders } from '../hooks/useWorkOrders';
import { WorkOrder } from '../types/WorkOrder';
import { buildApiUrl } from '../config';

export function WorkOrderPage() {
  const [showForm, setShowForm] = useState(false);
  const { data: workOrders, loading, error, createWorkOrder, refetch } = useWorkOrders();

  const handleSubmit = async (workOrder: WorkOrder) => {
    const success = await createWorkOrder(workOrder);
    if (success) {
      setShowForm(false);
    }
  };

  const handleDelete = async (workOrderNo: string) => {
    try {
      const response = await fetch(buildApiUrl(`/api/workorder/${workOrderNo}`), {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete work order');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete work order');
    }
  };

  const handleUpdate = async (workOrder: WorkOrder) => {
    try {
      const response = await fetch(buildApiUrl(`/api/workorder/${workOrder.workOrderNo}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workOrder),
      });

      if (!response.ok) {
        throw new Error('Failed to update work order');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update work order');
    }
  };

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Work Order Management</h1>
        <div className="flex gap-4">
          <ExcelUpload onUploadSuccess={refetch} endpoint="/api/workorder/upload" />
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <PlusCircle size={20} />
            New Work Order
          </button>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {showForm && (
        <div className="mb-8">
          <WorkOrderForm
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <WorkOrderTable 
          workOrders={workOrders || []} 
          refetch={refetch}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
} 