import React from 'react';
import { useForm } from 'react-hook-form';
import { BOM } from '../types/BOM';

interface BOMFormProps {
  onSubmit: (bom: BOM) => void;
  onCancel: () => void;
}

export function BOMForm({ onSubmit, onCancel }: BOMFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<BOM>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-200">
            Parent Part
          </label>
          <input
            {...register('parentPart', { required: 'Parent Part is required' })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.parentPart && (
            <p className="mt-1 text-sm text-red-400">{errors.parentPart.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200">
            Child Part
          </label>
          <input
            {...register('childPart', { required: 'Child Part is required' })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.childPart && (
            <p className="mt-1 text-sm text-red-400">{errors.childPart.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200">
            Operation No.
          </label>
          <input
            type="number"
            {...register('opNo', { 
              required: 'Operation No. is required',
              min: { value: 0, message: 'Operation No. must be positive' }
            })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.opNo && (
            <p className="mt-1 text-sm text-red-400">{errors.opNo.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200">
            Required Quantity
          </label>
          <input
            type="number"
            step="0.01"
            {...register('requiredQuantity', { 
              required: 'Required Quantity is required',
              min: { value: 0, message: 'Required Quantity must be positive' }
            })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.requiredQuantity && (
            <p className="mt-1 text-sm text-red-400">{errors.requiredQuantity.message}</p>
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