export interface WorkOrder {
  workOrderNo: string;
  machineNo: string;
  operatorName: string;
  orderQty: number;
  completedQty: number;
  remainingQty?: number;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}