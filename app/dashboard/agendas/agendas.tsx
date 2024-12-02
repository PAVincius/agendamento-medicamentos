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
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Situacao, type Agenda } from '@/types/interfaces';
import { AgendaForm } from './agenda-form';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import { agendaService } from '@/services/agendaService';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function AgendasPage() {
  const router = useRouter();
  const [agendas, setAgendas] = useState<Agenda[]>([]);
  const [filteredAgendas, setFilteredAgendas] = useState<Agenda[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAgendas();
  }, []);

  const fetchAgendas = async () => {
    setIsLoading(true);
    try {
      const response = await agendaService.buscarTodas();
      setAgendas(response.data);
      setFilteredAgendas(response.data);
    } catch (error) {
      console.error('Erro ao buscar agendas:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as agendas.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (agenda: Agenda) => {
    try {
      if (agenda.id) {
        await agendaService.darBaixa(agenda.id, agenda.situacao);
      } else {
        await agendaService.agendar(
          agenda.usuario.id,
          agenda.vacina.id,
          agenda.data.toISOString().split('T')[0],
          agenda.hora,
          agenda.observacoes,
        );
      }
      await fetchAgendas();
      toast({
        title: 'Sucesso',
        description: `Agenda ${agenda.id ? 'atualizada' : 'criada'} com sucesso.`,
      });
    } catch (error) {
      console.error('Erro ao salvar agenda:', error);
      toast({
        title: 'Erro',
        description: `Não foi possível ${agenda.id ? 'atualizar' : 'criar'} a agenda.`,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: number) => {
    setLoadingId(id);
    try {
      await agendaService.excluir(id);
      await fetchAgendas();
      toast({
        title: 'Sucesso',
        description: 'Agenda excluída com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao excluir agenda:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir a agenda.',
        variant: 'destructive',
      });
    } finally {
      setLoadingId(null);
    }
  };

  const handleRowClick = (id: number) => {
    router.push(`/agendas/${id}`);
  };

  const handleFilter = (column: keyof Agenda, value: string) => {
    const filtered = agendas.filter((agenda) => {
      if (column === 'data') {
        return format(new Date(agenda.data), 'dd/MM/yyyy').includes(value);
      }
      if (column === 'situacao') {
        return agenda.situacao.toLowerCase() === value.toLowerCase();
      }
      const columnValue = agenda[column];
      if (typeof columnValue === 'string') {
        return columnValue.toLowerCase().includes(value.toLowerCase());
      }
      return false;
    });
    setFilteredAgendas(filtered);
  };

  const sortedSituacoes = [
    Situacao.AGENDADO,
    Situacao.REALIZADO,
    Situacao.CANCELADO,
  ];

  if (isLoading) {
    return <div className="container mx-auto py-10">Carregando...</div>;
  }

  return (
    <>
      <div className="container mx-auto py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Agendas</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Agenda
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Agenda</DialogTitle>
              </DialogHeader>
              <AgendaForm onSave={handleSave} />
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Input
                  placeholder="Filtrar por data (dd/mm/yyyy)"
                  onChange={(e) => handleFilter('data', e.target.value)}
                />
              </TableHead>
              <TableHead>
                <Select
                  onValueChange={(value) => handleFilter('situacao', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por situação" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortedSituacoes.map((situacao) => (
                      <SelectItem key={situacao} value={situacao}>
                        {situacao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableHead>
              <TableHead>Data da Situação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAgendas.map((agenda) => (
              <TableRow
                key={agenda.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleRowClick(agenda.id)}
              >
                <TableCell>
                  {loadingId === agenda.id ? (
                    <Skeleton className="h-4 w-[200px]" />
                  ) : (
                    format(new Date(agenda.data), 'PPP', { locale: ptBR })
                  )}
                </TableCell>
                <TableCell>{agenda.situacao}</TableCell>
                <TableCell>
                  {agenda.dataSituacao &&
                    format(new Date(agenda.dataSituacao), 'PPP', {
                      locale: ptBR,
                    })}
                </TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2"
                        disabled={loadingId === agenda.id}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        Editar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Agenda</DialogTitle>
                      </DialogHeader>
                      <AgendaForm onSave={handleSave} initialData={agenda} />
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(agenda.id);
                    }}
                    disabled={loadingId === agenda.id}
                  >
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Toaster />
    </>
  );
}
