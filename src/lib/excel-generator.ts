
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Item, ItemMovement } from "@/types";

const formatDate = (dateString: string) => {
  return format(new Date(dateString), "dd/MM/yyyy HH:mm", {
    locale: ptBR,
  });
};

// Gerar relatório de estoque em Excel
export const generateInventoryExcel = (items: Item[]) => {
  const worksheet = XLSX.utils.json_to_sheet(
    items.map(item => ({
      Código: item.code,
      Nome: item.name,
      Categoria: item.category,
      "Quantidade Total": item.totalQuantity,
      "Quantidade Disponível": item.availableQuantity,
      "Em Uso": item.inUseQuantity,
      "Criado em": formatDate(item.createdAt),
      "Atualizado em": formatDate(item.updatedAt)
    }))
  );
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Estoque");
  
  // Ajusta largura das colunas
  const columnsWidth = [
    { wch: 10 }, // Código
    { wch: 30 }, // Nome
    { wch: 20 }, // Categoria
    { wch: 15 }, // Quantidade Total
    { wch: 15 }, // Quantidade Disponível
    { wch: 10 }, // Em Uso
    { wch: 20 }, // Criado em
    { wch: 20 }, // Atualizado em
  ];
  
  worksheet["!cols"] = columnsWidth;
  
  // Gera o arquivo
  XLSX.writeFile(workbook, "estoque-sorte-paratodos.xlsx");
};

// Gerar relatório de movimentações em Excel
export const generateMovementsExcel = (movements: ItemMovement[], items: Item[]) => {
  // Planilha principal com resumo das movimentações
  const mainWorksheet = XLSX.utils.json_to_sheet(
    movements.map(movement => ({
      ID: movement.id,
      Tipo: movement.type === 'checkout' ? 'Saída' : 'Devolução',
      Responsável: movement.responsibleName,
      Vendedor: movement.sellerName || "N/A",
      Data: formatDate(movement.date),
      "Total de Itens": movement.items.reduce((acc, item) => acc + item.quantity, 0)
    }))
  );
  
  // Planilha detalhada com todos os itens movimentados
  const detailsRows: any[] = [];
  
  movements.forEach(movement => {
    movement.items.forEach(item => {
      detailsRows.push({
        "ID Movimentação": movement.id,
        Tipo: movement.type === 'checkout' ? 'Saída' : 'Devolução',
        Data: formatDate(movement.date),
        "Código Item": item.itemCode,
        "Nome Item": item.itemName,
        Quantidade: item.quantity,
        Responsável: movement.responsibleName,
        Vendedor: movement.sellerName || "N/A"
      });
    });
  });
  
  const detailsWorksheet = XLSX.utils.json_to_sheet(detailsRows);
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, mainWorksheet, "Movimentações");
  XLSX.utils.book_append_sheet(workbook, detailsWorksheet, "Detalhes");
  
  // Ajusta largura das colunas (primeira planilha)
  const mainColumnsWidth = [
    { wch: 36 }, // ID
    { wch: 10 }, // Tipo
    { wch: 20 }, // Responsável
    { wch: 20 }, // Vendedor
    { wch: 20 }, // Data
    { wch: 15 }, // Total de Itens
  ];
  
  mainWorksheet["!cols"] = mainColumnsWidth;
  
  // Ajusta largura das colunas (segunda planilha)
  const detailsColumnsWidth = [
    { wch: 36 }, // ID Movimentação
    { wch: 10 }, // Tipo
    { wch: 20 }, // Data
    { wch: 15 }, // Código Item
    { wch: 30 }, // Nome Item
    { wch: 12 }, // Quantidade
    { wch: 20 }, // Responsável
    { wch: 20 }, // Vendedor
  ];
  
  detailsWorksheet["!cols"] = detailsColumnsWidth;
  
  // Gera o arquivo
  XLSX.writeFile(workbook, "movimentacoes-sorte-paratodos.xlsx");
};
