'use client'

import { useState, useEffect } from "react"
import { Plus, Frown, Smile, Meh, ThumbsUp, ThumbsDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { Reacao } from "@/types/interfaces"
import { ReacaoForm } from "./reacao-form"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { reacaoService } from "@/services/reacaoService"

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
      const response = await reacaoService.listarTodas()
      const fetchedReacoes = Array.isArray(response.data) ? response.data : []
      setReacoes(fetchedReacoes)
      setFilteredReacoes(fetchedReacoes)
    } catch (error) {
      console.error("Erro ao buscar reações:", error)
      toast({
        title: "Oops!",
        description: "As reações fugiram! Vamos tentar pegá-las de novo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (reacao: Reacao) => {
    try {
      if (reacao.id) {
        await reacaoService.atualizarReacao(reacao.id, reacao)
      } else {
        await reacaoService.incluirReacao(reacao.descricao, reacao.dataReacao)
      }
      await fetchReacoes()
      toast({
        title: "Sucesso!",
        description: `Reação ${reacao.id ? 'atualizada' : 'criada'} com sucesso. Que reação!`,
      })
    } catch (error) {
      console.error("Erro ao salvar reação:", error)
      toast({
        title: "Opa!",
        description: `A reação teve uma reação adversa! Não foi possível ${reacao.id ? 'atualizar' : 'criar'}.`,
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
        title: "Puf!",
        description: "A reação desapareceu como mágica!",
      })
    } catch (error) {
      console.error("Erro ao excluir reação:", error)
      toast({
        title: "Eita!",
        description: "A reação se recusou a ir embora. Ela é teimosa!",
        variant: "destructive",
      })
    } finally {
      setLoadingId(null)
    }
  }

  const getReactionEmoji = (descricao: string) => {
    if (descricao.toLowerCase().includes('alérgico')) return <Frown className="text-red-500" />
    if (descricao.toLowerCase().includes('kkkk')) return <Smile className="text-yellow-500" />
    return <Meh className="text-gray-500" />
  }

  if (isLoading) {
    return <div className="container mx-auto py-10">Carregando reações... Não espirre!</div>
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
                <DialogTitle>Nova Reação (Tente não rir)</DialogTitle>
              </DialogHeader>
              <ReacaoForm onSave={handleSave} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-4">
          <Input
            placeholder="Procure reações engraçadas..."
            onChange={(e) => {
              const searchTerm = e.target.value.toLowerCase()
              const filtered = reacoes.filter(reacao =>
                reacao.descricao.toLowerCase().includes(searchTerm)
              )
              setFilteredReacoes(filtered)
            }}
          />
        </div>

        {filteredReacoes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReacoes.map((reacao) => (
              <Card key={reacao.id} className="overflow-hidden transition-all hover:shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-400 to-pink-500">
                  <CardTitle className="text-white flex items-center justify-between">
                    Reação #{reacao.id}
                    {getReactionEmoji(reacao.descricao)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-lg font-semibold mb-2">{reacao.descricao}</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Data: {format(new Date(reacao.dataReacao), "PPP", { locale: ptBR })}
                  </p>
                  <div className="flex justify-end space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center"
                          disabled={loadingId === reacao.id}
                        >
                          <ThumbsUp className="mr-1 h-4 w-4" />
                          Editar
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar Reação (Seja criativo!)</DialogTitle>
                        </DialogHeader>
                        <ReacaoForm onSave={handleSave} initialData={reacao} />
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(reacao.id)}
                      disabled={loadingId === reacao.id}
                      className="flex items-center"
                    >
                      <ThumbsDown className="mr-1 h-4 w-4" />
                      Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-xl font-bold mt-10">Nenhuma reação engraçada encontrada. Que tristeza! 😢</p>
        )}
      </div>
      <Toaster />
    </>
  )
}

