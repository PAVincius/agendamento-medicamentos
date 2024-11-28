'use client';

import { useState } from 'react';
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
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type {Agenda } from '@/types/interfaces';
import { AgendaForm } from './agenda-form';

export function Agendas() {
  const [agendas, setAgendas] = useState<Agenda[]>([]);
  const [editingAgenda, setEditingAgenda] = useState<Agenda | null>(null);

  const handleSave = (agenda: Agenda) => {
    if (editingAgenda) {
      setAgendas(agendas.map((a) => (a.id === agenda.id ? agenda : a)));
    } else {
      setAgendas([...agendas, { ...agenda, id: Math.random().toString() }]);
    }
    setEditingAgenda(null);
  };

  const handleDelete = (id: string) => {
    setAgendas(agendas.filter((a) => a.id !== id));
  };

  return (
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
            <TableHead>Data</TableHead>
            <TableHead>Situação</TableHead>
            <TableHead>Data da Situação</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agendas.map((agenda) => (
            <TableRow key={agenda.id}>
              <TableCell>
                {format(agenda.data, 'PPP', { locale: ptBR })}
              </TableCell>
              <TableCell>{agenda.situacao}</TableCell>
              <TableCell>
                {agenda.dataSituacao &&
                  format(agenda.dataSituacao, 'PPP', { locale: ptBR })}
              </TableCell>
              <TableCell className="text-right">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="mr-2">
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
                  onClick={() => handleDelete(agenda.id)}
                >
                  Excluir
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
