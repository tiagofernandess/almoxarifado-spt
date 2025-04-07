
import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { Item, ItemMovement, Seller, DashboardStats, ItemCategory } from "@/types";
import storage from "@/lib/storage";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";

interface AppContextType {
  items: Item[];
  sellers: Seller[];
  movements: ItemMovement[];
  stats: DashboardStats;
  
  // Item Methods
  addItem: (item: Omit<Item, "id" | "createdAt" | "updatedAt">) => void;
  updateItem: (id: string, item: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  
  // Seller Methods
  addSeller: (seller: Omit<Seller, "id" | "createdAt" | "updatedAt">) => void;
  updateSeller: (id: string, seller: Partial<Seller>) => void;
  deleteSeller: (id: string) => void;
  
  // Movements Methods
  addCheckout: (checkout: Omit<ItemMovement, "id" | "type" | "date">) => void;
  addReturn: (returnItem: Omit<ItemMovement, "id" | "type" | "date">) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [items, setItems] = useState<Item[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [movements, setMovements] = useState<ItemMovement[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalItems: 0,
    totalSellers: 0,
    totalCheckouts: 0,
    totalReturns: 0,
    stockByCategory: {
      "Máquinas VX": 0,
      "Máquinas Digital": 0,
      "Notebook/PC": 0,
      "Suprimentos": 0,
      "Material de Escritório": 0
    }
  });
  
  // Load data from localStorage on component mount
  useEffect(() => {
    setItems(storage.getItems());
    setSellers(storage.getSellers());
    setMovements(storage.getMovements());
  }, []);
  
  // Calculate dashboard stats whenever items, sellers or movements change
  useEffect(() => {
    const checkouts = movements.filter(m => m.type === 'checkout').length;
    const returns = movements.filter(m => m.type === 'return').length;
    
    const stockByCategory: Record<ItemCategory, number> = {
      "Máquinas VX": 0,
      "Máquinas Digital": 0,
      "Notebook/PC": 0,
      "Suprimentos": 0,
      "Material de Escritório": 0
    };
    
    items.forEach(item => {
      stockByCategory[item.category] += item.availableQuantity;
    });
    
    setStats({
      totalItems: items.length,
      totalSellers: sellers.length,
      totalCheckouts: checkouts,
      totalReturns: returns,
      stockByCategory
    });
  }, [items, sellers, movements]);
  
  // Save to localStorage whenever data changes
  useEffect(() => {
    storage.setItems(items);
  }, [items]);
  
  useEffect(() => {
    storage.setSellers(sellers);
  }, [sellers]);
  
  useEffect(() => {
    storage.setMovements(movements);
  }, [movements]);
  
  // Item operations
  const addItem = (newItem: Omit<Item, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const item: Item = {
      ...newItem,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now
    };
    
    setItems(prev => [...prev, item]);
    toast({
      title: "Item adicionado",
      description: `${newItem.name} foi adicionado ao estoque.`
    });
  };
  
  const updateItem = (id: string, updatedItem: Partial<Item>) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, ...updatedItem, updatedAt: new Date().toISOString() }
          : item
      )
    );
    
    toast({
      title: "Item atualizado",
      description: "As alterações foram salvas."
    });
  };
  
  const deleteItem = (id: string) => {
    // Check if item is in use
    const itemToDelete = items.find(item => item.id === id);
    if (itemToDelete && itemToDelete.inUseQuantity > 0) {
      toast({
        title: "Erro ao excluir",
        description: "Não é possível excluir um item que está em uso.",
        variant: "destructive"
      });
      return;
    }
    
    setItems(prev => prev.filter(item => item.id !== id));
    
    toast({
      title: "Item excluído",
      description: "O item foi removido do estoque."
    });
  };
  
  // Seller operations
  const addSeller = (newSeller: Omit<Seller, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const seller: Seller = {
      ...newSeller,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now
    };
    
    setSellers(prev => [...prev, seller]);
    toast({
      title: "Vendedor adicionado",
      description: `${newSeller.name} foi adicionado à lista de vendedores.`
    });
  };
  
  const updateSeller = (id: string, updatedSeller: Partial<Seller>) => {
    setSellers(prev =>
      prev.map(seller =>
        seller.id === id
          ? { ...seller, ...updatedSeller, updatedAt: new Date().toISOString() }
          : seller
      )
    );
    
    toast({
      title: "Vendedor atualizado",
      description: "As alterações foram salvas."
    });
  };
  
  const deleteSeller = (id: string) => {
    // Check if seller is associated with any movement
    const sellerHasMovements = movements.some(movement => movement.sellerId === id);
    
    if (sellerHasMovements) {
      toast({
        title: "Erro ao excluir",
        description: "Este vendedor possui movimentações associadas e não pode ser excluído.",
        variant: "destructive"
      });
      return;
    }
    
    setSellers(prev => prev.filter(seller => seller.id !== id));
    toast({
      title: "Vendedor excluído",
      description: "O vendedor foi removido do sistema."
    });
  };
  
  // Movement operations
  const addCheckout = (checkout: Omit<ItemMovement, "id" | "type" | "date">) => {
    const movement: ItemMovement = {
      ...checkout,
      id: uuidv4(),
      type: 'checkout',
      date: new Date().toISOString()
    };
    
    setMovements(prev => [...prev, movement]);
    
    // Update item quantities
    checkout.items.forEach(({ itemId, quantity }) => {
      setItems(prev =>
        prev.map(item => {
          if (item.id === itemId) {
            return {
              ...item,
              availableQuantity: item.availableQuantity - quantity,
              inUseQuantity: item.inUseQuantity + quantity,
              updatedAt: new Date().toISOString()
            };
          }
          return item;
        })
      );
    });
    
    toast({
      title: "Saída registrada",
      description: "Os itens foram atualizados no estoque."
    });
  };
  
  const addReturn = (returnItem: Omit<ItemMovement, "id" | "type" | "date">) => {
    const movement: ItemMovement = {
      ...returnItem,
      id: uuidv4(),
      type: 'return',
      date: new Date().toISOString()
    };
    
    setMovements(prev => [...prev, movement]);
    
    // Update item quantities
    returnItem.items.forEach(({ itemId, quantity }) => {
      setItems(prev =>
        prev.map(item => {
          if (item.id === itemId) {
            return {
              ...item,
              availableQuantity: item.availableQuantity + quantity,
              inUseQuantity: item.inUseQuantity - quantity,
              updatedAt: new Date().toISOString()
            };
          }
          return item;
        })
      );
    });
    
    toast({
      title: "Devolução registrada",
      description: "Os itens foram atualizados no estoque."
    });
  };
  
  return (
    <AppContext.Provider
      value={{
        items,
        sellers,
        movements,
        stats,
        addItem,
        updateItem,
        deleteItem,
        addSeller,
        updateSeller,
        deleteSeller,
        addCheckout,
        addReturn
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  
  return context;
}
