import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FileText, Filter, Edit2, Trash2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ItemCategory, ItemMovement } from "@/types";
import { generateInventoryPDF, generateMovementsReportPDF } from "@/lib/pdf-generator";

export default function Reports() {
  const { items, movements, stats, sellers, updateMovement, deleteMovement } = useApp();
  const [activeTab, setActiveTab] = useState("inventory");
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | "all">("all");
  const [selectedMovementType, setSelectedMovementType] = useState<'checkout' | 'return' | 'all'>("all");
  const [selectedResponsible, setSelectedResponsible] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  
  // Estado para o modal de edição
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMovement, setEditingMovement] = useState<ItemMovement | null>(null);
  const [selectedSellerId, setSelectedSellerId] = useState<string>("");
  const [editResponsibleName, setEditResponsibleName] = useState<string>("");
  
  // Obter lista única de responsáveis
  const responsibles = [...new Set(movements.map(m => m.responsibleName))].sort();
  
  const filteredItems = selectedCategory === "all" 
    ? items 
    : items.filter(item => item.category === selectedCategory);
  
  const filteredMovements = movements.filter(movement => {
    const movementDate = new Date(movement.date);
    let matchesType = true;
    let matchesResponsible = true;
    
    if (selectedMovementType !== 'all') {
      matchesType = movement.type === selectedMovementType;
    }

    if (selectedResponsible !== 'all') {
      matchesResponsible = movement.responsibleName === selectedResponsible;
    }
    
    if (!dateRange.from && !dateRange.to) {
      return matchesType && matchesResponsible;
    }
    
    if (dateRange.from && !dateRange.to) {
      return movementDate >= dateRange.from && matchesType && matchesResponsible;
    }
    
    if (!dateRange.from && dateRange.to) {
      return movementDate <= dateRange.to && matchesType && matchesResponsible;
    }
    
    return movementDate >= dateRange.from! && 
           movementDate <= dateRange.to! && 
           matchesType && 
           matchesResponsible;
  });
  
  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedMovementType("all");
    setSelectedResponsible("all");
    setDateRange({ from: undefined, to: undefined });
  };
  
  const handleExportInventoryPDF = () => {
    generateInventoryPDF(filteredItems);
  };

  const handleExportMovementsPDF = () => {
    generateMovementsReportPDF(filteredMovements, {
      type: selectedMovementType,
      responsible: selectedResponsible,
      dateRange: dateRange
    });
  };

  const handleEditMovement = (movement: ItemMovement) => {
    setEditingMovement(movement);
    setSelectedSellerId(movement.sellerId || "none");
    setEditResponsibleName(movement.responsibleName || "");
    setIsEditModalOpen(true);
  };

  const handleUpdateMovement = async () => {
    if (!editingMovement) return;
    try {
      const seller = sellers.find(s => s.id === selectedSellerId);
      await updateMovement(editingMovement.id, {
        sellerId: selectedSellerId === "none" ? undefined : selectedSellerId,
        sellerName: selectedSellerId === "none" ? undefined : seller?.name,
        responsibleName: editResponsibleName,
        items: editingMovement.items
      });
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Erro ao atualizar movimentação:', error);
    }
  };

  const handleDeleteMovement = async (movementId: string) => {
    try {
      await deleteMovement(movementId);
    } catch (error) {
      console.error("Erro ao excluir movimentação:", error);
    }
  };
  
  return (
    <>
      <div className="animate-fade-in">
        <Tabs defaultValue="inventory" onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="inventory">Inventário</TabsTrigger>
              <TabsTrigger value="movements">Movimentações</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" /> Filtros
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <h4 className="font-medium">Filtros do Relatório</h4>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Categoria</label>
                      <Select
                        value={selectedCategory}
                        onValueChange={(value) => setSelectedCategory(value as ItemCategory | "all")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Todas as categorias" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas as categorias</SelectItem>
                          {
                            ["Máquinas VX", "Máquinas Digital", "Notebook/PC", "Suprimentos", "Material de Escritório", "Bancadas", "Chips"]
                              .map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))
                          }
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {activeTab === "movements" && (
                      <>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Tipo de Movimentação</label>
                          <Select
                            value={selectedMovementType}
                            onValueChange={(value) => setSelectedMovementType(value as 'checkout' | 'return' | 'all')}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Todos os tipos" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Todos os tipos</SelectItem>
                              <SelectItem value="checkout">Saída</SelectItem>
                              <SelectItem value="return">Devolução</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Responsável</label>
                          <Select
                            value={selectedResponsible}
                            onValueChange={(value) => setSelectedResponsible(value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Todos os responsáveis" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Todos os responsáveis</SelectItem>
                              {responsibles.map((responsible) => (
                                <SelectItem key={responsible} value={responsible}>
                                  {responsible}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Período</label>
                          <div className="flex flex-col gap-2">
                            <Calendar
                              mode="range"
                              selected={dateRange}
                              onSelect={(range) => setDateRange(range as any)}
                              className="border rounded-md p-2"
                            />
                          </div>
                        </div>
                      </>
                    )}
                    
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={resetFilters}
                    >
                      Limpar Filtros
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              
              {activeTab === "inventory" ? (
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={handleExportInventoryPDF}
                >
                  <FileText className="h-4 w-4" /> PDF
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={handleExportMovementsPDF}
                >
                  <FileText className="h-4 w-4" /> PDF
                </Button>
              )}
            </div>
          </div>
          
          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <CardTitle>Relatório de Inventário</CardTitle>
                <CardDescription>
                  {selectedCategory === "all"
                    ? "Todos os itens do estoque"
                    : `Itens da categoria: ${selectedCategory}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead className="text-center">Qtd. Total</TableHead>
                      <TableHead className="text-center">Disponível</TableHead>
                      <TableHead className="text-center">Em Uso</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.length > 0 ? (
                      filteredItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.code}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell className="text-center">
                            {item.totalQuantity}
                          </TableCell>
                          <TableCell className="text-center">
                            {item.availableQuantity}
                          </TableCell>
                          <TableCell className="text-center">
                            {item.inUseQuantity}
                          </TableCell>
                          <TableCell className="text-center">
                            {item.availableQuantity === 0 ? (
                              <span className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full">
                                Indisponível
                              </span>
                            ) : item.availableQuantity < item.totalQuantity * 0.2 ? (
                              <span className="px-2 py-1 text-xs bg-orange-100 text-orange-600 rounded-full">
                                Baixo
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded-full">
                                Normal
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6">
                          Nenhum item encontrado
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="movements">
            <Card>
              <CardHeader>
                <CardTitle>Relatório de Movimentações</CardTitle>
                <CardDescription>
                  {selectedMovementType === "all"
                    ? "Todas as movimentações"
                    : selectedMovementType === "checkout"
                    ? "Saídas"
                    : "Devoluções"}
                  {selectedResponsible !== "all" && ` - Responsável: ${selectedResponsible}`}
                  {(dateRange.from || dateRange.to) && (
                    ` - Período: ${
                      dateRange.from
                        ? format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                        : "início"
                    } até ${
                      dateRange.to
                        ? format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })
                        : "hoje"
                    }`
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Responsável</TableHead>
                        <TableHead>Vendedor</TableHead>
                        <TableHead>Itens</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMovements.length > 0 ? (
                        filteredMovements.map((movement) => (
                          <TableRow key={movement.id}>
                            <TableCell>
                              {format(new Date(movement.date), "dd/MM/yyyy", {
                                locale: ptBR,
                              })}
                            </TableCell>
                            <TableCell>
                              {movement.type === "checkout" ? "Saída" : "Devolução"}
                            </TableCell>
                            <TableCell>{movement.responsibleName}</TableCell>
                            <TableCell>{movement.sellerName || "-"}</TableCell>
                            <TableCell>
                              <ul className="list-disc list-inside">
                                {movement.items.map((item, index) => (
                                  <li key={index}>
                                    {item.itemCode} - {item.itemName} ({item.quantity})
                                  </li>
                                ))}
                              </ul>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditMovement(movement)}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-red-500 hover:text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Confirmar exclusão
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Tem certeza que deseja excluir esta movimentação? 
                                        Esta ação irá reverter as quantidades dos itens no estoque e não pode ser desfeita.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancelar
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteMovement(movement.id)}
                                        className="bg-red-500 hover:bg-red-600"
                                      >
                                        Excluir
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-6">
                            Nenhuma movimentação encontrada
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de Edição */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Movimentação</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Responsável</Label>
              <Input
                value={editResponsibleName}
                onChange={e => setEditResponsibleName(e.target.value)}
                placeholder="Nome do responsável"
              />
            </div>
            <div className="space-y-2">
              <Label>Vendedor</Label>
              <Select
                value={selectedSellerId}
                onValueChange={setSelectedSellerId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um vendedor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum</SelectItem>
                  {sellers.map((seller) => (
                    <SelectItem key={seller.id} value={seller.id}>
                      {seller.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateMovement}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
