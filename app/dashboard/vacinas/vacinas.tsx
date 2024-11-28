'use client'

import { useState } from "react"
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Vacina } from "@/types/interfaces"
import { VacinaForm } from "./vacinas-form"

export function Vacinas() {
  const [vacinas, setVacinas] = useState<Vacina[]>([])
  const [editingVacina, setEditingVacina] = useState<Vacina | null>(null)

  const handleSave = (vacina: Vacina) => {
    if (editingVacina) {
      setVacinas(vacinas.map(v => v.id === vacina.id ? vacina : v))
    } else {
      setVacinas([...vacinas, { ...vacina, id: Math.random().toString() }])
    }
    setEditingVacina(null)
  }

  const handleDelete = (id: string) => {
    setVacinas(vacinas.filter(v => v.id !== id))
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Vacinas</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Vacina
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Vacina</DialogTitle>
            </DialogHeader>
            <VacinaForm onSave={handleSave} />
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Doses</TableHead>
            <TableHead>Periodicidade</TableHead>
            <TableHead>Intervalo</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vacinas.map((vacina) => (
            <TableRow key={vacina.id}>
              <TableCell>{vacina.doses}</TableCell>
              <TableCell>{vacina.periodicidade}</TableCell>
              <TableCell>{vacina.intervalo}</TableCell>
              <TableCell className="text-right">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="mr-2">
                      Editar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editar Vacina</DialogTitle>
                    </DialogHeader>
                    <VacinaForm onSave={handleSave} initialData={vacina} />
                  </DialogContent>
                </Dialog>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDelete(vacina.id)}
                >
                  Excluir
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

