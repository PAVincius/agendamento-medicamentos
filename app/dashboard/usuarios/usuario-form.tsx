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
import { Sexo, UFs, type UF } from "@/types/enums"

const formSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  sexo: z.nativeEnum(Sexo),
  uf: z.enum(UFs),
  alergias: z.array(z.string()),
})

interface UsuarioFormProps {
  initialData?: Usuario
  onSave: (data: Usuario) => void
}

// Mock data for demonstration
const mockAlergias: Alergia[] = [
  { id: "1", nome: "Penicilina", descricao: "Alergia à penicilina" },
  { id: "2", nome: "Látex", descricao: "Alergia ao látex" },
  { id: "3", nome: "Dipirona", descricao: "Alergia à dipirona" },
]

export function UsuarioForm({ initialData, onSave }: UsuarioFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      nome: "",
      sexo: Sexo.MASCULINO,
      uf: UFs[0],
      alergias: [],
    },
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    onSave({
      id: initialData?.id || '',
      ...data,
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
                <Input {...field} />
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
                      <RadioGroupItem value={Sexo.MASCULINO} />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Masculino
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value={Sexo.FEMININO} />
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
                  {Array.from(UFs).map((uf) => (
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
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value?.length && "text-muted-foreground"
                      )}
                    >
                      {field.value?.length
                        ? `${field.value.length} alergia(s) selecionada(s)`
                        : "Selecione as alergias"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                  <Command>
                    <CommandInput placeholder="Procurar alergia..." />
                    <CommandEmpty>Nenhuma alergia encontrada.</CommandEmpty>
                    <CommandGroup>
                      {mockAlergias.map((alergia) => (
                        <CommandItem
                          key={alergia.id}
                          value={alergia.nome}
                          onSelect={() => {
                            const currentValue = new Set(field.value)
                            if (currentValue.has(alergia.id)) {
                              currentValue.delete(alergia.id)
                            } else {
                              currentValue.add(alergia.id)
                            }
                            field.onChange(Array.from(currentValue))
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value?.includes(alergia.id)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {alergia.nome}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
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

