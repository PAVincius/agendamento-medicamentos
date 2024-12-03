'use client'

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Beaker, Syringe } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"
import type { Vacina } from "@/types/interfaces"
import { vacinaService } from "@/services/vacinaService"

export default function VacinaDetailsPage() {
  const params = useParams()
  const [vacina, setVacina] = useState<Vacina | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchVacina = async () => {
      setIsLoading(true)
      try {
        const response = await vacinaService.buscarPorId(Number(params.id))
        setVacina(response.data)
      } catch (error) {
        console.error("Erro ao buscar detalhes da vacina:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVacina()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 space-y-8">
        <Skeleton className="h-8 w-[300px]" />
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle><Skeleton className="h-4 w-[200px]" /></CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[100px]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!vacina) {
    return <div>Vacina não encontrada</div>
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <h1 className="text-3xl font-bold">{vacina.titulo}</h1>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Syringe className="h-4 w-4" />
              Doses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{vacina.doses}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Beaker className="h-4 w-4" />
              Periodicidade e Intervalo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {vacina.periodicidade ? `${vacina.intervalo} ${vacina.periodicidade}` : 'Não aplicável'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Descrição</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{vacina.descricao}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Componentes</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-6 space-y-2">
            {vacina.componentes.map((componente) => (
              <li key={componente.id}>{componente.nome}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

