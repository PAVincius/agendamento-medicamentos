'use client'

import { useEffect, useState } from "react"
import { Plus, ArrowUpDown } from 'lucide-react'
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
import { format, isToday } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Situacao, type Agenda } from "@/types/interfaces"
import { AgendaForm } from "./agenda-form"
import { useRouter } from "next/navigation"
import { agendaService } from "@/services/agendaService"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function Agendas() {
  const router = useRouter()
  const [agendas, setAgendas] = useState<Agenda[]>([])
  const [filteredAgendas, setFilteredAgendas] = useState<Agenda[]>([])
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

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
      setFilteredAgendas(agendasData)
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
        description: "Agenda excluída com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao excluir agenda:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir a agenda.",
        variant: "destructive",
      })
    } finally {
      setLoadingId(null)
    }
  }

  const handleRowClick = (id: number) => {
    router.push(`/dashboard/agendas/${id}`)
  }

  const handleFilter = (column: keyof Agenda, value: string) => {
    const filtered = agendas.filter(agenda => {
      if (column === 'data') {
        return format(new Date(agenda.data), "dd/MM/yyyy").includes(value)
      }
      if (column === 'situacao') {
        return agenda.situacao.toLowerCase() === value.toLowerCase()
      }
      return true
    })
    setFilteredAgendas(filtered)
  }

  const handleSort = () => {
    const sortedAgendas = [...filteredAgendas].sort((a, b) => {
      if (a.situacao < b.situacao) return sortOrder === 'asc' ? -1 : 1
      if (a.situacao > b.situacao) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
    setFilteredAgendas(sortedAgendas)
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
  }

  const agendasHoje = agendas.filter(agenda => isToday(new Date(agenda.data))).length
  const agendasRealizadas = agendas.filter(agenda => agenda.situacao === Situacao.REALIZADO).length
  const agendasCanceladas = agendas.filter(agenda => agenda.situacao === Situacao.CANCELADO).length
  const agendasAgendadas = agendas.filter(agenda => agenda.situacao === Situacao.AGENDADO).length

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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendas Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agendasHoje}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Realizadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agendasRealizadas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Canceladas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agendasCanceladas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agendasAgendadas}</div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-4 flex space-x-4">
        <Input 
          placeholder="Filtrar por data (dd/mm/yyyy)" 
          onChange={(e) => handleFilter('data', e.target.value)}
          className="w-64"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>
              <Button variant="ghost" onClick={handleSort} className="h-8 w-full justify-start">
                Situação
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Data da Situação</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAgendas.map((agenda) => (
            <TableRow key={agenda.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleRowClick(agenda.id)}>
              <TableCell>
                {format(new Date(agenda.data), "PPP", { locale: ptBR })}
              </TableCell>
              <TableCell>{agenda.situacao}</TableCell>
              <TableCell>
                {agenda.dataSituacao && format(new Date(agenda.dataSituacao), "PPP", { locale: ptBR })}
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(agenda.id);
                  }}
                >
                  Excluir
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Toaster />
    </div>
  )
}

