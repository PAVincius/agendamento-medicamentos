'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, User, Syringe } from 'lucide-react';
import { format, isFuture } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import type { Agenda } from '@/types/interfaces';
import { Situacao } from '@/types/enums';
import { agendaService } from '@/services/agendaService';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';

export default function AgendaDetailsPage() {
  const params = useParams();
  const [agenda, setAgenda] = useState<Agenda | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAgenda();
  }, [params.id]);

  const fetchAgenda = async () => {
    setIsLoading(true);
    try {
      const response = await agendaService.buscarPorId(Number(params.id));
      setAgenda(response.data);
    } catch (error) {
      console.error('Erro ao buscar detalhes da agenda:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os detalhes da agenda.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDarBaixa = async (situacao: Situacao) => {
    if (!agenda) return;

    try {
      await agendaService.darBaixa(agenda.id, situacao);
      await fetchAgenda();
      toast({
        title: 'Sucesso',
        description: `Agenda ${situacao.toLowerCase()} com sucesso.`,
      });
    } catch (error) {
      console.error('Erro ao dar baixa na agenda:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível dar baixa na agenda.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto space-y-8 py-10">
        <Skeleton className="h-8 w-[300px]" />
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-4 w-[200px]" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[100px]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!agenda) {
    return <div>Agenda não encontrada</div>;
  }

  const isAgendaFuture = isFuture(new Date(agenda.data));

  return (
    <div className="container mx-auto space-y-8 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Detalhes do Agendamento</h1>
        {isAgendaFuture && agenda.situacao === Situacao.AGENDADO && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>Dar Baixa</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => handleDarBaixa(Situacao.REALIZADO)}
              >
                Realizado
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDarBaixa(Situacao.CANCELADO)}
              >
                Cancelado
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Data e Hora
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {format(new Date(agenda.data), 'PPP', { locale: ptBR })}
            </p>
            <p className="text-lg">{agenda.hora}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Paciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{agenda.usuario.nome}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Syringe className="h-4 w-4" />
              Vacina
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{agenda.vacina.titulo}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Situação</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{agenda.situacao}</p>
          {agenda.dataSituacao && (
            <p className="text-lg">
              Data:{' '}
              {format(new Date(agenda.dataSituacao), 'PPP', { locale: ptBR })}
            </p>
          )}
        </CardContent>
      </Card>

      {agenda.observacoes && (
        <Card>
          <CardHeader>
            <CardTitle>Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{agenda.observacoes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
