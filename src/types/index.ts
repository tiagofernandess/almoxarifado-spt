export type ItemCategory = 'Máquinas VX' | 'Máquinas Digital' | 'Notebook/PC' | 'Suprimentos' | 'Material de Escritório' | 'BANCADAS';

export interface Item {
  id: string;
  code: string;
  name: string;
  category: ItemCategory;
  totalQuantity: number;
  availableQuantity: number;
  inUseQuantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface Seller {
  id: string;
  name: string;
  whatsapp: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface ItemMovement {
  id: string;
  type: 'checkout' | 'return'; // checkout = saída, return = devolução
  responsibleName: string;
  sellerId?: string;
  sellerName?: string;
  date: string;
  items: {
    itemId: string;
    itemName: string;
    itemCode: string;
    quantity: number;
  }[];
}

export interface DashboardStats {
  totalItems: number;
  totalSellers: number;
  totalCheckouts: number;
  totalReturns: number;
  stockByCategory: Record<ItemCategory, number>;
}

export interface LabelTemplate {
  startNumber: number;
  endNumber: number;
  customPhrase: string;
}

export interface User {
  username: string;
  password: string;
}
