'use client'

import { useState, useEffect } from "react"
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
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { type Reacao, Agenda, Situacao } from "@/types/interfaces"
import { ReacaoForm } from "./reacao-form"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { reacaoService } from "@/services/reacaoService"
import { agendaService } from "@/services/agendaService"

export function Reacoes() {
  const [reacoes, setReacoes] = useState<Reacao[]>([])
  const [filteredReacoes, setFilteredReacoes] = useState<Reacao[]>([])
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchReacoes()
  }, [])

  const fetchReacoes = async () => {
    setIsLoading(true)
    try {
      const agendasResponse = await agendaService.buscarPorSituacao(Situacao.REALIZADO)
      const agendas = agendasResponse.data

      const reacoesPromises = agendas.map(agenda => reacaoService.buscarPorAgenda(agenda.id))
      const reacoesResponses = await Promise.all(reacoesPromises)
      
      const todasReacoes = reacoesResponses.flatMap(response => response.data)
      setReacoes(todasReacoes)
      setFilteredReacoes(todasReacoes)
    } catch (error) {
      console.error("Erro ao buscar reações:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as reações.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (reacao: Reacao) => {
    try {
      if (reacao.id) {
        // Update existing reaction
        await reacaoService.atualizarReacao(reacao.id, reacao)
      } else {
        // Create new reaction
        await reacaoService.incluirReacao(reacao.agenda.id, reacao.descricao, reacao.dataReacao.toISOString())
      }
      await fetchReacoes()
      toast({
        title: "Sucesso",
        description: `Reação ${reacao.id ? 'atualizada' : 'criada'} com sucesso.`,
      })
    } catch (error) {
      console.error("Erro ao salvar reação:", error)
      toast({
        title: "Erro",
        description: `Não foi possível ${reacao.id ? 'atualizar' : 'criar'} a reação.`,
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: number) => {
    setLoadingId(id)
    try {
      await reacaoService.excluirReacao(id)
      await fetchReacoes()
      toast({
        title: "Sucesso",
        description: "Reação excluída com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao excluir reação:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir a reação.",
        variant: "destructive",
      })
    } finally {
      setLoadingId(null)
    }
  }

  if (isLoading) {
    return <div className="container mx-auto py-10">Carregando...</div>
  }

  return (
    <>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Reações</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Reação
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Reação</DialogTitle>
              </DialogHeader>
              <ReacaoForm onSave={handleSave} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-4">
          <Input
            placeholder="Pesquisar reações..."
            onChange={(e) => {
              const searchTerm = e.target.value.toLowerCase()
              const filtered = reacoes.filter(reacao =>
                reacao.descricao.toLowerCase().includes(searchTerm) ||
                reacao.agenda.usuario.nome.toLowerCase().includes(searchTerm) ||
                reacao.agenda.vacina.titulo.toLowerCase().includes(searchTerm)
              )
              setFilteredReacoes(filtered)
            }}
          />
        </div>

        {filteredReacoes.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data da Reação</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Vacina</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReacoes.map((reacao) => (
                <TableRow key={reacao.id}>
                  <TableCell>
                    {loadingId === reacao.id ? (
                      <Skeleton className="h-4 w-[100px]" />
                    ) : (
                      format(new Date(reacao.dataReacao), "PPP", { locale: ptBR })
                    )}
                  </TableCell>
                  <TableCell>{reacao.descricao}</TableCell>
                  <TableCell>{reacao.agenda.usuario.nome}</TableCell>
                  <TableCell>{reacao.agenda.vacina.titulo}</TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mr-2"
                          disabled={loadingId === reacao.id}
                        >
                          Editar
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar Reação</DialogTitle>
                        </DialogHeader>
                        <ReacaoForm onSave={handleSave} initialData={reacao} />
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(reacao.id)}
                      disabled={loadingId === reacao.id}
                    >
                      Excluir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p>Nenhuma reação encontrada.</p>
        )}
      </div>
      <Toaster />
    </>
  )
}

