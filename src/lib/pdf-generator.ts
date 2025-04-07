
import jsPDF from "jspdf";
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
  let startY = 35;
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Cabeçalho da tabela
  const headers = ["Código", "Nome", "Categoria", "Total", "Disponível", "Em Uso"];
  const colWidths = [25, 60, 40, 20, 20, 20];
  
  // Desenhar cabeçalho da tabela
  let currentX = 10;
  doc.setFillColor(40, 128, 154);
  doc.setTextColor(255, 255, 255);
  doc.rect(10, startY, pageWidth - 20, 10, 'F');
  
  headers.forEach((header, index) => {
    doc.text(header, currentX + 2, startY + 6);
    currentX += colWidths[index];
  });
  
  // Desenhar linhas da tabela
  doc.setTextColor(0, 0, 0);
  startY += 10;
  
  items.forEach((item, index) => {
    // Adicionar nova página se necessário
    if (startY > 270) {
      doc.addPage();
      startY = 20;
      
      // Redesenhar cabeçalho na nova página
      currentX = 10;
      doc.setFillColor(40, 128, 154);
      doc.setTextColor(255, 255, 255);
      doc.rect(10, startY, pageWidth - 20, 10, 'F');
      
      headers.forEach((header, index) => {
        doc.text(header, currentX + 2, startY + 6);
        currentX += colWidths[index];
      });
      
      doc.setTextColor(0, 0, 0);
      startY += 10;
    }
    
    const rowY = startY;
    doc.setFillColor(index % 2 === 0 ? 240 : 255, index % 2 === 0 ? 240 : 255, index % 2 === 0 ? 240 : 255);
    doc.rect(10, rowY, pageWidth - 20, 8, 'F');
    
    currentX = 10;
    doc.text(item.code, currentX + 2, rowY + 5);
    currentX += colWidths[0];
    
    doc.text(item.name, currentX + 2, rowY + 5);
    currentX += colWidths[1];
    
    doc.text(item.category, currentX + 2, rowY + 5);
    currentX += colWidths[2];
    
    doc.text(item.totalQuantity.toString(), currentX + 2, rowY + 5);
    currentX += colWidths[3];
    
    doc.text(item.availableQuantity.toString(), currentX + 2, rowY + 5);
    currentX += colWidths[4];
    
    doc.text(item.inUseQuantity.toString(), currentX + 2, rowY + 5);
    
    startY += 8;
  });
  
  // Rodapé
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.getWidth() - 30,
      doc.internal.pageSize.getHeight() - 10
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
  let startY = 35;
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Cabeçalho da tabela
  const headers = ["Nome", "WhatsApp", "Endereço", "Cadastrado em"];
  const colWidths = [50, 40, 60, 40];
  
  // Desenhar cabeçalho da tabela
  let currentX = 10;
  doc.setFillColor(40, 128, 154);
  doc.setTextColor(255, 255, 255);
  doc.rect(10, startY, pageWidth - 20, 10, 'F');
  
  headers.forEach((header, index) => {
    doc.text(header, currentX + 2, startY + 6);
    currentX += colWidths[index];
  });
  
  // Desenhar linhas da tabela
  doc.setTextColor(0, 0, 0);
  startY += 10;
  
  sellers.forEach((seller, index) => {
    // Adicionar nova página se necessário
    if (startY > 270) {
      doc.addPage();
      startY = 20;
      
      // Redesenhar cabeçalho na nova página
      currentX = 10;
      doc.setFillColor(40, 128, 154);
      doc.setTextColor(255, 255, 255);
      doc.rect(10, startY, pageWidth - 20, 10, 'F');
      
      headers.forEach((header, index) => {
        doc.text(header, currentX + 2, startY + 6);
        currentX += colWidths[index];
      });
      
      doc.setTextColor(0, 0, 0);
      startY += 10;
    }
    
    const rowY = startY;
    doc.setFillColor(index % 2 === 0 ? 240 : 255, index % 2 === 0 ? 240 : 255, index % 2 === 0 ? 240 : 255);
    doc.rect(10, rowY, pageWidth - 20, 8, 'F');
    
    currentX = 10;
    doc.text(seller.name, currentX + 2, rowY + 5);
    currentX += colWidths[0];
    
    doc.text(seller.whatsapp, currentX + 2, rowY + 5);
    currentX += colWidths[1];
    
    doc.text(seller.address, currentX + 2, rowY + 5);
    currentX += colWidths[2];
    
    doc.text(formatDate(seller.createdAt), currentX + 2, rowY + 5);
    
    startY += 8;
  });
  
  // Rodapé
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.getWidth() - 30,
      doc.internal.pageSize.getHeight() - 10
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
  
  let startY = 40;
  
  if (seller) {
    doc.text(`Vendedor: ${seller.name}`, 14, startY);
    startY += 5;
    doc.text(`Contato: ${seller.whatsapp}`, 14, startY);
    startY += 5;
    doc.text(`Endereço: ${seller.address}`, 14, startY);
    startY += 10;
  }
  
  // Tabela de itens
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Cabeçalho da tabela
  const headers = ["Código", "Item", "Quantidade"];
  const colWidths = [40, 100, 40];
  
  // Desenhar cabeçalho da tabela
  let currentX = 10;
  doc.setFillColor(40, 128, 154);
  doc.setTextColor(255, 255, 255);
  doc.rect(10, startY, pageWidth - 20, 10, 'F');
  
  headers.forEach((header, index) => {
    doc.text(header, currentX + 2, startY + 6);
    currentX += colWidths[index];
  });
  
  // Desenhar linhas da tabela
  doc.setTextColor(0, 0, 0);
  startY += 10;
  
  movement.items.forEach((item, index) => {
    // Adicionar nova página se necessário
    if (startY > 270) {
      doc.addPage();
      startY = 20;
      
      // Redesenhar cabeçalho na nova página
      currentX = 10;
      doc.setFillColor(40, 128, 154);
      doc.setTextColor(255, 255, 255);
      doc.rect(10, startY, pageWidth - 20, 10, 'F');
      
      headers.forEach((header, index) => {
        doc.text(header, currentX + 2, startY + 6);
        currentX += colWidths[index];
      });
      
      doc.setTextColor(0, 0, 0);
      startY += 10;
    }
    
    const rowY = startY;
    doc.setFillColor(index % 2 === 0 ? 240 : 255, index % 2 === 0 ? 240 : 255, index % 2 === 0 ? 240 : 255);
    doc.rect(10, rowY, pageWidth - 20, 8, 'F');
    
    currentX = 10;
    doc.text(item.itemCode, currentX + 2, rowY + 5);
    currentX += colWidths[0];
    
    doc.text(item.itemName, currentX + 2, rowY + 5);
    currentX += colWidths[1];
    
    doc.text(item.quantity.toString(), currentX + 2, rowY + 5);
    
    startY += 8;
  });
  
  // Assinaturas
  startY += 20;
  doc.line(14, startY, 90, startY); // linha para assinatura do responsável
  doc.line(120, startY, 196, startY); // linha para assinatura do recebedor
  
  doc.text("Responsável", 40, startY + 5);
  doc.text("Recebedor", 150, startY + 5);
  
  // Salva o PDF
  doc.save(`${movement.type === 'checkout' ? 'saida' : 'devolucao'}-${movement.id.slice(0, 8)}.pdf`);
  
  return doc;
};

// Gerar etiquetas - versão atualizada para 80 etiquetas por página
export const generateLabelsPDF = (startNumber: number, endNumber: number, customPhrase: string, digits: number = 5) => {
  const doc = new jsPDF();
  const totalLabels = endNumber - startNumber + 1;
  
  // Configurações da folha A4
  const pageWidth = 210; // mm
  const pageHeight = 297; // mm
  const marginX = 5; // mm
  const marginY = 10; // mm
  
  // Configurações de etiquetas (4 por linha, 20 linhas = 80 por página)
  const cols = 4;
  const rows = 20;
  const labelWidth = (pageWidth - 2 * marginX) / cols;
  const labelHeight = (pageHeight - 2 * marginY) / rows;
  
  // Contadores
  let labelCount = 0;
  let currentPage = 1;
  
  for (let i = 0; i < totalLabels; i++) {
    // Se precisar de uma nova página
    if (labelCount === 0) {
      if (i > 0) {
        doc.addPage();
        currentPage++;
      }
      
      // Título da página
      doc.setFontSize(8);
      doc.text(`Sorte ParaTodos - Etiquetas - Pág. ${currentPage}`, marginX, 5);
    }
    
    const currentNumber = startNumber + i;
    const formattedNumber = `Nº ${currentNumber.toString().padStart(digits, '0')}`;
    
    // Calcular posição na página
    const col = labelCount % cols;
    const row = Math.floor(labelCount / cols) % rows;
    
    const x = marginX + col * labelWidth;
    const y = marginY + row * labelHeight;
    
    // Número da etiqueta em negrito e grande
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(formattedNumber, x + labelWidth / 2, y + labelHeight / 2 - 2, { align: "center" });
    
    // Texto personalizado
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(customPhrase, x + labelWidth / 2, y + labelHeight / 2 + 3, { align: "center" });
    
    // Incrementar contador de etiquetas
    labelCount++;
    
    // Resetar contador de etiquetas se alcançou o máximo por página
    if (labelCount >= cols * rows) {
      labelCount = 0;
    }
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
  
  // Tabela de categorias
  let startY = 80;
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Cabeçalho da tabela
  const headers = ["Categoria", "Cadastrados", "Em Uso", "Disponíveis", "% Utilização"];
  const colWidths = [60, 30, 30, 30, 30];
  
  // Desenhar cabeçalho da tabela
  let currentX = 10;
  doc.setFillColor(40, 128, 154);
  doc.setTextColor(255, 255, 255);
  doc.rect(10, startY, pageWidth - 20, 10, 'F');
  
  headers.forEach((header, index) => {
    doc.text(header, currentX + 2, startY + 6);
    currentX += colWidths[index];
  });
  
  // Desenhar linhas da tabela
  doc.setTextColor(0, 0, 0);
  startY += 10;
  
  // Calcular estatísticas por categoria
  Object.entries(stats.stockByCategory).forEach(([category, quantity], index) => {
    const categoryItems = items.filter(item => item.category === category);
    const totalInCategory = categoryItems.length;
    const inUseCount = categoryItems.reduce((acc, item) => acc + item.inUseQuantity, 0);
    const availableCount = categoryItems.reduce((acc, item) => acc + item.availableQuantity, 0);
    const totalItems = inUseCount + availableCount;
    const utilizationPercentage = totalItems > 0 
      ? Math.round((inUseCount / totalItems) * 100) 
      : 0;
      
    const rowY = startY;
    doc.setFillColor(index % 2 === 0 ? 240 : 255, index % 2 === 0 ? 240 : 255, index % 2 === 0 ? 240 : 255);
    doc.rect(10, rowY, pageWidth - 20, 8, 'F');
    
    currentX = 10;
    doc.text(category, currentX + 2, rowY + 5);
    currentX += colWidths[0];
    
    doc.text(totalInCategory.toString(), currentX + 2, rowY + 5);
    currentX += colWidths[1];
    
    doc.text(inUseCount.toString(), currentX + 2, rowY + 5);
    currentX += colWidths[2];
    
    doc.text(availableCount.toString(), currentX + 2, rowY + 5);
    currentX += colWidths[3];
    
    doc.text(`${utilizationPercentage}%`, currentX + 2, rowY + 5);
    
    startY += 8;
  });
  
  // Rodapé
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.getWidth() - 30,
      doc.internal.pageSize.getHeight() - 10
    );
  }
  
  // Salva o PDF
  doc.save("relatorio-geral-sorte-paratodos.pdf");
  
  return doc;
};
