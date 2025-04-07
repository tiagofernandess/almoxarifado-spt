
import { useState } from "react";
import { Layout } from "@/components/Layout/Layout";
import { useApp } from "@/context/AppContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Item, ItemCategory } from "@/types";
import { Plus, Edit, Trash2, Download } from "lucide-react";
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
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { generateInventoryPDF } from "@/lib/pdf-generator";
import { generateInventoryExcel } from "@/lib/excel-generator";

const itemCategories: ItemCategory[] = [
  "Máquinas VX",
  "Máquinas Digital",
  "Notebook/PC",
  "Suprimentos",
  "Material de Escritório",
];

interface ItemFormData {
  code: string;
  name: string;
  category: ItemCategory;
  totalQuantity: number;
}

export default function Items() {
  const { items, addItem, updateItem, deleteItem } = useApp();
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  
  const [formData, setFormData] = useState<ItemFormData>({
    code: "",
    name: "",
    category: "Máquinas VX",
    totalQuantity: 0,
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "totalQuantity" ? parseInt(value) || 0 : value,
    }));
  };
  
  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value as ItemCategory,
    }));
  };
  
  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      category: "Máquinas VX",
      totalQuantity: 0,
    });
  };
  
  const handleAddItem = () => {
    if (!formData.code || !formData.name || formData.totalQuantity <= 0) {
      return;
    }
    
    addItem({
      ...formData,
      availableQuantity: formData.totalQuantity,
      inUseQuantity: 0,
    });
    
    resetForm();
    setIsNewItemModalOpen(false);
  };
  
  const handleUpdateItem = () => {
    if (!selectedItem) return;
    
    const updatedItem: Partial<Item> = {
      code: formData.code,
      name: formData.name,
      category: formData.category,
      totalQuantity: formData.totalQuantity,
      availableQuantity:
        formData.totalQuantity - (selectedItem.inUseQuantity || 0),
    };
    
    updateItem(selectedItem.id, updatedItem);
    setIsEditModalOpen(false);
  };
  
  const openEditModal = (item: Item) => {
    setSelectedItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      category: item.category,
      totalQuantity: item.totalQuantity,
    });
    setIsEditModalOpen(true);
  };
  
  const confirmDelete = (item: Item) => {
    deleteItem(item.id);
  };
  
  const handleExportPDF = () => {
    generateInventoryPDF(items);
  };
  
  const handleExportExcel = () => {
    generateInventoryExcel(items);
  };
  
  return (
    <Layout title="Gestão de Itens">
      <div className="animate-fade-in">
        <div className="flex justify-between mb-6">
          <div className="flex gap-2">
            <Dialog open={isNewItemModalOpen} onOpenChange={setIsNewItemModalOpen}>
              <DialogTrigger asChild>
                <Button className="flex gap-2 items-center">
                  <Plus className="h-4 w-4" /> Novo Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Item</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="code">Código</Label>
                      <Input
                        id="code"
                        name="code"
                        value={formData.code}
                        onChange={handleInputChange}
                        placeholder="Ex: VX-001"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Categoria</Label>
                      <Select
                        value={formData.category}
                        onValueChange={handleSelectChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {itemCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome do Item</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Ex: Máquina VX 850"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalQuantity">Quantidade Total</Label>
                    <Input
                      id="totalQuantity"
                      name="totalQuantity"
                      type="number"
                      min={0}
                      value={formData.totalQuantity}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsNewItemModalOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleAddItem}>Salvar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editar Item</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-code">Código</Label>
                      <Input
                        id="edit-code"
                        name="code"
                        value={formData.code}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-category">Categoria</Label>
                      <Select
                        value={formData.category}
                        onValueChange={handleSelectChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {itemCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Nome do Item</Label>
                    <Input
                      id="edit-name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-totalQuantity">Quantidade Total</Label>
                    <Input
                      id="edit-totalQuantity"
                      name="totalQuantity"
                      type="number"
                      min={selectedItem?.inUseQuantity || 0}
                      value={formData.totalQuantity}
                      onChange={handleInputChange}
                    />
                    {selectedItem && selectedItem.inUseQuantity > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Atenção: {selectedItem.inUseQuantity} unidades estão em uso.
                      </p>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleUpdateItem}>Salvar Alterações</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex gap-2 items-center"
              onClick={handleExportExcel}
            >
              <Download className="h-4 w-4" /> Excel
            </Button>
            <Button
              variant="outline"
              className="flex gap-2 items-center"
              onClick={handleExportPDF}
            >
              <Download className="h-4 w-4" /> PDF
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-center">Qtd. Total</TableHead>
                <TableHead className="text-center">Disponível</TableHead>
                <TableHead className="text-center">Em Uso</TableHead>
                <TableHead className="text-center">Atualizado</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length > 0 ? (
                items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.code}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="text-center">{item.totalQuantity}</TableCell>
                    <TableCell className="text-center">{item.availableQuantity}</TableCell>
                    <TableCell className="text-center">{item.inUseQuantity}</TableCell>
                    <TableCell className="text-center">
                      {format(new Date(item.updatedAt), "dd/MM/yy", {
                        locale: ptBR,
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditModal(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Confirmar exclusão
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Deseja realmente excluir o item{" "}
                                <strong>{item.name}</strong>? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => confirmDelete(item)}>
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
                  <TableCell colSpan={8} className="text-center py-6">
                    Nenhum item cadastrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
}
