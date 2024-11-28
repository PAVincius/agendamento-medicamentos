'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { addYears, addMonths, addWeeks, addDays } from 'date-fns';
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
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import type { Agenda, Vacina } from '@/types/interfaces';
import { SituacaoAgenda, Periodicidade } from '@/types/enums';

const formSchema = z.object({
  data: z.date(),
  situacao: z.nativeEnum(SituacaoAgenda),
  dataSituacao: z.date().nullable(),
  vacinaId: z.string(),
  usuarioId: z.string(),
});

interface AgendaFormProps {
  initialData?: Agenda;
  onSave: (data: Agenda) => void;
}

// Mock data for demonstration
const mockVacinas: Vacina[] = [
  {
    id: '1',
    doses: 3,
    periodicidade: Periodicidade.MESES,
    intervalo: 2,
  },
  {
    id: '2',
    doses: 4,
    periodicidade: Periodicidade.ANOS,
    intervalo: 1,
  },
  // Add more mock vacinas as needed
];

export function AgendaForm({ initialData, onSave }: AgendaFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      data: new Date(),
      situacao: SituacaoAgenda.AGENDADO,
      dataSituacao: null,
      vacinaId: '',
      usuarioId: '',
    },
  });

  const calculateFutureDates = (baseDate: Date, vacina: Vacina) => {
    const dates: Date[] = [baseDate];

    if (vacina.doses <= 1) return dates;

    for (let i = 1; i < vacina.doses; i++) {
      let nextDate = baseDate;
      const interval = vacina.intervalo * i;

      switch (vacina.periodicidade) {
        case Periodicidade.ANOS:
          nextDate = addYears(baseDate, interval);
          break;
        case Periodicidade.MESES:
          nextDate = addMonths(baseDate, interval);
          break;
        case Periodicidade.SEMANAS:
          nextDate = addWeeks(baseDate, interval);
          break;
        case Periodicidade.DIAS:
          nextDate = addDays(baseDate, interval);
          break;
      }
      dates.push(nextDate);
    }

    return dates;
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const selectedVacina = mockVacinas.find((v) => v.id === data.vacinaId);
    if (!selectedVacina) return;

    const dates = calculateFutureDates(data.data, selectedVacina);
    const agendas = dates.map((date, index) => ({
      id: initialData?.id || Math.random().toString() + index,
      data: date,
      situacao: SituacaoAgenda.AGENDADO,
      dataSituacao: null,
      vacinaId: data.vacinaId,
      usuarioId: data.usuarioId,
    }));

    // Save all generated agendas
    // biome-ignore lint/complexity/noForEach: <explanation>
    agendas.forEach((agenda) => onSave(agenda));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="vacinaId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vacina</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a vacina" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {mockVacinas.map((vacina) => (
                    <SelectItem key={vacina.id} value={vacina.id}>
                      {`${vacina.doses} doses - Intervalo ${vacina.intervalo} ${vacina.periodicidade}`}
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
                      variant={'outline'}
                      className={cn(
                        'w-[240px] pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP', { locale: ptBR })
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
          name="situacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Situação</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a situação" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(SituacaoAgenda).map((situacao) => (
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

        {form.watch('situacao') !== SituacaoAgenda.AGENDADO && (
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
                        variant={'outline'}
                        className={cn(
                          'w-[240px] pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP', { locale: ptBR })
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
                      selected={field.value || undefined}
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

        <Button type="submit" className="w-full">
          Salvar
        </Button>
      </form>
    </Form>
  );
}
