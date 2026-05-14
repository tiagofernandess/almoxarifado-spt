
import { Item, ItemMovement, Seller } from "@/types";

// Helper for localStorage
const storage = {
  getItems: (): Item[] => {
    const items = localStorage.getItem('sorte-items');
    return items ? JSON.parse(items) : [];
  },
  
  setItems: (items: Item[]) => {
    localStorage.setItem('sorte-items', JSON.stringify(items));
  },
  
  getSellers: (): Seller[] => {
    const sellers = localStorage.getItem('sorte-sellers');
    return sellers ? JSON.parse(sellers) : [];
  },
  
  setSellers: (sellers: Seller[]) => {
    localStorage.setItem('sorte-sellers', JSON.stringify(sellers));
  },
  
  getMovements: (): ItemMovement[] => {
    const movements = localStorage.getItem('sorte-movements');
    return movements ? JSON.parse(movements) : [];
  },
  
  setMovements: (movements: ItemMovement[]) => {
    localStorage.setItem('sorte-movements', JSON.stringify(movements));
  }
};

export default storage;
