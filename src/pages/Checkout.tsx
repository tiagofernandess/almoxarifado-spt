import { useState } from "react";
import { Layout } from "@/components/Layout/Layout";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2, FileText } from "lucide-react";
import { generateMovementPDF } from "@/lib/pdf-generator";
import { ItemMovement } from "@/types";

interface CheckoutItem {
  itemId: string;
  itemName: string;
  itemCode: string;
  quantity: number;
  availableQuantity: number;
}

export default function Checkout() {
  const { items, sellers, responsibles, addCheckout, movements } = useApp();
  const [selectedResponsibleId, setSelectedResponsibleId] = useState("");
  const [selectedSellerId, setSelectedSellerId] = useState("");
  const [selectedItems, setSelectedItems] = useState<CheckoutItem[]>([]);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedItemQuantity, setSelectedItemQuantity] = useState(1);
  const [itemSearch, setItemSearch] = useState("");
  const [checkoutDate, setCheckoutDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isPontoNovo, setIsPontoNovo] = useState(false); // Mantido para compatibilidade
  const [movimentoType, setMovimentoType] = useState<'ponto_novo' | 'troca' | null>(null);
  const [pontoNovoInfo, setPontoNovoInfo] = useState("");
  const [trocaInfo, setTrocaInfo] = useState("");
  
  // Estado para o comprovante atual
  const [currentMovement, setCurrentMovement] = useState<ItemMovement | null>(null);
  
  // Filtra os itens para mostrar apenas os que correspondem à busca
  // Mostra todos os itens (mesmo os sem estoque) para debug
  const availableItems = items.filter((item) =>
    item.code.toLowerCase().includes(itemSearch.toLowerCase()) || item.name.toLowerCase().includes(itemSearch.toLowerCase())
  );
  
  const handleAddItemToCheckout = () => {
    if (!selectedItemId) return;
    
    // Validar que o tipo de movimentação foi selecionado
    if (!movimentoType) {
      alert('Por favor, selecione se é Ponto Novo ou Troca antes de adicionar itens.');
      return;
    }
    
    // Se for ponto novo, validar que as informações foram preenchidas
    if (movimentoType === 'ponto_novo' && !pontoNovoInfo.trim()) {
      alert('Por favor, informe as informações do ponto novo antes de adicionar itens.');
      return;
    }
    
    // Se for troca, validar que as informações foram preenchidas
    if (movimentoType === 'troca' && !trocaInfo.trim()) {
      alert('Por favor, informe para quem foi a troca antes de adicionar itens.');
      return;
    }
    
    const item = items.find((i) => i.id === selectedItemId);
    if (!item) return;
    
    // Verifica se o item já foi adicionado
    const existingItem = selectedItems.find((i) => i.itemId === selectedItemId);
    
    if (existingItem) {
      // Atualiza a quantidade se o item já estiver na lista
      setSelectedItems(
        selectedItems.map((i) =>
          i.itemId === selectedItemId
            ? {
                ...i,
                quantity: i.quantity + selectedItemQuantity,
              }
            : i
        )
      );
    } else {
      // Adiciona o item à lista
      setSelectedItems([
        ...selectedItems,
        {
          itemId: item.id,
          itemName: item.name,
          itemCode: item.code,
          quantity: selectedItemQuantity,
          availableQuantity: item.availableQuantity,
        },
      ]);
    }
    
    // Reseta os campos do modal
    setSelectedItemId("");
    setSelectedItemQuantity(1);
    setIsAddItemModalOpen(false);
  };
  
  const handleRemoveItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };
  
  const handleQuantityChange = (index: number, quantity: number) => {
    const item = selectedItems[index];
    
    // Não permitir quantidade maior que o disponível
    if (quantity > item.availableQuantity) {
      quantity = item.availableQuantity;
    }
    
    // Não permitir quantidade menor que 1
    if (quantity < 1) {
      quantity = 1;
    }
    
    setSelectedItems(
      selectedItems.map((item, i) =>
        i === index ? { ...item, quantity } : item
      )
    );
  };
  
  const handleItemSelect = (itemId: string) => {
    setSelectedItemId(itemId);
    const item = items.find((i) => i.id === itemId);
    if (item) {
      setSelectedItemQuantity(1);
    }
  };
  
  const handleCheckout = async () => {
    if (!selectedResponsibleId || selectedItems.length === 0) {
      return;
    }
    
    try {
      const responsible = responsibles.find((r) => r.id === selectedResponsibleId);
      const seller = sellers.find((s) => s.id === selectedSellerId);
      
      if (!responsible) {
        console.error("Responsável não encontrado");
        return;
      }
      
      const movementData = {
        responsibleName: responsible.name,
        sellerId: selectedSellerId || undefined,
        sellerName: seller ? seller.name : undefined,
        date: new Date(checkoutDate + 'T00:00:00').toISOString(),
        pontoNovo: movimentoType === 'ponto_novo', // Mantido para compatibilidade
        movimentoType: movimentoType,
        pontoNovoInfo: movimentoType === 'ponto_novo' ? pontoNovoInfo : undefined,
        trocaInfo: movimentoType === 'troca' ? trocaInfo : undefined,
        items: selectedItems.map((item) => ({
          itemId: item.itemId,
          itemName: item.itemName,
          itemCode: item.itemCode,
          quantity: item.quantity,
        })),
      };
      
      const newMovement = await addCheckout(movementData);
      setCurrentMovement(newMovement);
      generateMovementPDF(newMovement, sellers);
      
      // Reset form
      setSelectedResponsibleId("");
      setSelectedSellerId("");
      setSelectedItems([]);
      setIsPontoNovo(false);
      setMovimentoType(null);
      setPontoNovoInfo("");
      setTrocaInfo("");
    } catch (error: any) {
      console.error('Erro ao processar checkout:', error);
    }
  };
  
  // Verifica se o formulário é válido
  const isFormValid = selectedResponsibleId && 
                      selectedItems.length > 0 && 
                      movimentoType !== null &&
                      ((movimentoType === 'ponto_novo' && pontoNovoInfo.trim() !== '') || 
                       (movimentoType === 'troca' && trocaInfo.trim() !== ''));
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Registro de Saída</CardTitle>
            <CardDescription>
              Preencha os campos abaixo para registrar a saída de itens
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Dados do responsável e vendedor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="responsible">Responsável</Label>
                <Select
                  value={selectedResponsibleId}
                  onValueChange={setSelectedResponsibleId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o responsável" />
                  </SelectTrigger>
                  <SelectContent>
                    {responsibles.map((responsible) => (
                      <SelectItem key={responsible.id} value={responsible.id}>
                        {responsible.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="seller">Vendedor (opcional)</Label>
                <Select value={selectedSellerId} onValueChange={setSelectedSellerId}>
                  <SelectTrigger id="seller">
                    <SelectValue placeholder="Selecione o vendedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {sellers.map((seller) => (
                      <SelectItem key={seller.id} value={seller.id}>
                        {seller.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Campo de data */}
            <div className="space-y-2">
              <Label htmlFor="checkoutDate">Data da Saída</Label>
              <Input
                id="checkoutDate"
                type="date"
                value={checkoutDate}
                onChange={(e) => setCheckoutDate(e.target.value)}
              />
            </div>
            
            {/* Botões de seleção: Ponto Novo ou Troca */}
            <div className="space-y-2">
              <Label>Tipo de Saída</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={movimentoType === 'ponto_novo' ? 'default' : 'outline'}
                  onClick={() => {
                    setMovimentoType('ponto_novo');
                    setIsPontoNovo(true);
                    setPontoNovoInfo("");
                    setTrocaInfo("");
                  }}
                  className="flex-1"
                >
                  Ponto Novo
                </Button>
                <Button
                  type="button"
                  variant={movimentoType === 'troca' ? 'default' : 'outline'}
                  onClick={() => {
                    setMovimentoType('troca');
                    setIsPontoNovo(false);
                    setPontoNovoInfo("");
                  }}
                  className="flex-1"
                >
                  Troca
                </Button>
              </div>
            </div>
            
            {/* Campo de informações de ponto novo */}
            {movimentoType === 'ponto_novo' && (
              <div className="space-y-2">
                <Label htmlFor="pontoNovoInfo">Informações do Ponto Novo</Label>
                <Input
                  id="pontoNovoInfo"
                  placeholder="Digite as informações do ponto novo..."
                  value={pontoNovoInfo}
                  onChange={(e) => setPontoNovoInfo(e.target.value)}
                />
              </div>
            )}
            
            {/* Campo de informações de troca */}
            {movimentoType === 'troca' && (
              <div className="space-y-2">
                <Label htmlFor="trocaInfo">Informações da Troca</Label>
                <Input
                  id="trocaInfo"
                  placeholder="Digite para quem foi a troca..."
                  value={trocaInfo}
                  onChange={(e) => setTrocaInfo(e.target.value)}
                />
              </div>
            )}
            
            {/* Itens selecionados */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Itens</h3>
                <Dialog
                  open={isAddItemModalOpen}
                  onOpenChange={setIsAddItemModalOpen}
                >
                  <DialogTrigger asChild>
                    <Button 
                      size="sm" 
                      className="flex items-center gap-1"
                      disabled={!movimentoType || 
                                (movimentoType === 'ponto_novo' && !pontoNovoInfo.trim()) ||
                                (movimentoType === 'troca' && !trocaInfo.trim())}
                    >
                      <Plus className="h-4 w-4" /> Adicionar Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Item à Saída</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="item-search">Buscar por código ou nome</Label>
                        <Input
                          id="item-search"
                          placeholder="Digite o código ou nome do item"
                          value={itemSearch}
                          onChange={e => setItemSearch(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="item">Item</Label>
                          <span className="text-xs text-muted-foreground">
                            Total: {availableItems.length} itens
                          </span>
                        </div>
                        <Select
                          value={selectedItemId}
                          onValueChange={handleItemSelect}
                        >
                          <SelectTrigger id="item">
                            <SelectValue placeholder="Selecione o item (ou busque pelo código acima)" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableItems.map((item) => (
                              <SelectItem key={item.id} value={item.id} disabled={item.availableQuantity <= 0}>
                                {item.code} - {item.name} {item.availableQuantity <= 0 ? '(SEM ESTOQUE)' : `(Disponível: ${item.availableQuantity})`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantidade</Label>
                        <Input
                          id="quantity"
                          type="number"
                          min={1}
                          max={selectedItemId ? (items.find(i => i.id === selectedItemId)?.availableQuantity || 1) : 1}
                          value={selectedItemQuantity}
                          onChange={(e) => setSelectedItemQuantity(Number(e.target.value))}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleAddItemToCheckout} disabled={!selectedItemId || selectedItemQuantity < 1}>
                        Adicionar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-center">Quantidade</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedItems.length > 0 ? (
                      selectedItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {item.itemCode}
                          </TableCell>
                          <TableCell>{item.itemName}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center">
                              <Input
                                type="number"
                                min={1}
                                max={item.availableQuantity}
                                value={item.quantity}
                                onChange={(e) =>
                                  handleQuantityChange(
                                    index,
                                    parseInt(e.target.value) || 1
                                  )
                                }
                                className="w-20 text-center"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveItem(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-6">
                          Nenhum item adicionado
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedResponsibleId("");
                setSelectedSellerId("");
                setSelectedItems([]);
                setIsPontoNovo(false);
                setMovimentoType(null);
                setPontoNovoInfo("");
                setTrocaInfo("");
                setCheckoutDate(new Date().toISOString().split('T')[0]);
              }}
            >
              Limpar
            </Button>
            <Button onClick={handleCheckout} disabled={!isFormValid}>
              Registrar Saída
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" /> Comprovante
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentMovement ? (
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h3 className="font-medium">Dados Gerais</h3>
                  <p className="text-sm text-muted-foreground">
                    Responsável: {currentMovement.responsibleName}
                  </p>
                  {currentMovement.sellerName && (
                    <p className="text-sm text-muted-foreground">
                      Vendedor: {currentMovement.sellerName}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Data: {new Date(currentMovement.date).toLocaleDateString()}
                  </p>
                  {currentMovement.movimentoType === 'ponto_novo' || currentMovement.pontoNovo ? (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-pink-600">
                        📍 Saída para Ponto Novo
                      </p>
                      {currentMovement.pontoNovoInfo && (
                        <p className="text-sm text-muted-foreground">
                          {currentMovement.pontoNovoInfo}
                        </p>
                      )}
                    </div>
                  ) : currentMovement.movimentoType === 'troca' && currentMovement.trocaInfo ? (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-blue-600">
                        🔄 Saída para Troca
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Troca para: {currentMovement.trocaInfo}
                      </p>
                    </div>
                  ) : null}
                </div>
                <div>
                  <h3 className="font-medium mb-2">Itens</h3>
                  <ul className="space-y-1">
                    {currentMovement.items.map((item, i) => (
                      <li key={i} className="text-sm flex justify-between">
                        <span>
                          {item.itemCode} - {item.itemName}
                        </span>
                        <span className="font-medium">{item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() =>
                    generateMovementPDF(currentMovement, sellers)
                  }
                >
                  <FileText className="h-4 w-4 mr-2" /> Gerar PDF
                </Button>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <p>Não há comprovante gerado.</p>
                <p className="text-sm">
                  Registre uma saída para gerar um comprovante.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
