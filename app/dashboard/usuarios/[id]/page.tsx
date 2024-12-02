'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CheckCircle, Clock } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Usuario, Agenda } from '@/types/interfaces';
import { Sexo, SituacaoAgenda, Periodicidade } from '@/types/enums';

export default function UsuarioDetailsPage() {
  const params = useParams();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [agendas, setAgendas] = useState<Agenda[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Mock data
        const mockUsuario: Usuario = {
          id: params.id as string,
          nome: 'João Silva',
          sexo: 'MASCULINO',
          uf: 'SP',
          alergias: ['Penicilina'],
        };

        const mockAgendas: Agenda[] = [
          {
            id: '1',
            data: new Date(),
            situacao: 'AGENDADO',
            dataSituacao: null,
            vacina: {
              id: '1',
              nome: 'COVID-19',
              doses: 2,
              periodicidade: 'MESES',
              intervalo: 3,
            },
            usuario: mockUsuario,
          },
          // Add more mock agendas as needed
        ];

        setUsuario(mockUsuario);
        setAgendas(mockAgendas);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const proximaVacina = agendas.find((a) => a.situacao === 'AGENDADO');
  const totalAgendamentos = agendas.length;
  const agendamentosPendentes = agendas.filter(
    (a) => a.situacao === 'AGENDADO',
  ).length;

  if (isLoading) {
    return (
      <div className="container mx-auto space-y-8 py-10">
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

  if (!usuario) {
    return <div>Usuário não encontrado</div>;
  }

  return (
    <div className="container mx-auto space-y-8 py-10">
      <h1 className="text-3xl font-bold">{usuario.nome}</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Próxima Vacina
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {proximaVacina
                ? format(proximaVacina.data, 'dd/MM/yyyy')
                : 'Nenhuma'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Total de Agendamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalAgendamentos}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Agendamentos Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{agendamentosPendentes}</p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg bg-white shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Vacina</TableHead>
              <TableHead>Situação</TableHead>
              <TableHead>Data da Situação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agendas.map((agenda) => (
              <TableRow key={agenda.id}>
                <TableCell>
                  {format(agenda.data, 'PPP', { locale: ptBR })}
                </TableCell>
                <TableCell>{agenda.vacina.nome}</TableCell>
                <TableCell>{agenda.situacao}</TableCell>
                <TableCell>
                  {agenda.dataSituacao &&
                    format(agenda.dataSituacao, 'PPP', { locale: ptBR })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
