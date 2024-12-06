'use client'

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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Reacao } from "@/types/interfaces"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  descricao: z.string().min(1, "Descrição é obrigatória").max(200, "Descrição deve ter no máximo 200 caracteres"),
  dataReacao: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de data inválido (YYYY-MM-DD)"),
})

interface ReacaoFormProps {
  initialData?: Reacao
  onSave: (data: Reacao) => void
}

export function ReacaoForm({ initialData, onSave }: ReacaoFormProps) {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      descricao: "",
      dataReacao: new Date().toISOString().split('T')[0],
    },
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    onSave({
      id: initialData?.id || 0,
      ...data,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição (Seja engraçado!)</FormLabel>
              <FormControl>
                <Textarea {...field} maxLength={200} placeholder="Ex: O paciente ficou verde de inveja da vacina" />
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
              <FormLabel>Data da Reação (Dia memorável)</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Salvar Reação
        </Button>
      </form>
    </Form>
  )
}

