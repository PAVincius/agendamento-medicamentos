'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import type { Vacina } from "@/types/interfaces"
import { VacinaForm } from "./vacinas-form"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { vacinaService } from "@/services/vacinaService"

export function Vacinas() {
  const router = useRouter()
  const [vacinas, setVacinas] = useState<Vacina[]>([])
  const [filteredVacinas, setFilteredVacinas] = useState<Vacina[]>([])
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchVacinas()
  }, [])

  const fetchVacinas = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await vacinaService.listarTodas()
      const vacinasData = Array.isArray(response.data) ? response.data : []
      setVacinas(vacinasData)
      setFilteredVacinas(vacinasData)
    } catch (error) {
      console.error("Erro ao buscar vacinas:", error)
      setError("Não foi possível carregar as vacinas. Por favor, tente novamente mais tarde.")
      toast({
        title: "Erro",
        description: "Não foi possível carregar as vacinas.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (vacina: Vacina) => {
    try {
      if (vacina.id) {
        await vacinaService.atualizar(vacina.id, vacina)
      } else {
        await vacinaService.criar(vacina)
      }
      await fetchVacinas()
      toast({
        title: "Sucesso",
        description: `Vacina ${vacina.id ? 'atualizada' : 'criada'} com sucesso.`,
      })
    } catch (error) {
      console.error("Erro ao salvar vacina:", error)
      toast({
        title: "Erro",
        description: `Não foi possível ${vacina.id ? 'atualizar' : 'criar'} a vacina.`,
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: number) => {
    setLoadingId(id)
    try {
      await vacinaService.deletar(id)
      await fetchVacinas()
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
    }
  }

  const handleRowClick = (id: number) => {
    router.push(`/${id}/`)
  }

  const handleFilter = (column: keyof Vacina, value: string) => {
    const filtered = vacinas.filter(vacina => {
      const columnValue = vacina[column]
      if (typeof columnValue === 'string') {
        return columnValue.toLowerCase().includes(value.toLowerCase())
      }
      if (typeof columnValue === 'number') {
        return columnValue.toString().includes(value)
      }
      return false
    })
    setFilteredVacinas(filtered)
  }

  if (isLoading) {
    return <div className="container mx-auto py-10">Carregando...</div>
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <p className="text-red-500">{error}</p>
        <Button onClick={fetchVacinas} className="mt-4">Tentar novamente</Button>
      </div>
    )
  }

  return (
    <>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Vacinas</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Vacina
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Vacina</DialogTitle>
              </DialogHeader>
              <VacinaForm onSave={handleSave} />
            </DialogContent>
          </Dialog>
        </div>

        {filteredVacinas.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Input 
                    placeholder="Filtrar por título" 
                    onChange={(e) => handleFilter('titulo', e.target.value)}
                  />
                </TableHead>
                <TableHead>
                  <Input 
                    placeholder="Filtrar por doses" 
                    onChange={(e) => handleFilter('doses', e.target.value)}
                  />
                </TableHead>
                <TableHead>
                  <Input 
                    placeholder="Filtrar por periodicidade" 
                    onChange={(e) => handleFilter('periodicidade', e.target.value)}
                  />
                </TableHead>
                <TableHead>
                  <Input 
                    placeholder="Filtrar por intervalo" 
                    onChange={(e) => handleFilter('intervalo', e.target.value)}
                  />
                </TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVacinas.map((vacina) => (
                <TableRow 
                  key={vacina.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(vacina.id)}
                >
                  <TableCell>
                    {loadingId === vacina.id ? (
                      <Skeleton className="h-4 w-[200px]" />
                    ) : (
                      vacina.titulo
                    )}
                  </TableCell>
                  <TableCell>
                    {loadingId === vacina.id ? (
                      <Skeleton className="h-4 w-[50px]" />
                    ) : (
                      vacina.doses
                    )}
                  </TableCell>
                  <TableCell>
                    {loadingId === vacina.id ? (
                      <Skeleton className="h-4 w-[100px]" />
                    ) : (
                      vacina.periodicidade
                    )}
                  </TableCell>
                  <TableCell>
                    {loadingId === vacina.id ? (
                      <Skeleton className="h-4 w-[50px]" />
                    ) : (
                      vacina.intervalo
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mr-2"
                          disabled={loadingId === vacina.id}
                          onClick={(e) => {
                            e.stopPropagation()
                          }}
                        >
                          Editar
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar Vacina</DialogTitle>
                        </DialogHeader>
                        <VacinaForm onSave={handleSave} initialData={vacina} />
                      </DialogContent>
                    </Dialog>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(vacina.id)
                      }}
                      disabled={loadingId === vacina.id}
                    >
                      Excluir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p>Nenhuma vacina encontrada.</p>
        )}
      </div>
      <Toaster />
    </>
  )
}

