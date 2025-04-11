"use client"

import React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Plus, Trash2, FileUp, AlertCircle, Check } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { type ClassSchedule, DAYS, getClassForTimeSlot, isCurrentDay, isCurrentHour } from "@/lib/schedule-utils"
import { useMobile } from "@/hooks/use-mobile"

export default function SchedulePage() {
  const [classes, setClasses] = useState<ClassSchedule[]>([])
  const [newClass, setNewClass] = useState<Partial<ClassSchedule>>({
    name: "",
    professor: "",
    day: 1, // Segunda-feira
    startHour: 8,
    endHour: 10,
    location: "",
    color: "bg-blue-500/50",
  })
  const [isAddingClass, setIsAddingClass] = useState(false)
  const [isImportingFile, setIsImportingFile] = useState(false)
  const [importStatus, setImportStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
  const [importMessage, setImportMessage] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const isMobile = useMobile()

  // Carregar aulas salvas do localStorage
  useEffect(() => {
    const savedClasses = localStorage.getItem("userClasses")
    if (savedClasses) {
      setClasses(JSON.parse(savedClasses))
    }
  }, [])

  // Salvar aulas no localStorage quando houver alterações
  useEffect(() => {
    localStorage.setItem("userClasses", JSON.stringify(classes))
  }, [classes])

  const handleAddClass = () => {
    if (!newClass.name) {
      toast({
        title: "Erro ao adicionar aula",
        description: "O nome da aula é obrigatório.",
        variant: "destructive",
      })
      return
    }

    if (!newClass.startHour || !newClass.endHour || newClass.startHour >= newClass.endHour) {
      toast({
        title: "Erro ao adicionar aula",
        description: "O horário de início deve ser anterior ao horário de término.",
        variant: "destructive",
      })
      return
    }

    const id = `class-${Date.now()}`
    const classToAdd = { ...newClass, id } as ClassSchedule

    setClasses([...classes, classToAdd])
    setNewClass({
      name: "",
      professor: "",
      day: 1,
      startHour: 8,
      endHour: 10,
      location: "",
      color: "bg-blue-500/50",
    })
    setIsAddingClass(false)

    toast({
      title: "Aula adicionada",
      description: `A aula ${classToAdd.name} foi adicionada com sucesso.`,
    })
  }

  const handleDeleteClass = (id: string) => {
    setClasses(classes.filter((c) => c.id !== id))
    toast({
      title: "Aula removida",
      description: "A aula foi removida com sucesso.",
    })
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImportStatus("processing")
    setImportMessage("Processando arquivo...")

    // Simular processamento do arquivo
    setTimeout(() => {
      try {
        // Em um app real, aqui seria feito o parsing do arquivo
        // Para este exemplo, vamos simular a importação bem-sucedida

        const newClasses: ClassSchedule[] = [
          {
            id: `imported-${Date.now()}-1`,
            name: "Cálculo I",
            professor: "Dr. Ricardo Oliveira",
            day: 1,
            startHour: 8,
            endHour: 10,
            location: "Pavilhão de Aulas I - Sala 103",
            color: "bg-purple-500/50",
          },
          {
            id: `imported-${Date.now()}-2`,
            name: "Física Experimental",
            professor: "Dra. Mariana Santos",
            day: 2,
            startHour: 10,
            endHour: 12,
            location: "Laboratório de Física - Bloco B",
            color: "bg-green-500/50",
          },
          {
            id: `imported-${Date.now()}-3`,
            name: "Programação Orientada a Objetos",
            professor: "Dr. Carlos Mendes",
            day: 3,
            startHour: 14,
            endHour: 16,
            location: "Laboratório de Informática 2",
            color: "bg-blue-500/50",
          },
          {
            id: `imported-${Date.now()}-4`,
            name: "Estrutura de Dados",
            professor: "Dra. Ana Ferreira",
            day: 4,
            startHour: 16,
            endHour: 18,
            location: "Pavilhão de Aulas II - Sala 205",
            color: "bg-amber-500/50",
          },
        ]

        setClasses([...classes, ...newClasses])
        setImportStatus("success")
        setImportMessage(`Importação concluída! ${newClasses.length} aulas foram adicionadas.`)

        toast({
          title: "Importação concluída",
          description: `${newClasses.length} aulas foram importadas com sucesso.`,
        })
      } catch (error) {
        setImportStatus("error")
        setImportMessage("Erro ao processar o arquivo. Verifique o formato e tente novamente.")
        console.log(error)

        toast({
          title: "Erro na importação",
          description: "Não foi possível processar o arquivo. Verifique o formato e tente novamente.",
          variant: "destructive",
        })
      }
    }, 2000)
  }

  const resetImport = () => {
    setImportStatus("idle")
    setImportMessage("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const colorOptions = [
    { value: "bg-blue-500/50", label: "Azul" },
    { value: "bg-green-500/50", label: "Verde" },
    { value: "bg-red-500/50", label: "Vermelho" },
    { value: "bg-yellow-500/50", label: "Amarelo" },
    { value: "bg-purple-500/50", label: "Roxo" },
    { value: "bg-pink-500/50", label: "Rosa" },
    { value: "bg-indigo-500/50", label: "Índigo" },
    { value: "bg-amber-500/50", label: "Âmbar" },
    { value: "bg-emerald-500/50", label: "Esmeralda" },
    { value: "bg-cyan-500/50", label: "Ciano" },
  ]

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Horários</h1>
          <div className="flex gap-2">
            <Dialog open={isImportingFile} onOpenChange={setIsImportingFile}>
              <DialogTrigger asChild>
                <Button variant="outline" size={isMobile ? "icon" : "default"}>
                  <FileUp className="h-4 w-4 mr-2" />
                  {!isMobile && "Importar"}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Importar Horários</DialogTitle>
                  <DialogDescription>
                    Faça upload de um arquivo de horários para importar automaticamente suas aulas. Formatos suportados:
                    CSV, XLS, XLSX, PDF.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  {importStatus === "idle" && (
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="schedule-file">Arquivo de Horários</Label>
                      <Input
                        id="schedule-file"
                        type="file"
                        ref={fileInputRef}
                        accept=".csv,.xls,.xlsx,.pdf"
                        onChange={handleFileUpload}
                      />
                      <p className="text-xs text-muted-foreground">
                        O sistema tentará extrair automaticamente as informações de aulas, professores, locais e
                        horários.
                      </p>
                    </div>
                  )}

                  {importStatus === "processing" && (
                    <div className="flex items-center justify-center py-4">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-current border-t-transparent text-blue-400" />
                      <span className="ml-2">{importMessage}</span>
                    </div>
                  )}

                  {importStatus === "success" && (
                    <Alert className="border-green-500 bg-green-50 dark:bg-green-950/30">
                      <Check className="h-4 w-4 text-green-500" />
                      <AlertTitle>Importação concluída</AlertTitle>
                      <AlertDescription>{importMessage}</AlertDescription>
                    </Alert>
                  )}

                  {importStatus === "error" && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Erro na importação</AlertTitle>
                      <AlertDescription>{importMessage}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <DialogFooter>
                  {importStatus === "idle" && (
                    <Button variant="outline" onClick={() => setIsImportingFile(false)}>
                      Cancelar
                    </Button>
                  )}

                  {(importStatus === "success" || importStatus === "error") && (
                    <Button
                      onClick={() => {
                        resetImport()
                        setIsImportingFile(false)
                      }}
                    >
                      Fechar
                    </Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isAddingClass} onOpenChange={setIsAddingClass}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Aula
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Nova Aula</DialogTitle>
                  <DialogDescription>Preencha os detalhes da aula para adicioná-la ao seu horário.</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome da Disciplina</Label>
                    <Input
                      id="name"
                      value={newClass.name}
                      onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                      placeholder="Ex: Cálculo I"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="professor">Professor</Label>
                    <Input
                      id="professor"
                      value={newClass.professor}
                      onChange={(e) => setNewClass({ ...newClass, professor: e.target.value })}
                      placeholder="Ex: Dr. João Silva"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="day">Dia da Semana</Label>
                      <Select
                        value={String(newClass.day)}
                        onValueChange={(value) => setNewClass({ ...newClass, day: Number(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o dia" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Segunda-feira</SelectItem>
                          <SelectItem value="2">Terça-feira</SelectItem>
                          <SelectItem value="3">Quarta-feira</SelectItem>
                          <SelectItem value="4">Quinta-feira</SelectItem>
                          <SelectItem value="5">Sexta-feira</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="color">Cor</Label>
                      <Select
                        value={newClass.color}
                        onValueChange={(value) => setNewClass({ ...newClass, color: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a cor" />
                        </SelectTrigger>
                        <SelectContent>
                          {colorOptions.map((color) => (
                            <SelectItem key={color.value} value={color.value}>
                              <div className="flex items-center">
                                <div className={`w-4 h-4 rounded mr-2 ${color.value}`} />
                                {color.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="startHour">Hora de Início</Label>
                      <Select
                        value={String(newClass.startHour)}
                        onValueChange={(value) => setNewClass({ ...newClass, startHour: Number(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Hora de início" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => i + 8).map((hour) => (
                            <SelectItem key={hour} value={String(hour)}>
                              {hour}:00
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="endHour">Hora de Término</Label>
                      <Select
                        value={String(newClass.endHour)}
                        onValueChange={(value) => setNewClass({ ...newClass, endHour: Number(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Hora de término" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => i + 9).map((hour) => (
                            <SelectItem key={hour} value={String(hour)}>
                              {hour}:00
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="location">Local</Label>
                    <Input
                      id="location"
                      value={newClass.location}
                      onChange={(e) => setNewClass({ ...newClass, location: e.target.value })}
                      placeholder="Ex: Pavilhão de Aulas I - Sala 103"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddingClass(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddClass}>Adicionar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calendar">Calendário</TabsTrigger>
            <TabsTrigger value="list">Lista</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="pt-4">
            <WeeklyCalendar classes={classes} />
          </TabsContent>

          <TabsContent value="list" className="pt-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {classes.length > 0 ? (
                classes.map((classItem) => (
                  <Card
                    key={classItem.id}
                    className={`overflow-hidden border-t-4 ${classItem.color.replace("/50", "")}`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg font-medium">{classItem.name}</CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDeleteClass(classItem.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardDescription>{classItem.professor}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium">Dia:</span>
                          <span>{DAYS[classItem.day]}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Horário:</span>
                          <span>
                            {classItem.startHour}:00 - {classItem.endHour}:00
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Local:</span>
                          <span className="text-right">{classItem.location || "Não especificado"}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="col-span-full border-dashed">
                  <CardContent className="pt-6 flex flex-col items-center justify-center text-center">
                    <p className="text-muted-foreground mb-4">Você ainda não adicionou nenhuma aula ao seu horário.</p>
                    <Button onClick={() => setIsAddingClass(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Aula
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function WeeklyCalendar({ classes }: { classes: ClassSchedule[] }) {
  const isMobile = useMobile()
  const days = ["Seg", "Ter", "Qua", "Qui", "Sex"]
  const fullDays = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"]
  const dayIndices = [1, 2, 3, 4, 5] // Índices correspondentes aos dias da semana (1-5 para Segunda-Sexta)
  const hours = Array.from({ length: 12 }, (_, i) => i + 8) // 8 AM to 7 PM

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agenda Semanal</CardTitle>
        <CardDescription>Sua programação para esta semana</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="grid min-w-[500px]" style={{ gridTemplateColumns: "80px repeat(5, 1fr)" }}>
            <div className="sticky left-0 bg-background z-10 h-10 flex items-center justify-center font-medium border-b"></div>
            {(isMobile ? days : fullDays).map((day, index) => (
              <div
                key={day}
                className={`px-2 py-2 text-center font-medium border-b h-10 flex items-center justify-center
                  ${isCurrentDay(dayIndices[index]) ? "bg-blue-900/20" : ""}`}
              >
                {day}
              </div>
            ))}

            {hours.map((hour, hourIndex) => (
              <React.Fragment key={hour}>
                <div
                  className={`sticky left-0 bg-background z-10 border-b px-2 py-3 text-sm font-medium flex items-center justify-center
                    ${isCurrentHour(hour) ? "bg-blue-900/20" : hourIndex % 2 === 0 ? "bg-muted/30" : ""}`}
                >
                  {hour}:00
                </div>
                {dayIndices.map((dayIndex) => (
                  <div
                    key={`${dayIndex}-${hour}`}
                    className={`border-b px-1 py-1 min-h-[60px] relative
                      ${hourIndex % 2 === 0 ? "bg-muted/30" : ""}
                      ${isCurrentDay(dayIndex) && isCurrentHour(hour) ? "bg-blue-900/20" : ""}`}
                  >
                    {(() => {
                      const classInSlot = getClassForTimeSlot(classes, dayIndex, hour)
                      if (classInSlot && hour === classInSlot.startHour) {
                        const durationHours = classInSlot.endHour - classInSlot.startHour
                        return (
                          <div
                            className={`rounded ${classInSlot.color} p-1 text-xs shadow-md hover:brightness-110 transition-all`}
                            style={{
                              height: durationHours > 1 ? `${durationHours * 60 - 8}px` : "auto",
                            }}
                          >
                            <div className="font-medium">{classInSlot.name}</div>
                            <div className="hidden sm:block">{`${classInSlot.startHour}:00 - ${classInSlot.endHour}:00`}</div>
                            {classInSlot.location && (
                              <div className="hidden sm:block text-[10px] opacity-80 truncate">
                                {classInSlot.location}
                              </div>
                            )}
                          </div>
                        )
                      }
                      return null
                    })()}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
