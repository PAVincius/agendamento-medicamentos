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
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { CalendarIcon } from 'lucide-react'
import { Situacao, type Agenda, type Vacina, type Usuario } from "@/types/interfaces"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { vacinaService } from "@/services/vacinaService"
import { usuarioService } from "@/services/usuarioService"
import { useToast } from "@/components/ui/use-toast"
import { agendaService } from "@/services/agendaService"; // Import agendaService

const formSchema = z.object({
  data: z.date(),
  hora: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato de hora inválido"),
  situacao: z.nativeEnum(Situacao),
  dataSituacao: z.date().optional(),
  observacoes: z.string().max(200, "Observações devem ter no máximo 200 caracteres").optional(),
  usuarioId: z.number(),
  vacinaId: z.number(),
})

interface AgendaFormProps {
  initialData?: Agenda;
  onSave: (data: Agenda) => void;
  onCancel: () => void;
}

export function AgendaForm({ initialData, onSave, onCancel }: AgendaFormProps) {
  const [vacinas, setVacinas] = useState<Vacina[]>([])
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [vacinasResponse, usuariosResponse] = await Promise.all([
          vacinaService.listarTodas(),
          usuarioService.listarTodos()
        ])
        setVacinas(Array.isArray(vacinasResponse.data) ? vacinasResponse.data : [])
        setUsuarios(Array.isArray(usuariosResponse.data) ? usuariosResponse.data : [])
      } catch (error) {
        console.error("Erro ao buscar dados:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados necessários.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      data: new Date(initialData.data),
      hora: initialData.hora,
      situacao: initialData.situacao,
      dataSituacao: initialData.dataSituacao ? new Date(initialData.dataSituacao) : undefined,
      observacoes: initialData.observacoes || "",
      usuarioId: initialData.usuario.id,
      vacinaId: initialData.vacina.id,
    } : {
      data: new Date(),
      hora: "09:00",
      situacao: Situacao.AGENDADO,
      dataSituacao: undefined,
      observacoes: "",
      usuarioId: 0,
      vacinaId: 0,
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>, event: React.FormEvent) => {
    event.preventDefault();
    try {
      // Formatar os dados para enviar para o backend
      const formattedData = {
        usuarioId:data.usuarioId,
        vacinaId: data.vacinaId,
        dataInicial: format(data.data, "yyyy-MM-dd"),
        hora: data.hora,
        observacoes: data.observacoes || "",
        // Outros campos necessários para o backend
      };
      console.log(formattedData);
      // Chamar o serviço para criar ou atualizar a agenda
      if (initialData) {
        const response = await agendaService.darBaixa(initialData.id, initialData.situacao);
        savedAgenda = response.data;
      } else {
        const response = await agendaService.agendar(formattedData.usuarioId, formattedData.vacinaId, formattedData.dataInicial, formattedData.hora, formattedData.observacoes);
        savedAgenda = response.data;
      }
      console.log(savedAgenda);
      // Chamar a função onSave para atualizar o estado pai
      onSave(savedAgenda);
  
      // Mostrar mensagem de sucesso
      toast({
        title: "Sucesso",
        description: `Agenda ${initialData ? 'atualizada' : 'criada'} com sucesso.`,
      });
    } catch (error) {
      console.error("Erro ao salvar agenda:", error);
      toast({
        title: "Erro",
        description: `Não foi possível ${initialData ? 'atualizar' : 'criar'} a agenda.`,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="usuarioId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usuário</FormLabel>
              <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value.toString()}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o usuário" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {usuarios.map((usuario) => (
                    <SelectItem key={usuario.id} value={usuario.id.toString()}>
                      {usuario.nome}
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
          name="vacinaId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vacina</FormLabel>
              <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value.toString()}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a vacina" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {vacinas.map((vacina) => (
                    <SelectItem key={vacina.id} value={vacina.id.toString()}>
                      {vacina.titulo}
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
          name="data"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: ptBR })
                      ) : (
                        <span>Escolha uma data</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hora"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hora</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="situacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Situação</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a situação" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(Situacao).map((situacao) => (
                    <SelectItem key={situacao} value={situacao}>
                      {situacao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch('situacao') !== Situacao.AGENDADO && (
          <FormField
            control={form.control}
            name="dataSituacao"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data da Situação</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: ptBR })
                        ) : (
                          <span>Escolha uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="observacoes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea {...field} maxLength={200} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Salvar
        </Button>
        <Button type="button" variant="outline" className="w-full mt-2" onClick={onCancel}>
          Cancelar
        </Button>
      </form>
    </Form>
  )
}

