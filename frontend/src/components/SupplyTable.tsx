import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Supply } from '../types/Supply';

interface SupplyTableProps {
  supplies: Supply[];
  refetch: () => void;
  onDelete?: (supplyNo: string) => Promise<void>;
  onUpdate?: (supply: Supply) => Promise<void>;
}

export function SupplyTable({ supplies, refetch, onDelete, onUpdate }: SupplyTableProps) {
  const handleDelete = async (supplyNo: string) => {
    if (window.confirm('Are you sure you want to delete this supply?')) {
      await onDelete?.(supplyNo);
      refetch();
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-700">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Supply No.
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Part No.
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Supply Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Quantity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {supplies.map((supply) => (
            <tr key={supply.supplyNo} className="hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                {supply.supplyNo}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                {supply.partNo}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                {new Date(supply.supplyDate).toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                {supply.quantity}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                <div className="flex gap-2">
                  <button
                    onClick={() => onUpdate?.(supply)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(supply.supplyNo)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {supplies.length === 0 && (
        <div className="text-center py-4 text-gray-400 bg-gray-800">
          No supplies found
        </div>
      )}
    </div>
  );
} 