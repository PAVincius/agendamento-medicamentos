'use client'

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { type Reacao, type Agenda, Situacao } from "@/types/interfaces"
import { agendaService } from "@/services/agendaService"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  descricao: z.string().min(1, "Descrição é obrigatória").max(200, "Descrição deve ter no máximo 200 caracteres"),
  dataReacao: z.date(),
  agendaId: z.number(),
})

interface ReacaoFormProps {
  initialData?: Reacao
  onSave: (data: Reacao) => void
}

export function ReacaoForm({ initialData, onSave }: ReacaoFormProps) {
  const [agendas, setAgendas] = useState<Agenda[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchAgendas = async () => {
      setIsLoading(true)
      try {
        const response = await agendaService.buscarPorSituacao(Situacao.REALIZADO)
        setAgendas(Array.isArray(response.data) ? response.data : [])
      } catch (error) {
        console.error("Erro ao buscar agendas:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar as agendas.",
          variant: "destructive",
        })
        setAgendas([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchAgendas()
  }, [toast])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      descricao: initialData.descricao,
      dataReacao: new Date(initialData.dataReacao),
      agendaId: initialData.agenda.id,
    } : {
      descricao: "",
      dataReacao: new Date(),
      agendaId: 0,
    },
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const agenda = agendas.find(a => a.id === data.agendaId)
    if (!agenda) {
      toast({
        title: "Erro",
        description: "Agenda não encontrada.",
        variant: "destructive",
      })
      return
    }

    onSave({
      id: initialData?.id || 0,
      ...data,
      agenda,
    })
  }

  if (isLoading) {
    return <div>Carregando...</div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="agendaId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agenda</FormLabel>
              <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value.toString()}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a agenda" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {agendas.map((agenda) => (
                    <SelectItem key={agenda.id} value={agenda.id.toString()}>
                      {`${agenda.usuario.nome} - ${agenda.vacina.titulo} (${new Date(agenda.data).toLocaleDateString()})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea {...field} maxLength={200} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dataReacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data da Reação</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''}
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Salvar
        </Button>
      </form>
    </Form>
  )
}

