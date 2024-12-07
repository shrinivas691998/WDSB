import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { BOM } from '../types/BOM';

interface BOMTableProps {
  boms: BOM[];
  refetch: () => void;
  onDelete?: (parentPart: string, childPart: string) => Promise<void>;
  onUpdate?: (bom: BOM) => Promise<void>;
}

export function BOMTable({ boms, refetch, onDelete, onUpdate }: BOMTableProps) {
  const handleDelete = async (parentPart: string, childPart: string) => {
    if (window.confirm('Are you sure you want to delete this BOM entry?')) {
      await onDelete?.(parentPart, childPart);
      refetch();
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-700">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Parent Part
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Child Part
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Operation No.
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Required Quantity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {boms.map((bom, index) => (
            <tr key={`${bom.parentPart}-${bom.childPart}-${index}`} className="hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                {bom.parentPart}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                {bom.childPart}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                {bom.opNo}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                {bom.requiredQuantity}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                <div className="flex gap-2">
                  <button
                    onClick={() => onUpdate?.(bom)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(bom.parentPart, bom.childPart)}
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
      {boms.length === 0 && (
        <div className="text-center py-4 text-gray-400 bg-gray-800">
          No BOM entries found
        </div>
      )}
    </div>
  );
} 