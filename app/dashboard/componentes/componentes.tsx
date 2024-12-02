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
import type { Componente } from '@/types/interfaces';
import { ComponenteForm } from './componentes-form';
import { componenteService } from '@/services/componenteService';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';

export function Componentes() {
  const router = useRouter();
  const [componentes, setComponentes] = useState<Componente[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchComponentes();
  }, []);

  const fetchComponentes = async () => {
    setIsLoading(true);
    try {
      const response = await componenteService.listarTodos();
      setComponentes(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Erro ao buscar componentes:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os componentes.',
        variant: 'destructive',
      });
      setComponentes([]); // Garante que componentes seja sempre um array
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (componente: Componente) => {
    try {
      if (componente.id) {
        await componenteService.atualizar(componente.id, componente);
      } else {
        await componenteService.criar(componente);
      }
      await fetchComponentes();
      toast({
        title: 'Sucesso',
        description: `Componente ${componente.id ? 'atualizado' : 'criado'} com sucesso.`,
      });
    } catch (error) {
      console.error('Erro ao salvar componente:', error);
      toast({
        title: 'Erro',
        description: `Não foi possível ${componente.id ? 'atualizar' : 'criar'} o componente.`,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: number) => {
    setLoadingId(id);
    try {
      await componenteService.deletar(id);
      await fetchComponentes();
      toast({
        title: 'Sucesso',
        description: 'Componente excluído com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao excluir componente:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o componente.',
        variant: 'destructive',
      });
    } finally {
      setLoadingId(null);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto py-10">Carregando...</div>;
  }

  return (
    <>
      <div className="container mx-auto py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Componentes</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Componente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Componente</DialogTitle>
              </DialogHeader>
              <ComponenteForm onSave={handleSave} />
            </DialogContent>
          </Dialog>
        </div>

        {componentes.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {componentes.map((componente) => (
                <TableRow key={componente.id}>
                  <TableCell>
                    {loadingId === componente.id ? (
                      <Skeleton className="h-4 w-[200px]" />
                    ) : (
                      componente.nome
                    )}
                  </TableCell>
                  <TableCell>
                    {loadingId === componente.id ? (
                      <Skeleton className="h-4 w-[300px]" />
                    ) : (
                      componente.descricao
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mr-2"
                          disabled={loadingId === componente.id}
                        >
                          Editar
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar Componente</DialogTitle>
                        </DialogHeader>
                        <ComponenteForm
                          onSave={handleSave}
                          initialData={componente}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(componente.id)}
                      disabled={loadingId === componente.id}
                    >
                      Excluir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p>Nenhum componente encontrado.</p>
        )}
      </div>
      <Toaster />
    </>
  );
}
