'use client'

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, CheckCircle, Clock, User } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { Usuario, Agenda } from "@/types/interfaces"
import { usuarioService } from "@/services/usuarioService"
import { agendaService } from "@/services/agendaService"
import { Badge } from "@/components/ui/badge"

export default function UsuarioDetailsPage() {
  const params = useParams()
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [agendas, setAgendas] = useState<Agenda[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [usuarioResponse, agendasResponse] = await Promise.all([
          usuarioService.buscarPorId(Number(params.id)),
          agendaService.listarPorUsuario(Number(params.id))
        ])
        setUsuario(usuarioResponse.data)
        setAgendas(agendasResponse.data)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const proximaVacina = agendas.find(a => a.situacao === "AGENDADO")
  const totalAgendamentos = agendas.length
  const agendamentosRealizados = agendas.filter(a => a.situacao === "REALIZADO").length
  const agendamentosCancelados = agendas.filter(a => a.situacao === "CANCELADO").length
  const agendamentosPendentes = agendas.filter(a => a.situacao === "AGENDADO").length

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 space-y-8">
        <Skeleton className="h-12 w-[300px]" />
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
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
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  if (!usuario) {
    return <div>Usuário não encontrado</div>
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex items-center space-x-4">
        <User className="h-12 w-12 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">{usuario.nome}</h1>
          <p className="text-muted-foreground">
            {format(new Date(usuario.dataNascimento), "PPP", { locale: ptBR })} • {usuario.sexo} • {usuario.uf}
          </p>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próxima Vacina</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {proximaVacina ? (
              <>
                <div className="text-2xl font-bold">{format(new Date(proximaVacina.data), "dd/MM/yyyy")}</div>
                <p className="text-xs text-muted-foreground mt-1">{proximaVacina.vacina.titulo}</p>
              </>
            ) : (
              <div className="text-2xl font-bold">Nenhuma</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Agendamentos</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAgendamentos}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos Realizados</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agendamentosRealizados}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agendamentosPendentes}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Agendamentos</CardTitle>
        </CardHeader>
        <CardContent>
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
                    {format(new Date(agenda.data), "PPP", { locale: ptBR })}
                  </TableCell>
                  <TableCell>{agenda.vacina.titulo}</TableCell>
                  <TableCell>
                    <Badge variant={agenda.situacao === "AGENDADO" ? "default" : agenda.situacao === "REALIZADO" ? "success" : "destructive"}>
                      {agenda.situacao}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {agenda.dataSituacao && 
                      format(new Date(agenda.dataSituacao), "PPP", { locale: ptBR })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

