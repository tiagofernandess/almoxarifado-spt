import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Item, Seller, Responsible, ItemMovement } from '@/types';

export function useSupabase() {
  // Autenticação
  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.includes('@') ? email : `${email}@sorte-paratodos.com`,
      password,
    });
    if (error) throw error;
    return data;
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  // Itens
  const getItems = useCallback(async (): Promise<Item[]> => {
    const { data, error } = await supabase
      .from('items')
      .select('*');
    if (error) throw error;
    return data.map((item: any) => ({
      id: item.id,
      code: item.code,
      name: item.name,
      category: item.category,
      totalQuantity: item.total_quantity,
      availableQuantity: item.available_quantity,
      inUseQuantity: item.in_use_quantity,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
  }, []);

  const createItem = useCallback(async (item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>) => {
    const { data, error } = await supabase
      .from('items')
      .insert([{
        code: item.code,
        name: item.name,
        category: item.category,
        total_quantity: item.totalQuantity,
        available_quantity: item.availableQuantity,
        in_use_quantity: item.inUseQuantity
      }])
      .select()
      .single();
    if (error) throw error;
    return {
      id: data.id,
      code: data.code,
      name: data.name,
      category: data.category,
      totalQuantity: data.total_quantity,
      availableQuantity: data.available_quantity,
      inUseQuantity: data.in_use_quantity,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }, []);

  const updateItem = useCallback(async (id: string, item: Partial<Item>) => {
    try {
      const { data, error } = await supabase
        .from('items')
        .update({
          ...(item.code && { code: item.code }),
          ...(item.name && { name: item.name }),
          ...(item.category && { category: item.category }),
          ...(item.totalQuantity !== undefined && { total_quantity: item.totalQuantity }),
          ...(item.availableQuantity !== undefined && { available_quantity: item.availableQuantity }),
          ...(item.inUseQuantity !== undefined && { in_use_quantity: item.inUseQuantity })
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        code: data.code,
        name: data.name,
        category: data.category,
        totalQuantity: data.total_quantity,
        availableQuantity: data.available_quantity,
        inUseQuantity: data.in_use_quantity,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
      throw error;
    }
  }, []);

  const deleteItem = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }, []);

  // Vendedores
  const getSellers = useCallback(async (): Promise<Seller[]> => {
    const { data, error } = await supabase
      .from('sellers')
      .select('*');
    if (error) throw error;
    return data;
  }, []);

  const createSeller = useCallback(async (seller: Omit<Seller, 'id' | 'createdAt' | 'updatedAt'>) => {
    const { data, error } = await supabase
      .from('sellers')
      .insert([seller])
      .select()
      .single();
    if (error) throw error;
    return data;
  }, []);

  const updateSeller = useCallback(async (id: string, seller: Partial<Seller>) => {
    const { data, error } = await supabase
      .from('sellers')
      .update(seller)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }, []);

  const deleteSeller = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('sellers')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }, []);

  // Responsáveis
  const getResponsibles = useCallback(async (): Promise<Responsible[]> => {
    const { data, error } = await supabase
      .from('responsibles')
      .select('*');
    if (error) throw error;
    return data;
  }, []);

  const createResponsible = useCallback(async (responsible: Omit<Responsible, 'id' | 'createdAt' | 'updatedAt'>) => {
    const { data, error } = await supabase
      .from('responsibles')
      .insert([responsible])
      .select()
      .single();
    if (error) throw error;
    return data;
  }, []);

  const updateResponsible = useCallback(async (id: string, responsible: Partial<Responsible>) => {
    const { data, error } = await supabase
      .from('responsibles')
      .update(responsible)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }, []);

  const deleteResponsible = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('responsibles')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }, []);

  // Movimentações
  const getMovements = useCallback(async (): Promise<ItemMovement[]> => {
    try {
      const { data, error } = await supabase
        .from('item_movements')
        .select(`
          *,
          movement_items (*)
        `);
      if (error) throw error;
      
      return data.map((movement: any) => ({
        id: movement.id,
        type: movement.type,
        responsibleName: movement.responsible_name,
        sellerId: movement.seller_id,
        sellerName: movement.seller_name,
        date: movement.date,
        pontoNovo: movement.ponto_novo || false,
        items: movement.movement_items.map((item: any) => ({
          itemId: item.item_id,
          itemName: item.item_name,
          itemCode: item.item_code,
          quantity: item.quantity
        }))
      }));
    } catch (error) {
      console.error('Erro ao buscar movimentações:', error);
      throw new Error('Não foi possível carregar as movimentações.');
    }
  }, []);

  const createMovement = useCallback(async (movement: Omit<ItemMovement, 'id'>) => {
    try {
      // Validações
      if (!movement.responsibleName?.trim()) {
        throw new Error('O nome do responsável é obrigatório.');
      }

      if (!movement.items?.length) {
        throw new Error('É necessário incluir pelo menos um item.');
      }

      for (const item of movement.items) {
        if (!item.itemId || !item.quantity || item.quantity <= 0) {
          throw new Error('Dados inválidos para um ou mais itens.');
        }
      }

      // Iniciar transação
      const { data: movementData, error: movementError } = await supabase
        .from('item_movements')
        .insert([{
          type: movement.type,
          responsible_name: movement.responsibleName,
          seller_id: movement.sellerId,
          seller_name: movement.sellerName,
          date: movement.date,
          ponto_novo: movement.pontoNovo || false,
        }])
        .select()
        .single();

      if (movementError) {
        throw new Error('Erro ao criar movimentação: ' + movementError.message);
      }

      const movementItems = movement.items.map(item => ({
        movement_id: movementData.id,
        item_id: item.itemId,
        item_name: item.itemName,
        item_code: item.itemCode,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('movement_items')
        .insert(movementItems);

      if (itemsError) {
        // Se houver erro ao inserir os itens, tentar reverter a movimentação
        await supabase
          .from('item_movements')
          .delete()
          .eq('id', movementData.id);
          
        throw new Error('Erro ao registrar itens da movimentação: ' + itemsError.message);
      }

      return {
        id: movementData.id,
        type: movementData.type,
        responsibleName: movementData.responsible_name,
        sellerId: movementData.seller_id,
        sellerName: movementData.seller_name,
        date: movementData.date,
        pontoNovo: movementData.ponto_novo || false,
        items: movement.items,
      };
    } catch (error: any) {
      console.error('Erro na movimentação:', error);
      throw new Error(error.message || 'Erro ao processar a movimentação.');
    }
  }, []);

  const updateMovement = useCallback(async (id: string, movement: Partial<ItemMovement>) => {
    try {
      const { data, error } = await supabase
        .from('item_movements')
        .update({
          ...(movement.sellerId && { seller_id: movement.sellerId }),
          ...(movement.sellerName && { seller_name: movement.sellerName }),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        type: data.type,
        responsibleName: data.responsible_name,
        sellerId: data.seller_id,
        sellerName: data.seller_name,
        date: data.date,
        items: movement.items || [],
      };
    } catch (error: any) {
      console.error('Erro ao atualizar movimentação:', error);
      throw new Error(error.message || 'Erro ao atualizar a movimentação.');
    }
  }, []);

  const deleteMovement = useCallback(async (id: string) => {
    try {
      // Primeiro, excluir os itens da movimentação (devido à foreign key)
      const { error: itemsError } = await supabase
        .from('movement_items')
        .delete()
        .eq('movement_id', id);

      if (itemsError) {
        throw new Error('Erro ao excluir itens da movimentação: ' + itemsError.message);
      }

      // Depois, excluir a movimentação
      const { error: movementError } = await supabase
        .from('item_movements')
        .delete()
        .eq('id', id);

      if (movementError) {
        throw new Error('Erro ao excluir movimentação: ' + movementError.message);
      }
    } catch (error: any) {
      console.error('Erro ao excluir movimentação:', error);
      throw new Error(error.message || 'Erro ao excluir a movimentação.');
    }
  }, []);

  return {
    // Auth
    signIn,
    signOut,
    
    // Items
    getItems,
    createItem,
    updateItem,
    deleteItem,
    
    // Sellers
    getSellers,
    createSeller,
    updateSeller,
    deleteSeller,
    
    // Responsibles
    getResponsibles,
    createResponsible,
    updateResponsible,
    deleteResponsible,
    
    // Movements
    getMovements,
    createMovement,
    updateMovement,
    deleteMovement,
  };
} 