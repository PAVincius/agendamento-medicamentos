'use client'

import { useEffect, useState } from "react"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from "@/lib/utils"
import type { Usuario, Alergia } from "@/types/interfaces"
import { Sexo, UFs } from "@/types/enums"
import { alergiaService } from "@/services/alergiaService"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").max(60, "Nome deve ter no máximo 60 caracteres"),
  dataNascimento: z.date(),
  sexo: z.nativeEnum(Sexo),
  logradouro: z.string().min(1, "Logradouro é obrigatório").max(60, "Logradouro deve ter no máximo 60 caracteres"),
  setor: z.string().min(1, "Setor é obrigatório").max(40, "Setor deve ter no máximo 40 caracteres"),
  cidade: z.string().min(1, "Cidade é obrigatória").max(40, "Cidade deve ter no máximo 40 caracteres"),
  uf: z.enum(UFs),
  alergias: z.array(z.number()),
})

interface UsuarioFormProps {
  initialData?: Usuario
  onSave: (data: Usuario) => void
}

export function UsuarioForm({ initialData, onSave }: UsuarioFormProps) {
  const [alergias, setAlergias] = useState<Alergia[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const fetchAlergias = async () => {
      try {
        const response = await alergiaService.listarTodas()
        setAlergias(Array.isArray(response.data) ? response.data : [])
      } catch (error) {
        console.error("Erro ao buscar alergias:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar as alergias.",
          variant: "destructive",
        })
        setAlergias([])
      }
    }

    fetchAlergias()
  }, [toast])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      nome: "",
      dataNascimento: new Date(),
      sexo: Sexo.M,
      logradouro: "",
      setor: "",
      cidade: "",
      uf: UFs[0],
      alergias: [],
    },
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    onSave({
      id: initialData?.id || 0,
      ...data,
      alergias: alergias.filter(a => (data.alergias || []).includes(a.id)),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} maxLength={60} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dataNascimento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de Nascimento</FormLabel>
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

        <FormField
          control={form.control}
          name="sexo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sexo</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value={Sexo.M} />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Masculino
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value={Sexo.F} />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Feminino
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="logradouro"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logradouro</FormLabel>
              <FormControl>
                <Input {...field} maxLength={60} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="setor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Setor</FormLabel>
              <FormControl>
                <Input {...field} maxLength={40} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cidade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cidade</FormLabel>
              <FormControl>
                <Input {...field} maxLength={40} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="uf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>UF</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {UFs.map((uf) => (
                    <SelectItem key={uf} value={uf}>
                      {uf}
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
          name="alergias"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alergias</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value.split(',').map(Number))}
                value={field.value?.join(',')}
                multiple
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione as alergias" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {alergias.map((alergia) => (
                    <SelectItem key={alergia.id} value={alergia.id.toString()}>
                      {alergia.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

