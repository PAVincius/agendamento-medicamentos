'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Componente } from '@/types/interfaces';

const formSchema = z.object({
  nome: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(60, 'Nome deve ter no máximo 60 caracteres')
});

interface ComponenteFormProps {
  initialData?: Componente;
  onSave: (data: Componente) => void;
}

export function ComponenteForm({ initialData, onSave }: ComponenteFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      nome: '',
      descricao: '',
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    onSave({
      id: initialData?.id || 0,
      ...data,
    });
  };

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
        <Button type="submit" className="w-full">
          Salvar
        </Button>
      </form>
    </Form>
  );
}
