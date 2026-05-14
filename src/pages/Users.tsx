import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { User } from "@/types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Storage key for users
const USERS_STORAGE_KEY = "sorte-ouro-verde-users";

// Schema for form validation
const userSchema = z.object({
  username: z.string().min(3, "Nome de usuário deve ter pelo menos 3 caracteres"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

type UserFormData = z.infer<typeof userSchema>;

export default function Users() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Load users from localStorage
  useEffect(() => {
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      // Add default admin user if no users exist
      const defaultUser = { username: "admin", password: "123456" };
      setUsers([defaultUser]);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([defaultUser]));
    }
  }, []);

  // Save users to localStorage when they change
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }
  }, [users]);

  const openNewUserDialog = () => {
    form.reset({ username: "", password: "" });
    setEditingUserId(null);
    setIsDialogOpen(true);
  };

  const openEditUserDialog = (user: User) => {
    form.reset({ username: user.username, password: "" });
    setEditingUserId(user.username);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingUserId(null);
    form.reset();
  };

  const saveUser = (data: UserFormData) => {
    if (editingUserId) {
      // Update existing user
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.username === editingUserId
            ? { username: data.username, password: data.password || user.password }
            : user
        )
      );
      toast({
        title: "Usuário atualizado",
        description: `${data.username} foi atualizado com sucesso.`
      });
    } else {
      // Check if username already exists
      if (users.some((user) => user.username === data.username)) {
        form.setError("username", {
          type: "manual",
          message: "Este nome de usuário já existe"
        });
        return;
      }

      // Add new user with required username and password
      setUsers((prevUsers) => [...prevUsers, { 
        username: data.username, 
        password: data.password 
      }]);
      
      toast({
        title: "Usuário adicionado",
        description: `${data.username} foi adicionado com sucesso.`
      });
    }
    closeDialog();
  };

  const deleteUser = (username: string) => {
    // Prevent deleting the last user
    if (users.length <= 1) {
      toast({
        title: "Operação não permitida",
        description: "Deve existir pelo menos um usuário no sistema.",
        variant: "destructive"
      });
      return;
    }

    setUsers((prevUsers) => prevUsers.filter((user) => user.username !== username));
    toast({
      title: "Usuário excluído",
      description: `${username} foi removido com sucesso.`
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Gerenciamento de Usuários</CardTitle>
            <CardDescription>
              Cadastre e gerencie usuários com acesso ao sistema
            </CardDescription>
          </div>
          <Button onClick={openNewUserDialog} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" /> Novo Usuário
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome de Usuário</TableHead>
                <TableHead className="w-[150px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.username}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditUserDialog(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => deleteUser(user.username)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* User Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingUserId ? "Editar Usuário" : "Novo Usuário"}
            </DialogTitle>
            <DialogDescription>
              {editingUserId
                ? "Atualize os dados do usuário"
                : "Preencha os campos para adicionar um novo usuário"}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(saveUser)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome de Usuário</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Digite o nome de usuário" 
                        {...field} 
                        disabled={!!editingUserId}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {editingUserId ? "Nova Senha" : "Senha"}
                      {editingUserId && " (deixe em branco para manter a atual)"}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Digite a senha"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="gap-2 sm:gap-0">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingUserId ? "Salvar Alterações" : "Adicionar Usuário"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
