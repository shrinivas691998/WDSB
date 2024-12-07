export interface Demand {
  demandNo: string;
  partNo: string;
  demandDate: string;
  quantity: number;
}

export interface Supply {
  supplyNo: string;
  partNo: string;
  supplyDate: string;
  quantity: number;
}

export interface BOM {
  parentPart: string;
  childPart: string;
  opNo: number;
  requiredQuantity: number;
}

export interface WorkOrder {
  workOrderNo: string;
  partNo: string;
  quantity: number;
  startDate: string;
  endDate: string;
  status: 'Open' | 'In Progress' | 'Completed' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High';
  description?: string;
} 