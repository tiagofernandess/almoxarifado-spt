import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ItemMovement, Responsible, Seller } from '@/types';

// Interface removida - importação não será mais suportada

// Interface para dados de responsáveis no Excel
export interface ResponsibleExcelData {
  id: string;
  nome: string;
  whatsapp: string;
  endereco: string;
}

// Exportar movimentações para Excel
export const exportMovementsToExcel = (
  movements: ItemMovement[],
  responsibles: Responsible[],
  sellers: Seller[]
) => {
  try {
    // Criar workbook
    const workbook = XLSX.utils.book_new();

    // Preparar dados das movimentações
    const movementsData: MovementExcelData[] = movements.map(movement => ({
      id: movement.id,
      data: new Date(movement.date).toLocaleDateString('pt-BR'),
      tipo: movement.type === 'checkout' ? 'Saída' : 'Devolução',
      responsavel_atual: movement.responsibleName || '',
      responsavel_novo: '', // Campo para edição
      vendedor_atual: movement.sellerName || '',
      vendedor_novo: '', // Campo para edição
      itens: movement.items.map(item => `${item.itemCode} - ${item.itemName} (${item.quantity})`).join('; '),
      observacoes: '' // Campo para observações
    }));

    // Criar planilha de movimentações
    const movementsSheet = XLSX.utils.json_to_sheet(movementsData);
    
    // Definir larguras das colunas
    const movementsColWidths = [
      { wch: 15 }, // id
      { wch: 12 }, // data
      { wch: 10 }, // tipo
      { wch: 25 }, // responsavel_atual
      { wch: 25 }, // responsavel_novo
      { wch: 25 }, // vendedor_atual
      { wch: 25 }, // vendedor_novo
      { wch: 50 }, // itens
      { wch: 30 }  // observacoes
    ];
    movementsSheet['!cols'] = movementsColWidths;

    // Adicionar planilha ao workbook
    XLSX.utils.book_append_sheet(workbook, movementsSheet, 'Movimentações');

    // Preparar dados dos responsáveis para referência
    const responsiblesData: ResponsibleExcelData[] = responsibles.map(responsible => ({
      id: responsible.id,
      nome: responsible.name,
      whatsapp: responsible.whatsapp,
      endereco: responsible.address
    }));

    // Criar planilha de responsáveis
    const responsiblesSheet = XLSX.utils.json_to_sheet(responsiblesData);
    
    // Definir larguras das colunas
    const responsiblesColWidths = [
      { wch: 15 }, // id
      { wch: 25 }, // nome
      { wch: 20 }, // whatsapp
      { wch: 40 }  // endereco
    ];
    responsiblesSheet['!cols'] = responsiblesColWidths;

    // Adicionar planilha ao workbook
    XLSX.utils.book_append_sheet(workbook, responsiblesSheet, 'Responsáveis');

    // Preparar dados dos vendedores para referência
    const sellersData = sellers.map(seller => ({
      id: seller.id,
      nome: seller.name,
      whatsapp: seller.whatsapp,
      endereco: seller.address
    }));

    // Criar planilha de vendedores
    const sellersSheet = XLSX.utils.json_to_sheet(sellersData);
    
    // Definir larguras das colunas
    const sellersColWidths = [
      { wch: 15 }, // id
      { wch: 25 }, // nome
      { wch: 20 }, // whatsapp
      { wch: 40 }  // endereco
    ];
    sellersSheet['!cols'] = sellersColWidths;

    // Adicionar planilha ao workbook
    XLSX.utils.book_append_sheet(workbook, sellersSheet, 'Vendedores');

    // Gerar arquivo Excel
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // Salvar arquivo
    const fileName = `movimentacoes-responsaveis-${new Date().toISOString().split('T')[0]}.xlsx`;
    saveAs(blob, fileName);

    return {
      success: true,
      message: `Arquivo ${fileName} exportado com sucesso!`,
      fileName
    };

  } catch (error: any) {
    console.error('Erro ao exportar Excel:', error);
    return {
      success: false,
      message: `Erro ao exportar Excel: ${error.message}`,
      fileName: null
    };
  }
};

// Função de importação removida - não será mais suportada

// Funções de leitura de arquivo removidas - importação não será mais suportada

// Função de validação removida - importação não será mais suportada

// Gerar template Excel vazio
export const generateEmptyTemplate = (responsibles: Responsible[], sellers: Seller[]) => {
  try {
    // Criar workbook
    const workbook = XLSX.utils.book_new();

    // Criar planilha vazia de movimentações
    const emptyMovementsData: MovementExcelData[] = [{
      id: '',
      data: '',
      tipo: '',
      responsavel_atual: '',
      responsavel_novo: '',
      vendedor_atual: '',
      vendedor_novo: '',
      itens: '',
      observacoes: ''
    }];

    const movementsSheet = XLSX.utils.json_to_sheet(emptyMovementsData);
    movementsSheet['!cols'] = [
      { wch: 15 }, { wch: 12 }, { wch: 10 }, { wch: 25 }, 
      { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 50 }, { wch: 30 }
    ];

    XLSX.utils.book_append_sheet(workbook, movementsSheet, 'Movimentações');

    // Adicionar planilhas de referência
    const responsiblesData = responsibles.map(r => ({
      id: r.id,
      nome: r.name,
      whatsapp: r.whatsapp,
      endereco: r.address
    }));

    const responsiblesSheet = XLSX.utils.json_to_sheet(responsiblesData);
    responsiblesSheet['!cols'] = [{ wch: 15 }, { wch: 25 }, { wch: 20 }, { wch: 40 }];
    XLSX.utils.book_append_sheet(workbook, responsiblesSheet, 'Responsáveis');

    const sellersData = sellers.map(s => ({
      id: s.id,
      nome: s.name,
      whatsapp: s.whatsapp,
      endereco: s.address
    }));

    const sellersSheet = XLSX.utils.json_to_sheet(sellersData);
    sellersSheet['!cols'] = [{ wch: 15 }, { wch: 25 }, { wch: 20 }, { wch: 40 }];
    XLSX.utils.book_append_sheet(workbook, sellersSheet, 'Vendedores');

    // Gerar arquivo
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    const fileName = `template-movimentacoes-${new Date().toISOString().split('T')[0]}.xlsx`;
    saveAs(blob, fileName);

    return {
      success: true,
      message: `Template ${fileName} gerado com sucesso!`,
      fileName
    };

  } catch (error: any) {
    console.error('Erro ao gerar template:', error);
    return {
      success: false,
      message: `Erro ao gerar template: ${error.message}`,
      fileName: null
    };
  }
};

// Interface removida - importação não será mais suportada

// Interface para dados de responsáveis no Excel
export interface ResponsibleExcelData {
  id: string;
  nome: string;
  whatsapp: string;
  endereco: string;
}

// Exportar movimentações para Excel
export const exportMovementsToExcel = (
  movements: ItemMovement[],
  responsibles: Responsible[],
  sellers: Seller[]
) => {
  try {
    // Criar workbook
    const workbook = XLSX.utils.book_new();

    // Preparar dados das movimentações
    const movementsData: MovementExcelData[] = movements.map(movement => ({
      id: movement.id,
      data: new Date(movement.date).toLocaleDateString('pt-BR'),
      tipo: movement.type === 'checkout' ? 'Saída' : 'Devolução',
      responsavel_atual: movement.responsibleName || '',
      responsavel_novo: '', // Campo para edição
      vendedor_atual: movement.sellerName || '',
      vendedor_novo: '', // Campo para edição
      itens: movement.items.map(item => `${item.itemCode} - ${item.itemName} (${item.quantity})`).join('; '),
      observacoes: '' // Campo para observações
    }));

    // Criar planilha de movimentações
    const movementsSheet = XLSX.utils.json_to_sheet(movementsData);
    
    // Definir larguras das colunas
    const movementsColWidths = [
      { wch: 15 }, // id
      { wch: 12 }, // data
      { wch: 10 }, // tipo
      { wch: 25 }, // responsavel_atual
      { wch: 25 }, // responsavel_novo
      { wch: 25 }, // vendedor_atual
      { wch: 25 }, // vendedor_novo
      { wch: 50 }, // itens
      { wch: 30 }  // observacoes
    ];
    movementsSheet['!cols'] = movementsColWidths;

    // Adicionar planilha ao workbook
    XLSX.utils.book_append_sheet(workbook, movementsSheet, 'Movimentações');

    // Preparar dados dos responsáveis para referência
    const responsiblesData: ResponsibleExcelData[] = responsibles.map(responsible => ({
      id: responsible.id,
      nome: responsible.name,
      whatsapp: responsible.whatsapp,
      endereco: responsible.address
    }));

    // Criar planilha de responsáveis
    const responsiblesSheet = XLSX.utils.json_to_sheet(responsiblesData);
    
    // Definir larguras das colunas
    const responsiblesColWidths = [
      { wch: 15 }, // id
      { wch: 25 }, // nome
      { wch: 20 }, // whatsapp
      { wch: 40 }  // endereco
    ];
    responsiblesSheet['!cols'] = responsiblesColWidths;

    // Adicionar planilha ao workbook
    XLSX.utils.book_append_sheet(workbook, responsiblesSheet, 'Responsáveis');

    // Preparar dados dos vendedores para referência
    const sellersData = sellers.map(seller => ({
      id: seller.id,
      nome: seller.name,
      whatsapp: seller.whatsapp,
      endereco: seller.address
    }));

    // Criar planilha de vendedores
    const sellersSheet = XLSX.utils.json_to_sheet(sellersData);
    
    // Definir larguras das colunas
    const sellersColWidths = [
      { wch: 15 }, // id
      { wch: 25 }, // nome
      { wch: 20 }, // whatsapp
      { wch: 40 }  // endereco
    ];
    sellersSheet['!cols'] = sellersColWidths;

    // Adicionar planilha ao workbook
    XLSX.utils.book_append_sheet(workbook, sellersSheet, 'Vendedores');

    // Gerar arquivo Excel
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // Salvar arquivo
    const fileName = `movimentacoes-responsaveis-${new Date().toISOString().split('T')[0]}.xlsx`;
    saveAs(blob, fileName);

    return {
      success: true,
      message: `Arquivo ${fileName} exportado com sucesso!`,
      fileName
    };

  } catch (error: any) {
    console.error('Erro ao exportar Excel:', error);
    return {
      success: false,
      message: `Erro ao exportar Excel: ${error.message}`,
      fileName: null
    };
  }
};

// Função de importação removida - não será mais suportada

// Funções de leitura de arquivo removidas - importação não será mais suportada

// Função de validação removida - importação não será mais suportada

// Gerar template Excel vazio
export const generateEmptyTemplate = (responsibles: Responsible[], sellers: Seller[]) => {
  try {
    // Criar workbook
    const workbook = XLSX.utils.book_new();

    // Criar planilha vazia de movimentações
    const emptyMovementsData: MovementExcelData[] = [{
      id: '',
      data: '',
      tipo: '',
      responsavel_atual: '',
      responsavel_novo: '',
      vendedor_atual: '',
      vendedor_novo: '',
      itens: '',
      observacoes: ''
    }];

    const movementsSheet = XLSX.utils.json_to_sheet(emptyMovementsData);
    movementsSheet['!cols'] = [
      { wch: 15 }, { wch: 12 }, { wch: 10 }, { wch: 25 }, 
      { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 50 }, { wch: 30 }
    ];

    XLSX.utils.book_append_sheet(workbook, movementsSheet, 'Movimentações');

    // Adicionar planilhas de referência
    const responsiblesData = responsibles.map(r => ({
      id: r.id,
      nome: r.name,
      whatsapp: r.whatsapp,
      endereco: r.address
    }));

    const responsiblesSheet = XLSX.utils.json_to_sheet(responsiblesData);
    responsiblesSheet['!cols'] = [{ wch: 15 }, { wch: 25 }, { wch: 20 }, { wch: 40 }];
    XLSX.utils.book_append_sheet(workbook, responsiblesSheet, 'Responsáveis');

    const sellersData = sellers.map(s => ({
      id: s.id,
      nome: s.name,
      whatsapp: s.whatsapp,
      endereco: s.address
    }));

    const sellersSheet = XLSX.utils.json_to_sheet(sellersData);
    sellersSheet['!cols'] = [{ wch: 15 }, { wch: 25 }, { wch: 20 }, { wch: 40 }];
    XLSX.utils.book_append_sheet(workbook, sellersSheet, 'Vendedores');

    // Gerar arquivo
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    const fileName = `template-movimentacoes-${new Date().toISOString().split('T')[0]}.xlsx`;
    saveAs(blob, fileName);

    return {
      success: true,
      message: `Template ${fileName} gerado com sucesso!`,
      fileName
    };

  } catch (error: any) {
    console.error('Erro ao gerar template:', error);
    return {
      success: false,
      message: `Erro ao gerar template: ${error.message}`,
      fileName: null
    };
  }
};