import React from 'react';
import { useForm } from 'react-hook-form';
import { Supply } from '../types/Supply';

interface SupplyFormProps {
  onSubmit: (supply: Supply) => void;
  onCancel: () => void;
}

export function SupplyForm({ onSubmit, onCancel }: SupplyFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<Supply>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-200">
            Supply No.
          </label>
          <input
            {...register('supplyNo', { required: 'Supply No. is required' })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.supplyNo && (
            <p className="mt-1 text-sm text-red-400">{errors.supplyNo.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200">
            Part No.
          </label>
          <input
            {...register('partNo', { required: 'Part No. is required' })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.partNo && (
            <p className="mt-1 text-sm text-red-400">{errors.partNo.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200">
            Supply Date
          </label>
          <input
            type="datetime-local"
            {...register('supplyDate', { required: 'Supply Date is required' })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.supplyDate && (
            <p className="mt-1 text-sm text-red-400">{errors.supplyDate.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200">
            Quantity
          </label>
          <input
            type="number"
            step="0.01"
            {...register('quantity', { 
              required: 'Quantity is required',
              min: { value: 0, message: 'Quantity must be positive' }
            })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.quantity && (
            <p className="mt-1 text-sm text-red-400">{errors.quantity.message}</p>
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
          Save
        </button>
      </div>
    </form>
  );
} 