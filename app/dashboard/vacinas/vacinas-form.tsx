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
import type { Vacina, Componente } from "@/types/interfaces"
import { Periodicidade } from "@/types/enums"
import { vacinaService } from "@/services/vacinaService"
import { componenteService } from "@/services/componenteService"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

const formSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório").max(60, "Título deve ter no máximo 60 caracteres"),
  descricao: z.string().min(1, "Descrição é obrigatória").max(200, "Descrição deve ter no máximo 200 caracteres"),
  doses: z.number().min(1, "Número de doses deve ser no mínimo 1"),
  periodicidade: z.nativeEnum(Periodicidade).optional(),
  intervalo: z.number().min(0, "Intervalo deve ser maior ou igual a zero").optional(),
  componentes: z.array(z.number()).min(1, "Pelo menos um componente é necessário"),
})

interface VacinaFormProps {
  initialData?: Vacina
  onSave: (data: Vacina) => void
  onCancel: () => void
}

export function VacinaForm({ initialData, onSave, onCancel }: VacinaFormProps) {
  const [componentes, setComponentes] = useState<Componente[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const fetchComponentes = async () => {
      try {
        const response = await componenteService.listarTodos()
        setComponentes(Array.isArray(response.data) ? response.data : [])
      } catch (error) {
        console.error("Erro ao buscar componentes:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os componentes.",
          variant: "destructive",
        })
        setComponentes([])
      }
    }

    fetchComponentes()
  }, [toast])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      titulo: "",
      descricao: "",
      doses: 1,
      periodicidade: undefined,
      intervalo: undefined,
      componentes: [],
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>, event: React.FormEvent) => {
    event.preventDefault();
    try {
      const formattedData = {
        id: initialData?.id || 0,
        ...data,
        periodicidade: Number(data.periodicidade),
        componentes: data.componentes.map(id => ({
          id,
          nome: componentes.find(c => c.id === id)?.nome || ''
        }))
      };

      let savedVacina: Vacina;
      if (initialData) {
        const response = await vacinaService.atualizar(initialData.id, formattedData);
        savedVacina = response.data;
      } else {
        const response = await vacinaService.criar(formattedData);
        savedVacina = response.data;
      }
      onSave(savedVacina);
      toast({
        title: "Sucesso",
        description: `Vacina ${initialData ? 'atualizada' : 'criada'} com sucesso.`,
      });
    } catch (error) {
      console.error("Erro ao salvar vacina:", error);
      toast({
        title: "Erro",
        description: `Não foi possível ${initialData ? 'atualizar' : 'criar'} a vacina.`,
        variant: "destructive",
      });
    }
  }

  return (
    <>
    <Form {...form}>
      <form onSubmit={(e) => form.handleSubmit(onSubmit)(e)} className="space-y-4">
        <FormField
          control={form.control}
          name="titulo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input {...field} maxLength={60} />
              </FormControl>
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
          name="doses"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doses</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={e => field.onChange(parseInt(e.target.value))}
                  min={1}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="periodicidade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Periodicidade</FormLabel>
              <Select 
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value?.toString()}
                disabled={form.watch('doses') <= 1}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a periodicidade" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(Periodicidade).filter(([key]) => isNaN(Number(key))).map(([key, value]) => (
                    <SelectItem key={key} value={value.toString()}>
                      {key}
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
          name="intervalo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Intervalo</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={e => field.onChange(parseInt(e.target.value))}
                  disabled={form.watch('doses') <= 1}
                  min={0}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="componentes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Componentes</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value.split(',').map(Number))}
                value={field.value?.join(',')}
                multiple
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione os componentes" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {componentes.map((componente) => (
                    <SelectItem key={componente.id} value={componente.id.toString()}>
                      {componente.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full mb-2">
          Salvar
        </Button>
        <Button type="button" variant="outline" className="w-full" onClick={onCancel}>
          Cancelar
        </Button>
      </form>
    </Form>
    <Toaster />
    </>
  )
}

