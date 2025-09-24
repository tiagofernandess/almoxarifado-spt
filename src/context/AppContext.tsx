import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { Item, ItemMovement, Seller, Responsible, DashboardStats, ItemCategory } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { useSupabase } from "@/hooks/useSupabase";

interface AppContextType {
  items: Item[];
  sellers: Seller[];
  responsibles: Responsible[];
  movements: ItemMovement[];
  stats: DashboardStats;
  loading: boolean;
  
  // Item Methods
  addItem: (item: Omit<Item, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateItem: (id: string, item: Partial<Item>) => Promise<Item>;
  deleteItem: (id: string) => Promise<void>;
  
  // Seller Methods
  addSeller: (seller: Omit<Seller, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateSeller: (id: string, seller: Partial<Seller>) => Promise<void>;
  deleteSeller: (id: string) => Promise<void>;
  
  // Responsible Methods
  addResponsible: (responsible: Omit<Responsible, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateResponsible: (id: string, responsible: Partial<Responsible>) => Promise<void>;
  deleteResponsible: (id: string) => Promise<void>;
  
  // Movements Methods
  addCheckout: (checkout: Omit<ItemMovement, "id" | "type">) => Promise<ItemMovement>;
  addReturn: (returnItem: Omit<ItemMovement, "id" | "type">) => Promise<ItemMovement>;
  updateMovement: (id: string, movement: Partial<ItemMovement>) => Promise<ItemMovement>;
  deleteMovement: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const supabase = useSupabase();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Item[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [responsibles, setResponsibles] = useState<Responsible[]>([]);
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
      "Material de Escritório": 0,
      "Bancadas": 0,
      "Chips": 0
    }
  });
  
  // Carregar dados iniciais
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [itemsData, sellersData, responsiblesData, movementsData] = await Promise.all([
          supabase.getItems(),
          supabase.getSellers(),
          supabase.getResponsibles(),
          supabase.getMovements()
        ]);
        
        setItems(itemsData);
        setSellers(sellersData);
        setResponsibles(responsiblesData);
        setMovements(movementsData);
      } catch (error: any) {
        toast({
          title: "Erro ao carregar dados",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Atualizar estatísticas
  useEffect(() => {
    const checkouts = movements.filter(m => m.type === 'checkout').length;
    const returns = movements.filter(m => m.type === 'return').length;
    
    const stockByCategory: Record<ItemCategory, number> = {
      "Máquinas VX": 0,
      "Máquinas Digital": 0,
      "Notebook/PC": 0,
      "Suprimentos": 0,
      "Material de Escritório": 0,
      "Bancadas": 0,
      "Chips": 0
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
  
  const addItem = async (newItem: Omit<Item, "id" | "createdAt" | "updatedAt">) => {
    try {
      const item = await supabase.createItem(newItem);
    setItems(prev => [...prev, item]);
    toast({
      title: "Item adicionado",
      description: `${newItem.name} foi adicionado ao estoque.`
    });
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar item",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };
  
  const updateItem = async (id: string, updatedItem: Partial<Item>) => {
    try {
      const item = await supabase.updateItem(id, updatedItem);
      setItems(prev =>
        prev.map(i => i.id === id ? item : i)
      );
      toast({
        title: "Item atualizado",
        description: "As alterações foram salvas."
      });
      return item;
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar item",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };
  
  const deleteItem = async (id: string) => {
    const itemToDelete = items.find(item => item.id === id);
    if (itemToDelete && itemToDelete.inUseQuantity > 0) {
      toast({
        title: "Erro ao excluir",
        description: "Não é possível excluir um item que está em uso.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await supabase.deleteItem(id);
    setItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Item excluído",
      description: "O item foi removido do estoque."
    });
    } catch (error: any) {
      toast({
        title: "Erro ao excluir item",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };
  
  const addSeller = async (newSeller: Omit<Seller, "id" | "createdAt" | "updatedAt">) => {
    try {
      const seller = await supabase.createSeller(newSeller);
    setSellers(prev => [...prev, seller]);
    toast({
      title: "Vendedor adicionado",
      description: `${newSeller.name} foi adicionado à lista de vendedores.`
    });
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar vendedor",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };
  
  const updateSeller = async (id: string, updatedSeller: Partial<Seller>) => {
    try {
      const seller = await supabase.updateSeller(id, updatedSeller);
    setSellers(prev =>
        prev.map(s => s.id === id ? seller : s)
      );
    toast({
      title: "Vendedor atualizado",
      description: "As alterações foram salvas."
    });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar vendedor",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };
  
  const deleteSeller = async (id: string) => {
    const sellerHasMovements = movements.some(movement => movement.sellerId === id);
    
    if (sellerHasMovements) {
      toast({
        title: "Erro ao excluir",
        description: "Este vendedor possui movimentações associadas e não pode ser excluído.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await supabase.deleteSeller(id);
    setSellers(prev => prev.filter(seller => seller.id !== id));
    toast({
      title: "Vendedor excluído",
      description: "O vendedor foi removido do sistema."
    });
    } catch (error: any) {
      toast({
        title: "Erro ao excluir vendedor",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };
  
  const addResponsible = async (newResponsible: Omit<Responsible, "id" | "createdAt" | "updatedAt">) => {
    try {
      const responsible = await supabase.createResponsible(newResponsible);
    setResponsibles(prev => [...prev, responsible]);
    toast({
      title: "Responsável adicionado",
      description: `${newResponsible.name} foi adicionado à lista de responsáveis.`
    });
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar responsável",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };
  
  const updateResponsible = async (id: string, updatedResponsible: Partial<Responsible>) => {
    try {
      const responsible = await supabase.updateResponsible(id, updatedResponsible);
    setResponsibles(prev =>
        prev.map(r => r.id === id ? responsible : r)
      );
    toast({
      title: "Responsável atualizado",
      description: "As alterações foram salvas."
    });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar responsável",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };
  
  const deleteResponsible = async (id: string) => {
    const responsibleHasMovements = movements.some(movement => movement.responsibleName === responsibles.find(r => r.id === id)?.name);
    
    if (responsibleHasMovements) {
      toast({
        title: "Erro ao excluir",
        description: "Este responsável possui movimentações associadas e não pode ser excluído.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await supabase.deleteResponsible(id);
    setResponsibles(prev => prev.filter(responsible => responsible.id !== id));
    toast({
      title: "Responsável excluído",
      description: "O responsável foi removido do sistema."
    });
    } catch (error: any) {
      toast({
        title: "Erro ao excluir responsável",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };
  
  const addCheckout = async (checkout: Omit<ItemMovement, "id" | "type">) => {
    try {
      // Validações
      if (!checkout.responsibleName?.trim()) {
        throw new Error('O nome do responsável é obrigatório.');
      }

      if (!checkout.items?.length) {
        throw new Error('É necessário incluir pelo menos um item.');
      }

      // Validar disponibilidade dos itens
      for (const checkoutItem of checkout.items) {
        const currentItem = items.find(i => i.id === checkoutItem.itemId);
        if (!currentItem) {
          throw new Error(`Item ${checkoutItem.itemCode} não encontrado.`);
        }
        if (checkoutItem.quantity > currentItem.availableQuantity) {
          throw new Error(`Quantidade insuficiente para o item ${currentItem.name}.`);
        }
        if (checkoutItem.quantity <= 0) {
          throw new Error(`Quantidade inválida para o item ${currentItem.name}.`);
        }
      }

      // Criar a movimentação
      const movement = await supabase.createMovement({
        ...checkout,
        type: "checkout",
        date: checkout.date || new Date().toISOString()
      });
      
      // Atualizar quantidades dos itens
      const updatedItems = await Promise.all(
        checkout.items.map(async (item) => {
          const currentItem = items.find(i => i.id === item.itemId);
          if (currentItem) {
            return await updateItem(item.itemId, {
              availableQuantity: currentItem.availableQuantity - item.quantity,
              inUseQuantity: currentItem.inUseQuantity + item.quantity
            });
          }
          return null;
        })
      );

      // Atualizar o estado dos itens
      setItems(prev =>
        prev.map(item => {
          const updated = updatedItems.find(u => u?.id === item.id);
          return updated || item;
        })
      );
      
      // Atualizar o estado das movimentações
      setMovements(prev => [...prev, movement]);
    
    toast({
      title: "Saída registrada",
        description: "Os itens foram registrados como em uso."
      });

      return movement;
    } catch (error: any) {
      toast({
        title: "Erro ao registrar saída",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };
  
  const addReturn = async (returnItem: Omit<ItemMovement, "id" | "type">) => {
    try {
      // Validações
      if (!returnItem.responsibleName?.trim()) {
        throw new Error('O nome do responsável é obrigatório.');
      }

      if (!returnItem.items?.length) {
        throw new Error('É necessário incluir pelo menos um item.');
      }

      // Validar disponibilidade dos itens para devolução
      for (const item of returnItem.items) {
        const currentItem = items.find(i => i.id === item.itemId);
        if (!currentItem) {
          throw new Error(`Item ${item.itemCode} não encontrado.`);
        }
        if (item.quantity > currentItem.inUseQuantity) {
          throw new Error(`Quantidade inválida para devolução do item ${currentItem.name}.`);
        }
        if (item.quantity <= 0) {
          throw new Error(`Quantidade inválida para o item ${currentItem.name}.`);
        }
      }

      // Criar a movimentação
      const movement = await supabase.createMovement({
        ...returnItem,
        type: "return",
        date: returnItem.date || new Date().toISOString()
      });
      
      // Atualizar quantidades dos itens
      const updatedItems = await Promise.all(
        returnItem.items.map(async (item) => {
          const currentItem = items.find(i => i.id === item.itemId);
          if (currentItem) {
            return await updateItem(item.itemId, {
              availableQuantity: currentItem.availableQuantity + item.quantity,
              inUseQuantity: currentItem.inUseQuantity - item.quantity
            });
          }
          return null;
        })
      );

      // Atualizar o estado dos itens
      setItems(prev =>
        prev.map(item => {
          const updated = updatedItems.find(u => u?.id === item.id);
          return updated || item;
        })
      );
      
      // Atualizar o estado das movimentações
      setMovements(prev => [...prev, movement]);
    
    toast({
      title: "Devolução registrada",
        description: "Os itens foram devolvidos ao estoque."
      });

      return movement;
    } catch (error: any) {
      toast({
        title: "Erro ao registrar devolução",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };
  
  const updateMovement = async (id: string, movement: Partial<ItemMovement>) => {
    try {
      const updatedMovement = await supabase.updateMovement(id, movement);
      
      // Atualizar o estado das movimentações
      setMovements(prev =>
        prev.map(m => m.id === id ? updatedMovement : m)
      );
      
      toast({
        title: "Movimentação atualizada",
        description: "O vendedor foi atualizado com sucesso."
      });

      return updatedMovement;
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar movimentação",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteMovement = async (id: string) => {
    try {
      const movementToDelete = movements.find(m => m.id === id);
      if (!movementToDelete) {
        throw new Error('Movimentação não encontrada.');
      }

      // Primeiro, reverter as quantidades dos itens
      if (movementToDelete.type === 'checkout') {
        // Se era uma saída, devolver os itens ao estoque
        for (const item of movementToDelete.items) {
          const currentItem = items.find(i => i.id === item.itemId);
          if (currentItem) {
            await updateItem(item.itemId, {
              availableQuantity: currentItem.availableQuantity + item.quantity,
              inUseQuantity: currentItem.inUseQuantity - item.quantity
            });
          }
        }
      } else if (movementToDelete.type === 'return') {
        // Se era uma devolução, remover os itens do estoque novamente
        for (const item of movementToDelete.items) {
          const currentItem = items.find(i => i.id === item.itemId);
          if (currentItem) {
            await updateItem(item.itemId, {
              availableQuantity: currentItem.availableQuantity - item.quantity,
              inUseQuantity: currentItem.inUseQuantity + item.quantity
            });
          }
        }
      }

      // Excluir a movimentação do banco
      await supabase.deleteMovement(id);
      
      // Atualizar o estado das movimentações
      setMovements(prev => prev.filter(m => m.id !== id));
      
      toast({
        title: "Movimentação excluída",
        description: "A movimentação foi removida e as quantidades dos itens foram revertidas."
      });
    } catch (error: any) {
      toast({
        title: "Erro ao excluir movimentação",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };
  
  return (
    <AppContext.Provider
      value={{
        items,
        sellers,
        responsibles,
        movements,
        stats,
        loading,
        addItem,
        updateItem,
        deleteItem,
        addSeller,
        updateSeller,
        deleteSeller,
        addResponsible,
        updateResponsible,
        deleteResponsible,
        addCheckout,
        addReturn,
        updateMovement,
        deleteMovement
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
