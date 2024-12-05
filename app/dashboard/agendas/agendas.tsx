'use client'

import { useEffect, useState } from "react"
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Situacao, type Agenda } from "@/types/interfaces"
import { AgendaForm } from "./agenda-form"
import { useRouter } from "next/navigation"
import { agendaService } from "@/services/agendaService"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"

export function Agendas() {
  const router = useRouter()
  const [agendas, setAgendas] = useState<Agenda[]>([])
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchAgendas()
  }, [])

  const fetchAgendas = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await agendaService.buscarTodas()
      const agendasData = Array.isArray(response.data) ? response.data : []
      setAgendas(agendasData)
    } catch (error) {
      console.error("Erro ao buscar agendas:", error)
      setError("Não foi possível carregar as agendas. Por favor, tente novamente mais tarde.")
      toast({
        title: "Erro",
        description: "Não foi possível carregar as agendas.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (agenda: Agenda) => {
    try {
      await agendaService.agendar(agenda.usuario.id, agenda.vacina.id, agenda.data.toISOString().split('T')[0], agenda.hora, agenda.observacoes)
      await fetchAgendas()
      toast({
        title: "Sucesso",
        description: `Agenda ${agenda.id ? 'atualizada' : 'criada'} com sucesso.`,
      })
    } catch (error) {
      console.error("Erro ao salvar agenda:", error)
      toast({
        title: "Erro",
        description: `Não foi possível ${agenda.id ? 'atualizar' : 'criar'} a agenda.`,
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: number) => {
    setLoadingId(id)
    try {
      await agendaService.excluir(id)
      await fetchAgendas()
      toast({
        title: "Sucesso",
        description: "Vacina excluída com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao excluir vacina:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir a vacina.",
        variant: "destructive",
      })
    } finally {
      setLoadingId(null)
    } //ganbiarra de senior
  }

  const handleRowClick = (id: number) => {
    router.push(`/dashboard/agendas/${id}`)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
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
            <TableRow key={agenda.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleRowClick(agenda.id)}>
              <TableCell>
                {format(agenda.data, "PPP", { locale: ptBR })}
              </TableCell>
              <TableCell>{agenda.situacao}</TableCell>
              <TableCell>
                {agenda.dataSituacao && format(agenda.dataSituacao, "PPP", { locale: ptBR })}
              </TableCell>
              <TableCell className="text-right">
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
  )
}

