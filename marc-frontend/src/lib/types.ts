export type Role = "owner" | "manager" | "engineer" | "accountant";
export const MATERIAL_KEYS = ["bricks", "steel", "cement", "sand", "coarseAggregate", "fineAggregate"] as const;
export type MaterialKey = typeof MATERIAL_KEYS[number];

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  isActive: boolean;
  createdAt?: string;
}

export type Materials = Record<MaterialKey, number>;

export interface Project {
  _id: string;
  projectId: string;
  projectName: string;
  owner: User | string;
  manager: User | string;
  engineer: User | string;
  accountant: User | string;
  budget: number;
  spent: number;
  location: string;
  status: "planning" | "active" | "completed" | "on-hold" | "archived";
  isArchived: boolean;
  allocation: Materials;
  requested: Materials;
  delivered: Materials;
  consumed: Materials;
  unitCost: Materials;
  remainingBudget?: number;
  availableInventory?: Materials;
  remainingAllocation?: Materials;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string | null;
  status: "pending" | "in-progress" | "completed";
  isImportant: boolean;
}

export interface TaskDay {
  _id: string;
  dayNumber: number;
  label: string;
  tasks: Task[];
}

export interface TaskPlan {
  _id: string;
  project: string;
  days: TaskDay[];
}

export interface EngineerReport {
  _id: string;
  project: string;
  engineer: User | string;
  date: string;
  description: string;
  progress: number;
  issues: string;
  resolutions: string;
  materialsUsed: Materials;
}

export interface MaterialOrder {
  _id: string;
  orderId: string;
  project: Project | string | null;
  requestedBy: User | string | null;
  materials: Materials;
  estimatedCost: number;
  status: "requested" | "approved" | "rejected" | "ordered" | "delivered" | "cancelled";
  approvedBy?: User | string | null;
  approvedAt?: string;
  rejectionReason?: string;
  createdAt: string;
}

export interface PurchaseOrder {
  _id: string;
  purchaseOrderId: string;
  materialOrder?: { orderId: string } | string;
  project: Project | string | null;
  placedBy?: User | string | null;
  materials: Materials;
  vendor: { name: string; contact: string; address: string };
  tracking: { trackingNumber: string; estimatedDelivery: string | null; deliveredAt?: string | null };
  totalCost: number;
  status: "placed" | "in-transit" | "delivered" | "cancelled";
  createdAt: string;
}

export const emptyMaterials = (): Materials => ({
  bricks: 0, steel: 0, cement: 0, sand: 0, coarseAggregate: 0, fineAggregate: 0,
});

export const formatMoney = (n: number | undefined) =>
  "$" + (Number(n || 0)).toLocaleString(undefined, { maximumFractionDigits: 2 });
