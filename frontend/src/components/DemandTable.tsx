import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Demand } from '../types/Demand';

interface DemandTableProps {
  demands: Demand[];
  refetch: () => void;
  onDelete?: (demandNo: string) => Promise<void>;
  onUpdate?: (demand: Demand) => Promise<void>;
}

export function DemandTable({ demands, refetch, onDelete, onUpdate }: DemandTableProps) {
  const handleDelete = async (demandNo: string) => {
    if (window.confirm('Are you sure you want to delete this demand?')) {
      await onDelete?.(demandNo);
      refetch();
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-700">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Demand No.
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Part No.
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Demand Date
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
          {demands.map((demand) => (
            <tr key={demand.demandNo} className="hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                {demand.demandNo}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                {demand.partNo}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                {new Date(demand.demandDate).toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                {demand.quantity}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                <div className="flex gap-2">
                  <button
                    onClick={() => onUpdate?.(demand)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(demand.demandNo)}
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
      {demands.length === 0 && (
        <div className="text-center py-4 text-gray-400 bg-gray-800">
          No demands found
        </div>
      )}
    </div>
  );
} 