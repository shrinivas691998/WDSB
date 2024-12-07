import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { WorkOrder } from '../types/WorkOrder';
import { WorkOrderForm } from './WorkOrderForm';

interface WorkOrderTableProps {
  workOrders: WorkOrder[];
  refetch: () => void;
  onDelete: (workOrderNo: string) => Promise<void>;
  onUpdate: (workOrder: WorkOrder) => Promise<void>;
}

export function WorkOrderTable({ workOrders, refetch, onDelete, onUpdate }: WorkOrderTableProps) {
  const [editingWorkOrder, setEditingWorkOrder] = useState<WorkOrder | null>(null);

  const handleDelete = async (workOrderNo: string) => {
    if (window.confirm('Are you sure you want to delete this work order?')) {
      await onDelete(workOrderNo);
      refetch();
    }
  };

  const handleUpdate = async (workOrder: WorkOrder) => {
    await onUpdate(workOrder);
    setEditingWorkOrder(null);
    refetch();
  };

  if (editingWorkOrder) {
    return (
      <WorkOrderForm
        initialData={editingWorkOrder}
        onSubmit={handleUpdate}
        onCancel={() => setEditingWorkOrder(null)}
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-700">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Work Order No.
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Machine No.
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Operator Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Order Qty
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Completed Qty
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Remaining Qty
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {workOrders.map((workOrder) => {
            const remainingQty = workOrder.orderQty - workOrder.completedQty;
            const remainingQtyColor = remainingQty < 0 ? 'text-red-400' : remainingQty === 0 ? 'text-green-400' : 'text-gray-200';
            
            return (
              <tr key={workOrder.workOrderNo} className="hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                  {workOrder.workOrderNo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                  {workOrder.machineNo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                  {workOrder.operatorName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                  {workOrder.orderQty}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                  {workOrder.completedQty}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${remainingQtyColor} font-medium`}>
                  {remainingQty}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingWorkOrder(workOrder)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(workOrder.workOrderNo)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {workOrders.length === 0 && (
        <div className="text-center py-4 text-gray-400 bg-gray-800">
          No work orders found
        </div>
      )}
    </div>
  );
}