import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Edit2, Trash2, FileText } from "lucide-react";
import { Responsible } from "@/types";
import { generateResponsiblesPDF } from "@/lib/pdf-generator";

interface ResponsibleFormData {
  name: string;
  whatsapp: string;
  address: string;
}

export default function Responsibles() {
  const { responsibles, addResponsible, updateResponsible, deleteResponsible, loading } = useApp();
  const [isNewResponsibleModalOpen, setIsNewResponsibleModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedResponsible, setSelectedResponsible] = useState<Responsible | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<ResponsibleFormData>({
    name: "",
    whatsapp: "",
    address: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    try {
      if (selectedResponsible) {
        await updateResponsible(selectedResponsible.id, formData);
      } else {
        await addResponsible(formData);
      }
      
      setFormData({ name: "", whatsapp: "", address: "" });
      setIsNewResponsibleModalOpen(false);
      setIsEditModalOpen(false);
      setSelectedResponsible(null);
    } catch (error) {
      console.error("Erro ao salvar responsável:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (responsible: Responsible) => {
    setSelectedResponsible(responsible);
    setFormData({
      name: responsible.name,
      whatsapp: responsible.whatsapp || "",
      address: responsible.address || "",
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este responsável?")) {
      try {
        await deleteResponsible(id);
      } catch (error) {
        console.error("Erro ao excluir responsável:", error);
      }
    }
  };

  const handleGeneratePDF = () => {
    generateResponsiblesPDF(responsibles);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Responsáveis</h1>
          <p className="text-muted-foreground">
            Gerencie os responsáveis pelos itens do estoque
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleGeneratePDF} variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Gerar PDF
          </Button>
          <Dialog open={isNewResponsibleModalOpen} onOpenChange={setIsNewResponsibleModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Responsável
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Responsável</DialogTitle>
                <DialogDescription>
                  Adicione um novo responsável ao sistema
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nome do responsável"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Endereço completo"
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsNewResponsibleModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Salvando..." : "Salvar"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Responsáveis</CardTitle>
          <CardDescription>
            {responsibles.length} responsável{responsibles.length !== 1 ? 'is' : ''} cadastrado{responsibles.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              {responsibles.length > 0 ? (
                responsibles
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((responsible) => (
                    <TableRow key={responsible.id}>
                      <TableCell className="font-medium">{responsible.name}</TableCell>
                      <TableCell>{responsible.whatsapp || "-"}</TableCell>
                      <TableCell>{responsible.address || "-"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(responsible)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(responsible.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    Nenhum responsável cadastrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal de Edição */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Responsável</DialogTitle>
            <DialogDescription>
              Edite as informações do responsável
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nome *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nome do responsável"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-whatsapp">WhatsApp</Label>
              <Input
                id="edit-whatsapp"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="(11) 99999-9999"
              />
            </div>
            <div>
              <Label htmlFor="edit-address">Endereço</Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Endereço completo"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
