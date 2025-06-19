import { useState } from "react";
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

const itemCategories: ItemCategory[] = [
  "Máquinas VX",
  "Máquinas Digital",
  "Notebook/PC",
  "Suprimentos",
  "Material de Escritório",
  "Bancadas",
  "Chips",
];

interface ItemFormData {
  code: string;
  name: string;
  category: ItemCategory;
  totalQuantity: number;
}

export default function Items() {
  const { items, addItem, updateItem, deleteItem, loading } = useApp();
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
  
  const handleAddItem = async () => {
    if (!formData.code || !formData.name || formData.totalQuantity <= 0) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      await addItem({
        ...formData,
        availableQuantity: formData.totalQuantity,
        inUseQuantity: 0,
      });
      
      resetForm();
      setIsNewItemModalOpen(false);
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleUpdateItem = async () => {
    if (!selectedItem) return;
    
    try {
      setIsSubmitting(true);
      const updatedItem: Partial<Item> = {
        code: formData.code,
        name: formData.name,
        category: formData.category,
        totalQuantity: formData.totalQuantity,
        availableQuantity:
          formData.totalQuantity - (selectedItem.inUseQuantity || 0),
      };
      
      await updateItem(selectedItem.id, updatedItem);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
    } finally {
      setIsSubmitting(false);
    }
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
  
  const confirmDelete = async (item: Item) => {
    try {
      setIsSubmitting(true);
      await deleteItem(item.id);
    } catch (error) {
      console.error('Erro ao excluir item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleExportPDF = () => {
    generateInventoryPDF(items);
  };
  
  if (loading) {
    return (
      <div className="h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between mb-6">
        <div className="flex gap-2">
          <Dialog open={isNewItemModalOpen} onOpenChange={setIsNewItemModalOpen}>
            <DialogTrigger asChild>
              <Button className="flex gap-2 items-center" disabled={isSubmitting}>
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
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Select
                      value={formData.category}
                      onValueChange={handleSelectChange}
                      disabled={isSubmitting}
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
                    placeholder="Digite o nome do item"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalQuantity">Quantidade Total</Label>
                  <Input
                    id="totalQuantity"
                    name="totalQuantity"
                    type="number"
                    value={formData.totalQuantity}
                    onChange={handleInputChange}
                    min={0}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={handleAddItem}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Salvando..." : "Salvar"}
                </Button>
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
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-category">Categoria</Label>
                    <Select
                      value={formData.category}
                      onValueChange={handleSelectChange}
                      disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-totalQuantity">Quantidade Total</Label>
                  <Input
                    id="edit-totalQuantity"
                    name="totalQuantity"
                    type="number"
                    value={formData.totalQuantity}
                    onChange={handleInputChange}
                    min={0}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={handleUpdateItem}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Salvando..." : "Salvar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div>
          <Button
            variant="outline"
            className="flex gap-2 items-center"
            onClick={handleExportPDF}
            disabled={isSubmitting}
          >
            <Download className="h-4 w-4" /> Exportar
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
                        disabled={isSubmitting}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600"
                            disabled={isSubmitting}
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
                              Tem certeza que deseja excluir este item? Esta ação
                              não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel disabled={isSubmitting}>
                              Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => confirmDelete(item)}
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? "Excluindo..." : "Excluir"}
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
  );
}
