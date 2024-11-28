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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import type { Vacina } from '@/types/interfaces';
import { Periodicidade } from '@/types/enums';

const formSchema = z.object({
  doses: z.number().min(1, 'Número de doses é obrigatório'),
  periodicidade: z.nativeEnum(Periodicidade),
  intervalo: z.number().min(0, 'Intervalo deve ser maior ou igual a zero'),
});

interface VacinaFormProps {
  initialData?: Vacina;
  onSave: (data: Vacina) => void;
}

export function VacinaForm({ initialData, onSave }: VacinaFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      doses: 1,
      periodicidade: Periodicidade.DIAS,
      intervalo: 0,
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    onSave({
      id: initialData?.id || '',
      ...data,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
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
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={form.watch('doses') <= 1}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a periodicidade" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(Periodicidade).map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
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
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  disabled={form.watch('doses') <= 1}
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
  );
}
