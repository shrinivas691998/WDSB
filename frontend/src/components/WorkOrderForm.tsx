import React from 'react';
import { useForm } from 'react-hook-form';
import { WorkOrder } from '../types/WorkOrder';

interface WorkOrderFormProps {
  onSubmit: (workOrder: WorkOrder) => void;
  onCancel: () => void;
  initialData?: WorkOrder;
}

export function WorkOrderForm({ onSubmit, onCancel, initialData }: WorkOrderFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<WorkOrder>({
    defaultValues: initialData
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-200">
            Work Order No.
          </label>
          <input
            {...register('workOrderNo', { required: 'Work Order No. is required' })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.workOrderNo && (
            <p className="mt-1 text-sm text-red-400">{errors.workOrderNo.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200">
            Machine No.
          </label>
          <input
            {...register('machineNo', { required: 'Machine No. is required' })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.machineNo && (
            <p className="mt-1 text-sm text-red-400">{errors.machineNo.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200">
            Operator Name
          </label>
          <input
            {...register('operatorName', { required: 'Operator Name is required' })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.operatorName && (
            <p className="mt-1 text-sm text-red-400">{errors.operatorName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200">
            Order Quantity
          </label>
          <input
            type="number"
            {...register('orderQty', { 
              required: 'Order Quantity is required',
              min: { value: 1, message: 'Order Quantity must be at least 1' }
            })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.orderQty && (
            <p className="mt-1 text-sm text-red-400">{errors.orderQty.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200">
            Completed Quantity
          </label>
          <input
            type="number"
            {...register('completedQty', { 
              required: 'Completed Quantity is required',
              min: { value: 0, message: 'Completed Quantity cannot be negative' }
            })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.completedQty && (
            <p className="mt-1 text-sm text-red-400">{errors.completedQty.message}</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-600 rounded-md text-gray-200 hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {initialData ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}