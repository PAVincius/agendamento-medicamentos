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
import type { Alergia } from '@/types/interfaces';
import { AlergiaForm } from './alergia-form';
import { alergiaService } from '@/services/alergiaService';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';

export function Alergias() {
  const router = useRouter();
  const [alergias, setAlergias] = useState<Alergia[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAlergias();
  }, []);

  const fetchAlergias = async () => {
    setIsLoading(true);
    try {
      const response = await alergiaService.listarTodas();
      setAlergias(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Erro ao buscar alergias:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as alergias.',
        variant: 'destructive',
      });
      setAlergias([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (alergia: Alergia) => {
    try {
      if (alergia.id) {
        await alergiaService.atualizar(alergia.id, alergia);
      } else {
        await alergiaService.criar(alergia);
      }
      await fetchAlergias();
      toast({
        title: 'Sucesso',
        description: `Alergia ${alergia.id ? 'atualizada' : 'criada'} com sucesso.`,
      });
    } catch (error) {
      console.error('Erro ao salvar alergia:', error);
      toast({
        title: 'Erro',
        description: `Não foi possível ${alergia.id ? 'atualizar' : 'criar'} a alergia.`,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: number) => {
    setLoadingId(id);
    try {
      await alergiaService.deletar(id);
      await fetchAlergias();
      toast({
        title: 'Sucesso',
        description: 'Alergia excluída com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao excluir alergia:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir a alergia.',
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
          <h1 className="text-3xl font-bold">Alergias</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Alergia
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Alergia</DialogTitle>
              </DialogHeader>
              <AlergiaForm onSave={handleSave} />
            </DialogContent>
          </Dialog>
        </div>

        {alergias.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alergias.map((alergia) => (
                <TableRow key={alergia.id}>
                  <TableCell>
                    {loadingId === alergia.id ? (
                      <Skeleton className="h-4 w-[200px]" />
                    ) : (
                      alergia.nome
                    )}
                  </TableCell>
                  <TableCell>
                    {loadingId === alergia.id ? (
                      <Skeleton className="h-4 w-[300px]" />
                    ) : (
                      alergia.descricao
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mr-2"
                          disabled={loadingId === alergia.id}
                        >
                          Editar
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar Alergia</DialogTitle>
                        </DialogHeader>
                        <AlergiaForm
                          onSave={handleSave}
                          initialData={alergia}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(alergia.id)}
                      disabled={loadingId === alergia.id}
                    >
                      Excluir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p>Nenhuma alergia encontrada.</p>
        )}
      </div>
      <Toaster />
    </>
  );
}
