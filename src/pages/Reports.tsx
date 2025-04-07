
import { useState } from "react";
import { Layout } from "@/components/Layout/Layout";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
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
import { FileText, Filter } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ItemCategory } from "@/types";
import { generateInventoryPDF } from "@/lib/pdf-generator";

export default function Reports() {
  const { items, movements, stats } = useApp();
  const [activeTab, setActiveTab] = useState("inventory");
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | "all">("all");
  const [selectedMovementType, setSelectedMovementType] = useState<'checkout' | 'return' | 'all'>("all");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  
  const filteredItems = selectedCategory === "all" 
    ? items 
    : items.filter(item => item.category === selectedCategory);
  
  const filteredMovements = movements.filter(movement => {
    const movementDate = new Date(movement.date);
    let matchesType = true;
    
    // Filtro por tipo de movimento
    if (selectedMovementType !== 'all') {
      matchesType = movement.type === selectedMovementType;
    }
    
    // Se não há filtro de data, retorna com base apenas no tipo
    if (!dateRange.from && !dateRange.to) {
      return matchesType;
    }
    
    // Se há apenas data inicial
    if (dateRange.from && !dateRange.to) {
      return movementDate >= dateRange.from && matchesType;
    }
    
    // Se há apenas data final
    if (!dateRange.from && dateRange.to) {
      return movementDate <= dateRange.to && matchesType;
    }
    
    // Se há ambas as datas
    return movementDate >= dateRange.from! && movementDate <= dateRange.to! && matchesType;
  });
  
  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedMovementType("all");
    setDateRange({ from: undefined, to: undefined });
  };
  
  const handleExportInventoryPDF = () => {
    generateInventoryPDF(filteredItems);
  };
  
  return (
    <Layout title="Relatórios">
      <div className="animate-fade-in">
        <Tabs defaultValue="inventory" onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="inventory">Inventário</TabsTrigger>
              <TabsTrigger value="movements">Movimentações</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-3">
              {/* Filtros */}
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
                            ["Máquinas VX", "Máquinas Digital", "Notebook/PC", "Suprimentos", "Material de Escritório", "BANCADAS"]
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
              
              {/* PDF Export Button */}
              {activeTab === "inventory" && (
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={handleExportInventoryPDF}
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
                  {selectedMovementType !== "all" && (
                    <span className="font-medium">
                      Tipo: {selectedMovementType === "checkout" ? "Saída" : "Devolução"}{" "}
                      {" | "}
                    </span>
                  )}
                  {dateRange.from || dateRange.to
                    ? `Período: ${
                        dateRange.from
                          ? format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                          : "Início"
                      } até ${
                        dateRange.to
                          ? format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })
                          : "Hoje"
                      }`
                    : "Todas as movimentações"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Responsável</TableHead>
                      <TableHead>Vendedor</TableHead>
                      <TableHead>Códigos de Itens</TableHead>
                      <TableHead className="text-center">Total Itens</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMovements.length > 0 ? (
                      filteredMovements.map((movement) => (
                        <TableRow key={movement.id}>
                          <TableCell>
                            {format(new Date(movement.date), "dd/MM/yy HH:mm", {
                              locale: ptBR,
                            })}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                movement.type === "checkout"
                                  ? "bg-orange-100 text-orange-600"
                                  : "bg-green-100 text-green-600"
                              }`}
                            >
                              {movement.type === "checkout" ? "Saída" : "Devolução"}
                            </span>
                          </TableCell>
                          <TableCell>{movement.responsibleName}</TableCell>
                          <TableCell>{movement.sellerName || "-"}</TableCell>
                          <TableCell>
                            {movement.items.map(item => item.itemCode).join(", ")}
                          </TableCell>
                          <TableCell className="text-center">
                            {movement.items.reduce(
                              (acc, item) => acc + item.quantity,
                              0
                            )}
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
