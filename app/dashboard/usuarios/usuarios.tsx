'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import type { Usuario } from '@/types/interfaces';
import { UsuarioForm } from './usuario-form';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import { usuarioService } from '@/services/usuarioService';

export function Usuarios() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    setIsLoading(true);
    try {
      const response = await usuarioService.listarTodos();
      const usuariosData = Array.isArray(response.data) ? response.data : [];
      setUsuarios(usuariosData);
      setFilteredUsuarios(usuariosData);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os usuários.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (usuario: Usuario) => {
    try {
      if (usuario.id) {
        await usuarioService.atualizar(usuario.id, usuario);
      } else {
        await usuarioService.salvar(usuario);
      }
      await fetchUsuarios();
      toast({
        title: 'Sucesso',
        description: `Usuário ${usuario.id ? 'atualizado' : 'criado'} com sucesso.`,
      });
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      toast({
        title: 'Erro',
        description: `Não foi possível ${usuario.id ? 'atualizar' : 'criar'} o usuário.`,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: number) => {
    setLoadingId(id);
    try {
      await usuarioService.deletar(id);
      await fetchUsuarios();
      toast({
        title: 'Sucesso',
        description: 'Usuário excluído com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o usuário.',
        variant: 'destructive',
      });
    } finally {
      setLoadingId(null);
    }
  };

  const handleRowClick = (id: number) => {
    router.push(`/usuarios/${id}`);
  };

  const handleFilter = (column: keyof Usuario, value: string) => {
    const filtered = usuarios.filter((usuario) => {
      const columnValue = usuario[column];
      if (typeof columnValue === 'string') {
        return columnValue.toLowerCase().includes(value.toLowerCase());
      }
      return false;
    });
    setFilteredUsuarios(filtered);
  };

  if (isLoading) {
    return <div className="container mx-auto py-10">Carregando...</div>;
  }

  return (
    <>
      <div className="container mx-auto py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Usuários</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Usuário
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Usuário</DialogTitle>
              </DialogHeader>
              <UsuarioForm onSave={handleSave} />
            </DialogContent>
          </Dialog>
        </div>

        {filteredUsuarios.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Input
                    placeholder="Filtrar por nome"
                    onChange={(e) => handleFilter('nome', e.target.value)}
                  />
                </TableHead>
                <TableHead>
                  <Input
                    placeholder="Filtrar por sexo"
                    onChange={(e) => handleFilter('sexo', e.target.value)}
                  />
                </TableHead>
                <TableHead>
                  <Input
                    placeholder="Filtrar por UF"
                    onChange={(e) => handleFilter('uf', e.target.value)}
                  />
                </TableHead>
                <TableHead>Alergias</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsuarios.map((usuario) => (
                <TableRow
                  key={usuario.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(usuario.id)}
                >
                  <TableCell>
                    {loadingId === usuario.id ? (
                      <Skeleton className="h-4 w-[200px]" />
                    ) : (
                      usuario.nome
                    )}
                  </TableCell>
                  <TableCell>{usuario.sexo}</TableCell>
                  <TableCell>{usuario.uf}</TableCell>
                  <TableCell>{usuario.alergias.length} alergia(s)</TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mr-2"
                          disabled={loadingId === usuario.id}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          Editar
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar Usuário</DialogTitle>
                        </DialogHeader>
                        <UsuarioForm
                          onSave={handleSave}
                          initialData={usuario}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(usuario.id);
                      }}
                      disabled={loadingId === usuario.id}
                    >
                      Excluir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p>Nenhum usuário encontrado.</p>
        )}
      </div>
      <Toaster />
    </>
  );
}
