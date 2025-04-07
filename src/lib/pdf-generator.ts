
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Item, ItemMovement, Seller } from "@/types";

// função utilitária para formatar data
const formatDate = (dateString: string) => {
  return format(new Date(dateString), "dd/MM/yyyy HH:mm", {
    locale: ptBR,
  });
};

// Gerar relatório de estoque
export const generateInventoryPDF = (items: Item[]) => {
  const doc = new jsPDF();
  
  // Cabeçalho
  doc.setFontSize(20);
  doc.text("Sorte ParaTodos - Relatório de Estoque", 14, 22);
  
  doc.setFontSize(10);
  doc.text(`Gerado em: ${formatDate(new Date().toISOString())}`, 14, 30);
  
  // Tabela
  autoTable(doc, {
    startY: 35,
    head: [["Código", "Nome", "Categoria", "Total", "Disponível", "Em Uso"]],
    body: items.map(item => [
      item.code,
      item.name,
      item.category,
      item.totalQuantity,
      item.availableQuantity,
      item.inUseQuantity
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [40, 128, 154] },
  });
  
  // Rodapé
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.width - 30,
      doc.internal.pageSize.height - 10
    );
  }
  
  // Salva o PDF
  doc.save("estoque-sorte-paratodos.pdf");
  
  return doc;
};

// Gerar relatório de vendedores
export const generateSellersPDF = (sellers: Seller[]) => {
  const doc = new jsPDF();
  
  // Cabeçalho
  doc.setFontSize(20);
  doc.text("Sorte ParaTodos - Relatório de Vendedores", 14, 22);
  
  doc.setFontSize(10);
  doc.text(`Gerado em: ${formatDate(new Date().toISOString())}`, 14, 30);
  
  // Tabela
  autoTable(doc, {
    startY: 35,
    head: [["Nome", "WhatsApp", "Endereço", "Cadastrado em"]],
    body: sellers.map(seller => [
      seller.name,
      seller.whatsapp,
      seller.address,
      formatDate(seller.createdAt)
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [40, 128, 154] },
  });
  
  // Rodapé
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.width - 30,
      doc.internal.pageSize.height - 10
    );
  }
  
  // Salva o PDF
  doc.save("vendedores-sorte-paratodos.pdf");
  
  return doc;
};

// Gerar comprovante de saída/devolução
export const generateMovementPDF = (movement: ItemMovement, items: Item[], sellers: Seller[]) => {
  const doc = new jsPDF();
  
  const seller = movement.sellerId ? 
    sellers.find(s => s.id === movement.sellerId) : 
    undefined;
  
  // Cabeçalho
  doc.setFontSize(16);
  doc.text(
    `Sorte ParaTodos - ${movement.type === 'checkout' ? 'Comprovante de Saída' : 'Comprovante de Devolução'}`,
    14,
    15
  );
  
  // Informações gerais
  doc.setFontSize(10);
  doc.text(`Data: ${formatDate(movement.date)}`, 14, 25);
  doc.text(`ID da operação: ${movement.id}`, 14, 30);
  doc.text(`Responsável: ${movement.responsibleName}`, 14, 35);
  
  if (seller) {
    doc.text(`Vendedor: ${seller.name}`, 14, 40);
    doc.text(`Contato: ${seller.whatsapp}`, 14, 45);
    doc.text(`Endereço: ${seller.address}`, 14, 50);
    
    // Tabela começa mais abaixo se tiver informações do vendedor
    autoTable(doc, {
      startY: 55,
      head: [["Código", "Item", "Quantidade"]],
      body: movement.items.map(item => [
        item.itemCode,
        item.itemName,
        item.quantity
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [40, 128, 154] },
    });
  } else {
    // Se não tiver vendedor, tabela começa mais acima
    autoTable(doc, {
      startY: 40,
      head: [["Código", "Item", "Quantidade"]],
      body: movement.items.map(item => [
        item.itemCode,
        item.itemName,
        item.quantity
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [40, 128, 154] },
    });
  }
  
  // Assinaturas
  const finalY = (doc as any).lastAutoTable.finalY + 20;
  
  doc.line(14, finalY, 90, finalY); // linha para assinatura do responsável
  doc.line(120, finalY, 196, finalY); // linha para assinatura do recebedor
  
  doc.text("Responsável", 40, finalY + 5);
  doc.text("Recebedor", 150, finalY + 5);
  
  // Salva o PDF
  doc.save(`${movement.type === 'checkout' ? 'saida' : 'devolucao'}-${movement.id.slice(0, 8)}.pdf`);
  
  return doc;
};

// Gerar etiquetas
export const generateLabelsPDF = (startNumber: number, endNumber: number, customPhrase: string) => {
  const doc = new jsPDF();
  const totalLabels = endNumber - startNumber + 1;
  
  // 5 etiquetas por página (ajuste conforme necessário)
  const labelsPerPage = 10;
  const labelWidth = 80;
  const labelHeight = 25;
  const marginLeft = 15;
  let currentY = 20;
  let currentPage = 1;
  
  doc.setFontSize(16);
  doc.text("Sorte ParaTodos - Etiquetas", 14, 10);
  
  for (let i = 0; i < totalLabels; i++) {
    const currentNumber = startNumber + i;
    const row = i % labelsPerPage;
    
    // Verifica se precisa criar uma nova página
    if (row === 0 && i > 0) {
      doc.addPage();
      currentPage++;
      currentY = 20;
    }
    
    // Desenha a borda da etiqueta
    doc.rect(marginLeft, currentY, labelWidth, labelHeight);
    
    // Número da etiqueta em negrito
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(currentNumber.toString(), marginLeft + 5, currentY + 10);
    
    // Texto personalizado
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(customPhrase, marginLeft + 5, currentY + 20);
    
    // Incrementa posição Y para próxima etiqueta
    currentY += labelHeight + 5;
    
    // Se estiver na coluna direita, pule para a próxima linha
    if ((i + 1) % 2 === 0) {
      currentY += 5;
    }
  }
  
  // Adiciona rodapé em todas as páginas
  for (let i = 1; i <= currentPage; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Página ${i} de ${currentPage}`,
      doc.internal.pageSize.width - 30,
      doc.internal.pageSize.height - 10
    );
  }
  
  // Salva o PDF
  doc.save(`etiquetas-${startNumber}-${endNumber}.pdf`);
  
  return doc;
};

// Gerar relatório geral do dashboard
export const generateDashboardReportPDF = (stats: any, items: Item[], sellers: Seller[], movements: ItemMovement[]) => {
  const doc = new jsPDF();
  
  // Cabeçalho
  doc.setFontSize(20);
  doc.text("Sorte ParaTodos - Relatório Geral", 14, 22);
  
  doc.setFontSize(10);
  doc.text(`Gerado em: ${formatDate(new Date().toISOString())}`, 14, 30);
  
  // Resumo
  doc.setFontSize(12);
  doc.text("Resumo do Sistema", 14, 40);
  
  doc.setFontSize(10);
  doc.text(`Total de Itens em Estoque: ${stats.totalItems}`, 20, 50);
  doc.text(`Total de Vendedores: ${stats.totalSellers}`, 20, 55);
  doc.text(`Total de Saídas: ${stats.totalCheckouts}`, 20, 60);
  doc.text(`Total de Devoluções: ${stats.totalReturns}`, 20, 65);
  
  // Status por Categoria
  doc.setFontSize(12);
  doc.text("Status por Categoria", 14, 75);
  
  const categories = Object.entries(stats.stockByCategory);
  autoTable(doc, {
    startY: 80,
    head: [["Categoria", "Quantidade em Estoque"]],
    body: categories.map(([category, quantity]) => [category, quantity]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [40, 128, 154] },
  });
  
  // Últimas Movimentações
  const lastMovements = [...movements].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 5);
  
  doc.setFontSize(12);
  doc.text("Últimas Movimentações", 14, (doc as any).lastAutoTable.finalY + 10);
  
  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 15,
    head: [["Data", "Tipo", "Responsável", "Qtde Itens"]],
    body: lastMovements.map(movement => [
      formatDate(movement.date),
      movement.type === 'checkout' ? 'Saída' : 'Devolução',
      movement.responsibleName,
      movement.items.reduce((acc, item) => acc + item.quantity, 0)
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [40, 128, 154] },
  });
  
  // Rodapé
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.width - 30,
      doc.internal.pageSize.height - 10
    );
  }
  
  // Salva o PDF
  doc.save("relatorio-geral-sorte-paratodos.pdf");
  
  return doc;
};
