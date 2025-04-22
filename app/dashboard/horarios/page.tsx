"use client";

import React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Plus, Trash2, FileUp, AlertCircle, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  type ClassSchedule,
  DAYS,
  isCurrentDay,
  isCurrentHour,
} from "@/lib/schedule-utils";
import { useMobile } from "@/hooks/use-mobile";

export default function SchedulePage() {
  const [classes, setClasses] = useState<ClassSchedule[]>([]);
  const [newClass, setNewClass] = useState<Partial<ClassSchedule>>({
    name: "",
    professor: "",
    day: 1, // Segunda-feira
    startHour: 7,
    endHour: 8,
    location: "",
    color: "bg-blue-500", // Removido /50 para tirar a transparência
  });
  const [isAddingClass, setIsAddingClass] = useState(false);
  const [isImportingFile, setIsImportingFile] = useState(false);
  const [importStatus, setImportStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [importMessage, setImportMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const isMobile = useMobile();

  const [disciplines, setDisciplines] = useState<string[]>([]);
  const [suggestedProfessors, setSuggestedProfessors] = useState<string[]>([]);
  const [suggestedSubjects, setSuggestedSubjects] = useState<string[]>([]);

  useEffect(() => {
    const fetchDisciplines = async () => {
      try {
        const [ccabResponse, cetecResponse] = await Promise.all([
          fetch("/static/CCAAB.json"),
          fetch("/static/CETEC.json"),
        ]);

        const ccabData = await ccabResponse.json();
        const cetecData = await cetecResponse.json();
        setDisciplines([...ccabData, ...cetecData]);
      } catch (error) {
        console.error("Erro ao buscar disciplinas:", error);
      }
    };

    fetchDisciplines();
  }, []);

  useEffect(() => {
    const typedName = newClass.name?.toLowerCase();
    const typedProfessor = newClass.professor?.toLowerCase();

    setSuggestedSubjects(
      disciplines
        .filter(
          (subject) =>
            subject && subject.toLowerCase().includes(typedName || "")
        )
        .map((subject) => subject)
    );

    setSuggestedProfessors(
      disciplines.filter(
        (subject) =>
          subject.toLowerCase().includes(typedProfessor || "") &&
          subject.toLowerCase() !== "não informado"
      )
    );
  }, [disciplines, newClass.name, newClass.professor]);

  // Carregar aulas salvas do localStorage
  useEffect(() => {
    const savedClasses = localStorage.getItem("userClasses");
    if (savedClasses) {
      setClasses(JSON.parse(savedClasses));
    }
  }, []);

  // Salvar aulas no localStorage quando houver alterações
  useEffect(() => {
    localStorage.setItem("userClasses", JSON.stringify(classes));
  }, [classes]);

  const handleAddClass = () => {
    const normalizedProfessor = newClass.professor?.trim().toLowerCase();
    const normalizedDiscipline = newClass.name?.trim().toLowerCase();

    const validInput = disciplines.find(
      (discipline) =>
        discipline.toLowerCase() === normalizedDiscipline ||
        discipline.toLowerCase() === normalizedProfessor
    );

    if (!validInput) {
      toast({
        title: "Erro ao adicionar aula",
        description: "Nome da disciplina ou professor inválido.",
        variant: "destructive",
      });
      return;
    }

    if (!newClass.name) {
      toast({
        title: "Erro ao adicionar aula",
        description: "O nome da aula é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    if (
      !newClass.startHour ||
      !newClass.endHour ||
      newClass.startHour >= newClass.endHour
    ) {
      toast({
        title: "Erro ao adicionar aula",
        description:
          "O horário de início deve ser anterior ao horário de término.",
        variant: "destructive",
      });
      return;
    }

    const id = `class-${Date.now()}`;
    // Remover transparência da cor
    let color = newClass.color;
    if (color && color.includes("/50")) {
      color = color.replace("/50", "");
    }

    const classToAdd = { ...newClass, id, color } as ClassSchedule;

    setClasses([...classes, classToAdd]);
    setNewClass({
      name: "",
      professor: "",
      day: 1,
      startHour: 7,
      endHour: 8,
      location: "",
      color: "bg-blue-500", // Sem transparência
    });
    setIsAddingClass(false);

    toast({
      title: "Aula adicionada",
      description: `A aula ${classToAdd.name} foi adicionada com sucesso.`,
    });
  };

  const handleDeleteClass = (id: string) => {
    setClasses(classes.filter((c) => c.id !== id));
    toast({
      title: "Aula removida",
      description: "A aula foi removida com sucesso.",
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportStatus("processing");
    setImportMessage("Processando arquivo...");

    // Simular processamento do arquivo
    setTimeout(() => {
      try {
        const newClasses: ClassSchedule[] = [
          {
            id: `imported-${Date.now()}-1`,
            name: "Cálculo I",
            professor: "Dr. Ricardo Oliveira",
            day: 1,
            startHour: 8,
            endHour: 10,
            location: "Pavilhão de Aulas I - Sala 103",
            color: "bg-purple-500", // Sem transparência
          },
          {
            id: `imported-${Date.now()}-2`,
            name: "Física Experimental",
            professor: "Dra. Mariana Santos",
            day: 2,
            startHour: 10,
            endHour: 12,
            location: "Laboratório de Física - Bloco B",
            color: "bg-green-500", // Sem transparência
          },
          {
            id: `imported-${Date.now()}-3`,
            name: "Programação Orientada a Objetos",
            professor: "Dr. Carlos Mendes",
            day: 3,
            startHour: 14,
            endHour: 16,
            location: "Laboratório de Informática 2",
            color: "bg-blue-500", // Sem transparência
          },
          {
            id: `imported-${Date.now()}-4`,
            name: "Estrutura de Dados",
            professor: "Dra. Ana Ferreira",
            day: 4,
            startHour: 16,
            endHour: 18,
            location: "Pavilhão de Aulas II - Sala 205",
            color: "bg-amber-500", // Sem transparência
          },
        ];

        setClasses([...classes, ...newClasses]);
        setImportStatus("success");
        setImportMessage(
          `Importação concluída! ${newClasses.length} aulas foram adicionadas.`
        );

        toast({
          title: "Importação concluída",
          description: `${newClasses.length} aulas foram importadas com sucesso.`,
        });
      } catch (error) {
        setImportStatus("error");
        setImportMessage(
          "Erro ao processar o arquivo. Verifique o formato e tente novamente."
        );
        console.log(error);

        toast({
          title: "Erro na importação",
          description:
            "Não foi possível processar o arquivo. Verifique o formato e tente novamente.",
          variant: "destructive",
        });
      }
    }, 2000);
  };

  const resetImport = () => {
    setImportStatus("idle");
    setImportMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const colorOptions = [
    { value: "bg-blue-500", label: "Azul" },
    { value: "bg-green-500", label: "Verde" },
    { value: "bg-red-500", label: "Vermelho" },
    { value: "bg-yellow-500", label: "Amarelo" },
    { value: "bg-purple-500", label: "Roxo" },
    { value: "bg-pink-500", label: "Rosa" },
    { value: "bg-indigo-500", label: "Índigo" },
    { value: "bg-amber-500", label: "Âmbar" },
    { value: "bg-emerald-500", label: "Esmeralda" },
    { value: "bg-cyan-500", label: "Ciano" },
  ];

  // Gerar opções de horários de 7:00 às 22:30
  const timeOptions = Array.from({ length: 32 }, (_, i) => {
    const hour = Math.floor((i + 14) / 2) + (i % 2 === 0 ? 0 : 0.5);
    const displayHour = Math.floor(hour);
    const minutes = hour % 1 === 0 ? "00" : "30";
    return { value: hour, label: `${displayHour}:${minutes}` };
  });

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Horários
          </h1>
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
                    Faça upload de um arquivo de horários para importar
                    automaticamente suas aulas. Formatos suportados: CSV, XLS,
                    XLSX, PDF.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  {importStatus === "idle" && (
                    <div className="grid w-full max-w-sm items-center gap-3">
                      <Label htmlFor="schedule-file">Arquivo de Horários</Label>
                      <Input
                        id="schedule-file"
                        type="file"
                        ref={fileInputRef}
                        accept=".csv,.xls,.xlsx,.pdf"
                        onChange={handleFileUpload}
                      />
                      <p className="text-xs text-muted-foreground">
                        O sistema tentará extrair automaticamente as informações
                        de aulas, professores, locais e horários.
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
                    <Button
                      variant="outline"
                      onClick={() => setIsImportingFile(false)}
                    >
                      Cancelar
                    </Button>
                  )}

                  {(importStatus === "success" || importStatus === "error") && (
                    <Button
                      onClick={() => {
                        resetImport();
                        setIsImportingFile(false);
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
                  <DialogDescription>
                    Preencha os detalhes da aula para adicioná-la ao seu
                    horário.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  {/* Disciplina */}
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome da Disciplina</Label>
                    <Input
                      id="name"
                      value={newClass.name}
                      onChange={(e) =>
                        setNewClass({ ...newClass, name: e.target.value })
                      }
                      placeholder="Ex: Cálculo I"
                    />
                    {suggestedSubjects.length > 0 && (
                      <ul className="text-sm text-muted-foreground">
                        {suggestedSubjects.map((subject, index) => (
                          <li
                            key={index}
                            className="cursor-pointer hover:text-primary"
                            onClick={() =>
                              setNewClass({ ...newClass, name: subject })
                            }
                          >
                            {subject}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Professor */}
                  <div className="grid gap-2">
                    <Label htmlFor="professor">Professor</Label>
                    <Input
                      id="professor"
                      value={newClass.professor}
                      onChange={(e) =>
                        setNewClass({ ...newClass, professor: e.target.value })
                      }
                      placeholder="Ex: Dr. João Silva"
                    />
                    {suggestedProfessors.length > 0 && (
                      <ul className="text-sm text-muted-foreground">
                        {suggestedProfessors.map((prof, index) => (
                          <li
                            key={index}
                            className="cursor-pointer hover:text-primary"
                            onClick={() =>
                              setNewClass({ ...newClass, professor: prof })
                            }
                          >
                            {prof}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="day">Dia da Semana</Label>
                      <Select
                        value={String(newClass.day)}
                        onValueChange={(value) =>
                          setNewClass({ ...newClass, day: Number(value) })
                        }
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
                        onValueChange={(value) =>
                          setNewClass({ ...newClass, color: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a cor" />
                        </SelectTrigger>
                        <SelectContent>
                          {colorOptions.map((color) => (
                            <SelectItem key={color.value} value={color.value}>
                              <div className="flex items-center">
                                <div
                                  className={`w-4 h-4 rounded mr-2 ${color.value}`}
                                />
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
                        onValueChange={(value) =>
                          setNewClass({ ...newClass, startHour: Number(value) })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Hora de início" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.slice(0, -1).map((time) => (
                            <SelectItem
                              key={time.value}
                              value={String(time.value)}
                            >
                              {time.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="endHour">Hora de Término</Label>
                      <Select
                        value={String(newClass.endHour)}
                        onValueChange={(value) =>
                          setNewClass({ ...newClass, endHour: Number(value) })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Hora de término" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions
                            .filter(
                              (time) => time.value > (newClass.startHour || 7)
                            )
                            .map((time) => (
                              <SelectItem
                                key={time.value}
                                value={String(time.value)}
                              >
                                {time.label}
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
                      onChange={(e) =>
                        setNewClass({ ...newClass, location: e.target.value })
                      }
                      placeholder="Ex: Pavilhão de Aulas I - Sala 103"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddingClass(false)}
                  >
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
                    className={`overflow-hidden border-t-4 ${classItem.color}`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg font-medium">
                          {classItem.name}
                        </CardTitle>
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
                            {classItem.startHour % 1 === 0
                              ? `${Math.floor(classItem.startHour)}:00`
                              : `${Math.floor(classItem.startHour)}:30`}{" "}
                            -
                            {classItem.endHour % 1 === 0
                              ? `${Math.floor(classItem.endHour)}:00`
                              : `${Math.floor(classItem.endHour)}:30`}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Local:</span>
                          <span className="text-right">
                            {classItem.location || "Não especificado"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="col-span-full border-dashed">
                  <CardContent className="pt-6 flex flex-col items-center justify-center text-center">
                    <p className="text-muted-foreground mb-4">
                      Você ainda não adicionou nenhuma aula ao seu horário.
                    </p>
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
  );
}

function WeeklyCalendar({ classes }: { classes: ClassSchedule[] }) {
  const isMobile = useMobile();
  const days = ["Seg", "Ter", "Qua", "Qui", "Sex"];
  const fullDays = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];
  const dayIndices = [1, 2, 3, 4, 5]; // Índices correspondentes aos dias da semana (1-5 para Segunda-Sexta)
  const hours = Array.from({ length: 32 }, (_, i) => 7 + i * 0.5); // 7:00 AM to 22:30 PM

  // Cálculo de quantas células de meia hora existem em uma hora
  const cellsPerHour = 2;

  // Criar um conjunto para rastrear quais células já foram renderizadas
  const renderedCells = new Set();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agenda Semanal</CardTitle>
        <CardDescription>Sua programação para esta semana</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div
            className="grid min-w-[600px]"
            style={{ gridTemplateColumns: "100px repeat(5, 1fr)" }}
          >
            <div className="sticky left-0 bg-background z-10 h-12 flex items-center justify-center font-medium border-b"></div>
            {(isMobile ? days : fullDays).map((day, index) => (
              <div
                key={day}
                className={`px-2 py-2 text-center font-medium border-b h-12 flex items-center justify-center
                  ${isCurrentDay(dayIndices[index]) ? "bg-blue-900/20" : ""}`}
              >
                {day}
              </div>
            ))}

            {hours.map((hour, hourIndex) => {
              return (
                <React.Fragment key={hour}>
                  <div
                    className={`sticky left-0 bg-background z-10 border-b px-2 py-3 text-sm font-medium flex items-center justify-center
                      ${
                        isCurrentHour(hour)
                          ? "bg-blue-900/20"
                          : hourIndex % 2 === 0
                          ? "bg-muted/30"
                          : ""
                      }`}
                  >
                    {hour % 1 === 0
                      ? `${Math.floor(hour)}:00`
                      : `${Math.floor(hour)}:30`}
                  </div>
                  {dayIndices.map((dayIndex) => {
                    const cellKey = `${dayIndex}-${hour}`;

                    // Se a célula já foi renderizada, retornamos uma célula vazia
                    if (renderedCells.has(cellKey)) {
                      return (
                        <div
                          key={cellKey}
                          className={`border-b px-2 py-2 min-h-[80px]
                            ${hourIndex % 2 === 0 ? "bg-muted/30" : ""}
                            ${
                              isCurrentDay(dayIndex) && isCurrentHour(hour)
                                ? "bg-blue-900/20"
                                : ""
                            }`}
                        />
                      );
                    }

                    // Encontrar a aula que começa neste horário específico
                    const classInSlot = classes.find(
                      (c) =>
                        c.day === dayIndex &&
                        Math.abs(c.startHour - hour) < 0.01
                    );

                    if (classInSlot) {
                      // Calcular o número de células de meia hora que esta aula ocupa
                      const duration =
                        classInSlot.endHour - classInSlot.startHour;
                      const adjustedDuration = duration + 0.5; // Adiciona meia hora para o cálculo
                      const numCells = adjustedDuration * cellsPerHour;

                      // Marcar células futuras como renderizadas para evitar sobreposição
                      for (let i = 0.5; i < duration; i += 0.5) {
                        renderedCells.add(`${dayIndex}-${hour + i}`);
                      }

                      return (
                        <div
                          key={cellKey}
                          className={`border-b px-2 min-h-[80px] relative
                            ${hourIndex % 2 === 0 ? "bg-muted/30" : ""}
                            ${
                              isCurrentDay(dayIndex) && isCurrentHour(hour)
                                ? "bg-blue-900/20"
                                : ""
                            }`}
                        >
                          <div
                            className={`rounded ${classInSlot.color} text-white p-3 shadow-md hover:brightness-110 transition-all overflow-y-auto absolute left-0 right-0 mx-2 z-10`}
                            style={{
                              height: `${numCells * 80}px`,
                            }}
                          >
                            <div>
                              <div className="font-medium text-base">
                                {classInSlot.name}
                              </div>
                              <div className="text-sm">
                                {classInSlot.startHour % 1 === 0
                                  ? `${Math.floor(classInSlot.startHour)}:00`
                                  : `${Math.floor(
                                      classInSlot.startHour
                                    )}:30`}{" "}
                                -{" "}
                                {classInSlot.endHour % 1 === 0
                                  ? `${Math.floor(classInSlot.endHour)}:00`
                                  : `${Math.floor(classInSlot.endHour)}:30`}
                              </div>
                              {classInSlot.professor && (
                                <div className="text-sm mt-1">
                                  {classInSlot.professor}
                                </div>
                              )}
                              {classInSlot.location && (
                                <div className="text-sm mt-1">
                                  {classInSlot.location}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }

                    // Célula sem aula
                    return (
                      <div
                        key={cellKey}
                        className={`border-b px-2 py-2 min-h-[80px]
                          ${hourIndex % 2 === 0 ? "bg-muted/30" : ""}
                          ${
                            isCurrentDay(dayIndex) && isCurrentHour(hour)
                              ? "bg-blue-900/20"
                              : ""
                          }`}
                      />
                    );
                  })}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
