import jsPDF from "jspdf";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Item, ItemMovement, Seller, Responsible } from "@/types";

// função utilitária para formatar data
const formatDate = (dateString: string) => {
  return format(new Date(dateString), "dd/MM/yyyy", {
    locale: ptBR,
  });
};

// Gerar relatório de estoque
export const generateInventoryPDF = (items: Item[]) => {
  const doc = new jsPDF();
  
  // Cabeçalho
  doc.setFontSize(20);
  doc.text("Sorte Ouro Verde - Relatório de Estoque", 14, 22);
  
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
      
      // Redesenhar cabeçalho da tabela
      currentX = 10;
      doc.setFillColor(40, 128, 154);
      doc.setTextColor(255, 255, 255);
      doc.rect(10, startY, pageWidth - 20, 10, 'F');
      
      headers.forEach((header, headerIndex) => {
        doc.text(header, currentX + 2, startY + 6);
        currentX += colWidths[headerIndex];
      });
      
      doc.setTextColor(0, 0, 0);
      startY += 10;
    }
    
    // Desenhar linha da tabela
    doc.setFillColor(index % 2 === 0 ? 240 : 255, index % 2 === 0 ? 240 : 255, index % 2 === 0 ? 240 : 255);
    doc.rect(10, startY, pageWidth - 20, 8, 'F');
    
    currentX = 10;
    doc.text(item.code, currentX + 2, startY + 5);
    currentX += colWidths[0];
    
    doc.text(item.name, currentX + 2, startY + 5);
    currentX += colWidths[1];
    
    doc.text(item.category, currentX + 2, startY + 5);
    currentX += colWidths[2];
    
    doc.text(item.totalQuantity.toString(), currentX + 2, startY + 5);
    currentX += colWidths[3];
    
    doc.text(item.availableQuantity.toString(), currentX + 2, startY + 5);
    currentX += colWidths[4];
    
    doc.text(item.inUseQuantity.toString(), currentX + 2, startY + 5);
    
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
  
  doc.save("estoque-sorte-ouro-verde.pdf");
  
  return doc;
};

// Gerar relatório de responsáveis
export const generateResponsiblesPDF = (responsibles: Responsible[]) => {
  try {
    const doc = new jsPDF();
    
    // Cabeçalho
    doc.setFontSize(20);
    doc.text("Sorte Ouro Verde - Relatório de Responsáveis", 14, 22);
    
    doc.setFontSize(10);
    doc.text(`Gerado em: ${formatDate(new Date().toISOString())}`, 14, 30);
    
    // Tabela
    let startY = 35;
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Cabeçalho da tabela
    const headers = ["Nome", "WhatsApp", "Endereço"];
    const colWidths = [60, 40, 90];
    
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
    
    responsibles.forEach((responsible, index) => {
      // Adicionar nova página se necessário
      if (startY > 270) {
        doc.addPage();
        startY = 20;
        
        // Redesenhar cabeçalho da tabela
        currentX = 10;
        doc.setFillColor(40, 128, 154);
        doc.setTextColor(255, 255, 255);
        doc.rect(10, startY, pageWidth - 20, 10, 'F');
        
        headers.forEach((header, headerIndex) => {
          doc.text(header, currentX + 2, startY + 6);
          currentX += colWidths[headerIndex];
        });
        
        doc.setTextColor(0, 0, 0);
        startY += 10;
      }
      
      // Desenhar linha da tabela
      doc.setFillColor(index % 2 === 0 ? 240 : 255, index % 2 === 0 ? 240 : 255, index % 2 === 0 ? 240 : 255);
      doc.rect(10, startY, pageWidth - 20, 8, 'F');
      
      currentX = 10;
      doc.text(responsible.name, currentX + 2, startY + 5);
      currentX += colWidths[0];
      
      doc.text(responsible.whatsapp, currentX + 2, startY + 5);
      currentX += colWidths[1];
      
      doc.text(responsible.address, currentX + 2, startY + 5);
      
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
    
    doc.save("responsaveis-sorte-ouro-verde.pdf");
    
    return doc;
  } catch (error) {
    console.error('Erro ao gerar PDF de responsáveis:', error);
    throw error;
  }
};

// Gerar comprovante de movimentação
export const generateMovementPDF = (movement: ItemMovement, sellers: Seller[]) => {
  const doc = new jsPDF();
  
  // Cabeçalho
  doc.setFontSize(20);
  doc.text(`Sorte Ouro Verde - ${movement.type === 'checkout' ? 'Saída' : 'Devolução'}`, 14, 22);
  
  doc.setFontSize(10);
  doc.text(`Data: ${formatDate(movement.date)}`, 14, 30);
  doc.text(`Responsável: ${movement.responsibleName}`, 14, 35);
  doc.text(`Vendedor: ${movement.sellerName || 'N/A'}`, 14, 40);
  
  // Mostrar informação de Ponto Novo apenas para saídas
  if (movement.type === 'checkout' && movement.pontoNovo) {
    doc.setFontSize(10);
    doc.setTextColor(220, 38, 127); // Cor rosa para destacar
    doc.text(`📍 SAÍDA PARA PONTO NOVO`, 14, 45);
    doc.setTextColor(0, 0, 0); // Voltar cor normal
  }
  
  // Tabela de itens
  let startY = movement.type === 'checkout' && movement.pontoNovo ? 55 : 50;
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Cabeçalho da tabela - ajustado para códigos maiores
  const headers = ["Código", "Nome do Item", "Quantidade"];
  const colWidths = [40, 100, 30]; // Aumentado código de 30 para 40
  
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
    // Calcular altura necessária para o item (caso o nome seja muito longo)
    const itemName = item.itemName;
    const maxNameWidth = colWidths[1] - 4; // Largura disponível para o nome
    const nameWidth = doc.getTextWidth(itemName);
    
    let rowHeight = 8; // Altura padrão
    let nameLines = 1;
    
    // Se o nome for muito longo, quebrar em múltiplas linhas
    if (nameWidth > maxNameWidth) {
      const words = itemName.split(' ');
      let currentLine = '';
      let lines = 1;
      
      words.forEach((word) => {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        if (doc.getTextWidth(testLine) > maxNameWidth && currentLine) {
          currentLine = word;
          lines++;
        } else {
          currentLine = testLine;
        }
      });
      
      nameLines = lines;
      rowHeight = 8 + (lines - 1) * 4; // Altura adicional para múltiplas linhas
    }
    
    // Desenhar linha da tabela
    doc.setFillColor(index % 2 === 0 ? 240 : 255, index % 2 === 0 ? 240 : 255, index % 2 === 0 ? 240 : 255);
    doc.rect(10, startY, pageWidth - 20, rowHeight, 'F');
    
    currentX = 10;
    
    // Código do item
    doc.setFontSize(9);
    doc.text(item.itemCode, currentX + 2, startY + 5);
    currentX += colWidths[0];
    
    // Nome do item (com quebra de linha se necessário)
    if (nameLines > 1) {
      const words = itemName.split(' ');
      let currentLine = '';
      let yOffset = 0;
      
      words.forEach((word) => {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        if (doc.getTextWidth(testLine) > maxNameWidth && currentLine) {
          doc.text(currentLine, currentX + 2, startY + 5 + yOffset);
          currentLine = word;
          yOffset += 4;
        } else {
          currentLine = testLine;
        }
      });
      
      if (currentLine) {
        doc.text(currentLine, currentX + 2, startY + 5 + yOffset);
      }
    } else {
      doc.text(itemName, currentX + 2, startY + 5);
    }
    currentX += colWidths[1];
    
    // Quantidade
    doc.text(item.quantity.toString(), currentX + 2, startY + 5);
    
    startY += rowHeight;
  });
  
  // Adicionar campo de assinatura apenas para saídas (checkout)
  if (movement.type === 'checkout') {
    startY += 20; // Espaço antes da assinatura
    
    // Texto da assinatura
    doc.setFontSize(10);
    doc.text("Assinatura do Responsável:", 20, startY - 5);
    
    // Linha para assinatura (na frente do texto)
    doc.setDrawColor(0, 0, 0);
    doc.line(80, startY, 140, startY);
  }
  
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
      doc.text(`Sorte Ouro Verde - Etiquetas - Pág. ${currentPage}`, marginX, 5);
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
  
  // Calcular total de itens para pontos novos
  let totalItemsForNewPoints = 0;
  movements.forEach(movement => {
    if (movement.type === 'checkout' && movement.pontoNovo) {
      movement.items.forEach(item => {
        totalItemsForNewPoints += item.quantity;
      });
    }
  });
  
  // Cabeçalho
  doc.setFontSize(20);
  doc.text("Sorte Ouro Verde - Relatório Geral", 14, 22);
  
  doc.setFontSize(10);
  doc.text(`Gerado em: ${formatDate(new Date().toISOString())}`, 14, 30);
  
  // Resumo
  doc.setFontSize(12);
  doc.text("Resumo do Sistema", 14, 40);
  
  doc.setFontSize(10);
  doc.text(`Total de Itens em Estoque: ${stats.totalItems}`, 20, 50);
  doc.text(`Total de Responsáveis: ${stats.totalSellers}`, 20, 55);
  doc.text(`Total de Saídas: ${stats.totalCheckouts}`, 20, 60);
  doc.text(`Total de Devoluções: ${stats.totalReturns}`, 20, 65);
  
  // Estatística de pontos novos
  if (totalItemsForNewPoints > 0) {
    doc.setTextColor(220, 38, 127); // Cor rosa para destacar
    doc.text(`📍 Total de itens para Pontos Novos: ${totalItemsForNewPoints}`, 20, 70);
    doc.setTextColor(0, 0, 0); // Voltar cor normal
  }
  
  // Status por Categoria
  doc.setFontSize(12);
  doc.text("Status por Categoria", 14, totalItemsForNewPoints > 0 ? 80 : 75);
  
  // Tabela de categorias
  let startY = totalItemsForNewPoints > 0 ? 85 : 80;
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
  doc.save("relatorio-geral-sorte-ouro-verde.pdf");
  
  return doc;
};

// Gerar relatório de movimentações
export const generateMovementsReportPDF = (movements: ItemMovement[], items: Item[], filters: {
  type: 'all' | 'checkout' | 'return';
  responsible: string;
  dateRange: { from: Date | undefined; to: Date | undefined };
}) => {
  const doc = new jsPDF('landscape', 'mm', 'a4'); // Orientação horizontal
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Cores personalizadas
  const primaryColor: [number, number, number] = [40, 128, 154]; // Azul sorte
  const lightGray: [number, number, number] = [248, 249, 250];
  const darkGray: [number, number, number] = [55, 65, 81];
  
  // Função para adicionar cabeçalho em todas as páginas
  const addHeader = (pageNum: number) => {
    doc.setPage(pageNum);
    
    // Logo/Header
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, pageWidth, 25, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text("SORTE OURO VERDE", 20, 16);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text("Relatório de Movimentações", 20, 22);
    
    // Data de geração
    doc.setFontSize(8);
    doc.text(`Gerado em: ${formatDate(new Date().toISOString())}`, pageWidth - 50, 16);
  };
  
  // Função para adicionar rodapé
  const addFooter = (pageNum: number, totalPages: number) => {
    doc.setPage(pageNum);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Página ${pageNum} de ${totalPages}`, pageWidth - 30, pageHeight - 10);
    doc.text("Sistema de Gestão de Almoxarifado", 20, pageHeight - 10);
  };
  
  // Calcular resumo por categoria
  const categorySummary: Record<string, { checkouts: number; returns: number }> = {};
  
  // Inicializar todas as categorias
  const allCategories = ['Máquinas VX', 'Máquinas Digital', 'Notebook/PC', 'Suprimentos', 'Material de Escritório', 'Bancadas', 'Chips'];
  allCategories.forEach(category => {
    categorySummary[category] = { checkouts: 0, returns: 0 };
  });
  
  // Calcular totais por categoria e pontos novos
  let totalItemsForNewPoints = 0;
  
  movements.forEach(movement => {
    movement.items.forEach(item => {
      // Encontrar a categoria do item
      const itemData = items.find(i => i.id === item.itemId);
      if (itemData) {
        const category = itemData.category;
        if (movement.type === 'checkout') {
          categorySummary[category].checkouts += item.quantity;
          
          // Contar itens para pontos novos
          if (movement.pontoNovo) {
            totalItemsForNewPoints += item.quantity;
          }
        } else if (movement.type === 'return') {
          categorySummary[category].returns += item.quantity;
        }
      }
    });
  });
  
  // Ordenar movimentações por data crescente
  const sortedMovements = [...movements].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });
  
  // Página 1 - Cabeçalho e resumo
  addHeader(1);
  
  let currentY = 35; // Aumentado para dar espaço ao resumo
  
  // Adicionar resumo por categoria
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text("Resumo por Categoria", 20, currentY);
  
  currentY += 8;
  
  // Mostrar estatística de pontos novos
  if (totalItemsForNewPoints > 0) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(220, 38, 127); // Cor rosa para destacar
    doc.text(`📍 Total de itens para Pontos Novos: ${totalItemsForNewPoints}`, 25, currentY);
    doc.setTextColor(0, 0, 0); // Voltar cor normal
    currentY += 6;
  }
  
  // Mostrar apenas categorias com movimentações
  const categoriesWithMovements = Object.entries(categorySummary).filter(([_, totals]) => 
    totals.checkouts > 0 || totals.returns > 0
  );
  
  if (categoriesWithMovements.length > 0) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    categoriesWithMovements.forEach(([category, totals]) => {
      if (totals.checkouts > 0) {
        doc.text(`Saídas - ${category}: ${totals.checkouts}`, 25, currentY);
        currentY += 5;
      }
      if (totals.returns > 0) {
        doc.text(`Devoluções - ${category}: ${totals.returns}`, 25, currentY);
        currentY += 5;
      }
    });
  } else {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text("Nenhuma movimentação encontrada no período selecionado.", 25, currentY);
    currentY += 5;
  }
  
  currentY += 10; // Espaço antes da tabela
  
  // Tabela de movimentações
  
  // Cabeçalho da tabela
  const headers = ["Data", "Tipo", "Responsável", "Vendedor", "Itens"];
  const colWidths = [25, 20, 40, 40, 150]; // Mais compacto
  
  // Desenhar cabeçalho da tabela com fundo claro
  doc.setFillColor(240, 240, 240);
  doc.rect(15, currentY, pageWidth - 30, 8, 'F');
  doc.setTextColor(0, 0, 0);
  
  let currentX = 15;
  headers.forEach((header, index) => {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(header, currentX + 2, currentY + 6);
    currentX += colWidths[index];
  });
  
  currentY += 8;
  
  // Desenhar linhas da tabela
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  
  sortedMovements.forEach((movement, index) => {
    // Verificar se precisa de nova página
    if (currentY > pageHeight - 40) {
      doc.addPage();
      addHeader(doc.getNumberOfPages());
      currentY = 25;
      
      // Redesenhar cabeçalho da tabela com fundo claro
      doc.setFillColor(240, 240, 240);
      doc.rect(15, currentY, pageWidth - 30, 8, 'F');
      doc.setTextColor(0, 0, 0);
      
      currentX = 15;
      headers.forEach((header, headerIndex) => {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text(header, currentX + 2, currentY + 6);
        currentX += colWidths[headerIndex];
      });
      
      currentY += 8;
    }
    
    // Calcular altura necessária para os itens primeiro
    const itemsText = movement.items.map(item => `${item.itemCode} - ${item.itemName} (${item.quantity}x)`).join(', ');
    const maxWidth = colWidths[4] - 4;
    const textWidth = doc.getTextWidth(itemsText);
    
    let estimatedHeight = 7; // altura base
    if (textWidth > maxWidth) {
      const words = itemsText.split(', ');
      let line = '';
      let lines = 1;
      
      words.forEach((word) => {
        const testLine = line + (line ? ', ' : '') + word;
        if (doc.getTextWidth(testLine) > maxWidth && line) {
          line = word;
          lines++;
        } else {
          line = testLine;
        }
      });
      
      estimatedHeight = 7 + (lines - 1) * 3;
    }
    
    // Desenhar linha da tabela com separação clara
    const isEven = index % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 249, isEven ? 255 : 250);
    doc.rect(15, currentY, pageWidth - 30, estimatedHeight, 'F');
    
    currentX = 15;
    
    // Data
    doc.setFontSize(8);
    doc.text(formatDate(movement.date), currentX + 2, currentY + 5);
    currentX += colWidths[0];
    
    // Tipo com badge (sem cor verde)
    const typeText = movement.type === 'checkout' ? 'SAÍDA' : 'DEVOLUÇÃO';
    const typeColor: [number, number, number] = movement.type === 'checkout' ? [220, 38, 127] : [100, 100, 100]; // Rosa para saída, cinza para devolução
    
    doc.setFillColor(typeColor[0], typeColor[1], typeColor[2]);
    doc.setTextColor(255, 255, 255);
    doc.rect(currentX + 1, currentY + 1, 18, 5, 'F');
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.text(typeText, currentX + 3, currentY + 4);
    
    doc.setTextColor(0, 0, 0);
    currentX += colWidths[1];
    
    // Responsável
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(movement.responsibleName, currentX + 2, currentY + 5);
    currentX += colWidths[2];
    
    // Vendedor
    doc.text(movement.sellerName || 'N/A', currentX + 2, currentY + 5);
    currentX += colWidths[3];
    
    // Itens (incluindo nome do item) - usar variáveis já declaradas
    
    let maxYOffset = 0;
    
    if (textWidth > maxWidth) {
      // Quebrar linha se necessário
      const words = itemsText.split(', ');
      let line = '';
      let yOffset = 0;
      
      words.forEach((word, index) => {
        const testLine = line + (line ? ', ' : '') + word;
        if (doc.getTextWidth(testLine) > maxWidth && line) {
          doc.text(line, currentX + 2, currentY + 5 + yOffset);
          line = word;
          yOffset += 3;
          maxYOffset = Math.max(maxYOffset, yOffset);
        } else {
          line = testLine;
        }
      });
      
      if (line) {
        doc.text(line, currentX + 2, currentY + 5 + yOffset);
        maxYOffset = Math.max(maxYOffset, yOffset);
      }
    } else {
      doc.text(itemsText, currentX + 2, currentY + 5);
    }
    
    // Usar a altura estimada calculada anteriormente
    currentY += estimatedHeight;
  });
  
  // Adicionar rodapé em todas as páginas
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    addFooter(i, totalPages);
  }
  
  // Salvar o PDF
  doc.save("relatorio-movimentacoes-sorte-ouro-verde.pdf");
  
  return doc;
};
