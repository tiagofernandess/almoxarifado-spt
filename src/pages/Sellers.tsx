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
import { Label } from "@/components/ui/label";
import { Seller } from "@/types";
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
import { generateSellersPDF } from "@/lib/pdf-generator";

interface SellerFormData {
  name: string;
  whatsapp: string;
  address: string;
}

export default function Sellers() {
  const { sellers, addSeller, updateSeller, deleteSeller, loading } = useApp();
  const [isNewSellerModalOpen, setIsNewSellerModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<SellerFormData>({
    name: "",
    whatsapp: "",
    address: "",
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const resetForm = () => {
    setFormData({
      name: "",
      whatsapp: "",
      address: "",
    });
  };
  
  const handleAddSeller = async () => {
    if (!formData.name || !formData.whatsapp) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      await addSeller(formData);
      resetForm();
      setIsNewSellerModalOpen(false);
    } catch (error) {
      console.error('Erro ao adicionar vendedor:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleUpdateSeller = async () => {
    if (!selectedSeller) return;
    
    try {
      setIsSubmitting(true);
      await updateSeller(selectedSeller.id, formData);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Erro ao atualizar vendedor:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const openEditModal = (seller: Seller) => {
    setSelectedSeller(seller);
    setFormData({
      name: seller.name,
      whatsapp: seller.whatsapp,
      address: seller.address,
    });
    setIsEditModalOpen(true);
  };
  
  const confirmDelete = async (seller: Seller) => {
    try {
      setIsSubmitting(true);
      await deleteSeller(seller.id);
    } catch (error) {
      console.error('Erro ao excluir vendedor:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleExportPDF = () => {
    try {
      if (sellers && sellers.length > 0) {
        generateSellersPDF(sellers);
      }
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    }
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
          <Dialog open={isNewSellerModalOpen} onOpenChange={setIsNewSellerModalOpen}>
            <DialogTrigger asChild>
              <Button className="flex gap-2 items-center" disabled={isSubmitting}>
                <Plus className="h-4 w-4" /> Novo Vendedor
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Vendedor</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nome do vendedor"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    placeholder="Ex: (11) 99999-9999"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Endereço completo"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={handleAddSeller}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Salvando..." : "Salvar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
              <TableHead>Nome</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>Endereço</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sellers.map((seller) => (
              <TableRow key={seller.id}>
                <TableCell>{seller.name}</TableCell>
                <TableCell>{seller.whatsapp}</TableCell>
                <TableCell>{seller.address}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditModal(seller)}
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
                          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir este vendedor? Esta ação
                            não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={isSubmitting}>
                            Cancelar
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => confirmDelete(seller)}
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
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Vendedor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-whatsapp">WhatsApp</Label>
              <Input
                id="edit-whatsapp"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-address">Endereço</Label>
              <Input
                id="edit-address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleUpdateSeller}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
