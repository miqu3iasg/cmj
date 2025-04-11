"use client"

import { Button } from "@/components/ui/button"

import React from "react"

import { useState, useEffect } from "react"
import { Calendar, Clock, MapPin, Utensils, Globe } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMobile } from "@/hooks/use-mobile"
import {
  type ClassSchedule,
  DAYS,
  getClassForTimeSlot,
  getNextClass,
  isCurrentDay,
  isCurrentHour,
} from "@/lib/schedule-utils"
import { Badge } from "@/components/ui/badge"
import { getNextBusTime, getCurrentDayMenu } from "@/lib/university-utils"
import { DailyMenu, WeeklyMenu } from "@/types/menu"

export default function Dashboard() {
  // const isMobile = useMobile()
  const [classes, setClasses] = useState<ClassSchedule[]>([])
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [nextBus, setNextBus] = useState<{ time: string; location: string } | null>(null)
  const [todayMenu, setTodayMenu] = useState<DailyMenu | null>(null)

  // Carregar aulas salvas do localStorage
  useEffect(() => {
    const savedClasses = localStorage.getItem("userClasses")
    if (savedClasses) {
      setClasses(JSON.parse(savedClasses))
    }
  }, [])

  // Obter localização do usuário e próximo ônibus
  useEffect(() => {
    // Simular localização do usuário (em um app real, usaria geolocalização)
    const simulatedLocation = {
      lat: -12.656,
      lng: -39.087,
    }
    setUserLocation(simulatedLocation)

    // Obter próximo ônibus com base na localização
    const nextBusInfo = getNextBusTime(simulatedLocation)
    setNextBus(nextBusInfo)
  }, [])

  // Obter cardápio do dia
  useEffect(() => {
    const menu = getCurrentDayMenu()
    setTodayMenu(menu)
  }, [])

  const nextClass = getNextClass(classes)

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Painel</h1>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => window.open("https://sistemas.ufrb.edu.br/sigaa/verTelaLogin.do", "_blank")}
          >
            <Globe className="h-4 w-4 mr-1" />
            SIGAA
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="classes">Aulas</TabsTrigger>
            <TabsTrigger value="buses">Ônibus</TabsTrigger>
            <TabsTrigger value="restaurants">Restaurante</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4 pt-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {nextClass ? (
                <ScheduleCard
                  title="Próxima Aula"
                  description={nextClass.name}
                  time={`${nextClass.startHour}:00 - ${nextClass.endHour}:00`}
                  location={nextClass.location || "Local não especificado"}
                  type="class"
                  professor={nextClass.professor}
                  color={nextClass.color}
                />
              ) : (
                <ScheduleCard
                  title="Próxima Aula"
                  description="Nenhuma aula agendada"
                  time="--:-- - --:--"
                  location="--"
                  type="class"
                />
              )}

              {nextBus ? (
                <ScheduleCard
                  title="Próximo Ônibus"
                  description="Circular do Campus"
                  time={nextBus.time}
                  location={nextBus.location}
                  type="bus"
                />
              ) : (
                <ScheduleCard
                  title="Próximo Ônibus"
                  description="Circular do Campus"
                  time="Sem horários disponíveis"
                  location="--"
                  type="bus"
                />
              )}

              <RestaurantCard menu={todayMenu} />
            </div>
            <WeeklyCalendar classes={classes} />
          </TabsContent>
          <TabsContent value="classes" className="space-y-4 pt-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {classes.length > 0 ? (
                classes
                  .slice(0, 6)
                  .map((classItem) => (
                    <ScheduleCard
                      key={classItem.id}
                      title={classItem.name}
                      description={classItem.professor || "Professor não especificado"}
                      time={`${classItem.startHour}:00 - ${classItem.endHour}:00`}
                      location={classItem.location || "Local não especificado"}
                      type="class"
                      professor={classItem.professor}
                      day={DAYS[classItem.day]}
                      color={classItem.color}
                    />
                  ))
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Nenhuma Aula</CardTitle>
                    <CardDescription>Você ainda não adicionou nenhuma aula</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Vá para a página de Horários para adicionar suas aulas.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          <TabsContent value="buses" className="space-y-4 pt-4">
            <BusScheduleContent userLocation={userLocation} />
          </TabsContent>
          <TabsContent value="restaurants" className="space-y-4 pt-4">
            <RestaurantContent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function RestaurantCard({ menu }: { menu: any }) {
  if (!menu) {
    return (
      <ScheduleCard
        title="Restaurante Universitário"
        description="Cardápio não disponível"
        time="11:00 - 14:00, 17:00 - 20:00"
        location="Centro Estudantil, 1º Andar"
        type="restaurant"
      />
    )
  }

  const dayName = menu.dayName
  const mainDish = menu.lunch.mainDish || "Não disponível"

  return (
    <Card className="overflow-hidden border-t-4 border-t-amber-600">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Restaurante Universitário</CardTitle>
        <Utensils className="h-5 w-5 text-amber-600" />
      </CardHeader>
      <CardContent>
        <CardDescription>Cardápio de hoje ({dayName})</CardDescription>
        <div className="mt-2 space-y-1">
          <div className="flex items-center text-sm">
            <Badge variant="outline" className="mr-2 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
              Almoço
            </Badge>
            <span className="font-medium">{mainDish}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>11:00 - 14:00, 17:00 - 20:00</span>
          </div>
          <div className="flex items-center text-sm">
            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Centro Estudantil, 1º Andar</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface ScheduleCardProps {
  title: string
  description: string
  time: string
  location: string
  type: "class" | "bus" | "restaurant"
  professor?: string
  day?: string
  color?: string
}

function ScheduleCard({ title, description, time, location, type, professor, day, color }: ScheduleCardProps) {
  const getIcon = () => {
    switch (type) {
      case "class":
        return <Calendar className="h-5 w-5 text-blue-400" />
      case "bus":
        return <Clock className="h-5 w-5 text-blue-400" />
      case "restaurant":
        return <MapPin className="h-5 w-5 text-blue-400" />
    }
  }

  return (
    <Card
      className={color ? "overflow-hidden border-t-4" : ""}
      style={color ? { borderTopColor: color.replace("bg-", "").replace("/50", "") } : {}}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        {getIcon()}
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
        <div className="mt-2 space-y-1">
          {day && (
            <div className="flex items-center text-sm">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{day}</span>
            </div>
          )}
          <div className="flex items-center text-sm">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{time}</span>
          </div>
          <div className="flex items-center text-sm">
            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{location}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function WeeklyCalendar({ classes }: { classes: ClassSchedule[] }) {
  const isMobile = useMobile()
  const days = ["Seg", "Ter", "Qua", "Qui", "Sex"]
  const fullDays = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"]
  const dayIndices = [1, 2, 3, 4, 5] // Índices correspondentes aos dias da semana (1-5 para Segunda-Sexta)
  const hours = Array.from({ length: 12 }, (_, i) => i + 8) // 8 AM to 7 PM

  return (
    <Card className="col-span-full">
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

function BusScheduleContent({ userLocation }: { userLocation: { lat: number; lng: number } | null }) {
  const [nextBus, setNextBus] = useState<{ time: string; location: string } | null>(null)

  useEffect(() => {
    if (userLocation) {
      const nextBusInfo = getNextBusTime(userLocation)
      setNextBus(nextBusInfo)
    }
  }, [userLocation])

  return (
    <div className="grid gap-4">
      {nextBus && (
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-blue-500" />
              Próximo Ônibus
            </CardTitle>
            <CardDescription>
              O próximo ônibus passará às{" "}
              <span className="font-bold text-blue-600 dark:text-blue-400">{nextBus.time}</span> no ponto{" "}
              <span className="font-bold">{nextBus.location}</span>
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Circular UFRB - 2024.2</CardTitle>
          <CardDescription>Horários oficiais do ônibus circular do campus</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-muted/50">
                  <th className="border px-3 py-2 text-left text-sm font-medium sticky left-0 bg-muted/50 z-10">
                    Local
                  </th>
                  <th className="border px-3 py-2 text-center text-sm font-medium bg-amber-50 dark:bg-amber-950/20">
                    Manhã
                  </th>
                  <th className="border px-3 py-2 text-center text-sm font-medium bg-orange-50 dark:bg-orange-950/20">
                    Meio Dia
                  </th>
                  <th className="border px-3 py-2 text-center text-sm font-medium bg-blue-50 dark:bg-blue-950/20">
                    Tarde
                  </th>
                  <th className="border px-3 py-2 text-center text-sm font-medium bg-indigo-50 dark:bg-indigo-950/20">
                    Noite
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-3 py-2 font-medium sticky left-0 bg-background z-10">Garagem</td>
                  <td className="border px-3 py-2 text-center bg-amber-50/50 dark:bg-amber-950/10">6:25, 9:35</td>
                  <td className="border px-3 py-2 text-center bg-orange-50/50 dark:bg-orange-950/10">11:30</td>
                  <td className="border px-3 py-2 text-center bg-blue-50/50 dark:bg-blue-950/10">
                    15:35, 16:00, 17:30
                  </td>
                  <td className="border px-3 py-2 text-center bg-indigo-50/50 dark:bg-indigo-950/10">
                    20:40, 21:40, 22:30
                  </td>
                </tr>
                <tr>
                  <td className="border px-3 py-2 font-medium sticky left-0 bg-background z-10">RU/Residências</td>
                  <td className="border px-3 py-2 text-center bg-amber-50/50 dark:bg-amber-950/10">
                    6:50, 7:10, 7:25, 7:40, 7:55
                  </td>
                  <td className="border px-3 py-2 text-center bg-orange-50/50 dark:bg-orange-950/10">11:55, 12:20</td>
                  <td className="border px-3 py-2 text-center bg-blue-50/50 dark:bg-blue-950/10">
                    13:25, 13:45, 14:00, 16:05
                  </td>
                  <td className="border px-3 py-2 text-center bg-indigo-50/50 dark:bg-indigo-950/10">17:55, 18:15</td>
                </tr>
                <tr>
                  <td className="border px-3 py-2 font-medium sticky left-0 bg-background z-10">Fitotecnia</td>
                  <td className="border px-3 py-2 text-center bg-amber-50/50 dark:bg-amber-950/10">
                    6:40, 7:10, 7:25, 7:40, 7:55
                  </td>
                  <td className="border px-3 py-2 text-center bg-orange-50/50 dark:bg-orange-950/10">10:00</td>
                  <td className="border px-3 py-2 text-center bg-blue-50/50 dark:bg-blue-950/10">
                    12:25, 13:45, 14:00
                  </td>
                  <td className="border px-3 py-2 text-center bg-indigo-50/50 dark:bg-indigo-950/10">17:55, 18:15</td>
                </tr>
                <tr>
                  <td className="border px-3 py-2 font-medium sticky left-0 bg-background z-10">Entroncamento</td>
                  <td className="border px-3 py-2 text-center bg-amber-50/50 dark:bg-amber-950/10">-</td>
                  <td className="border px-3 py-2 text-center bg-orange-50/50 dark:bg-orange-950/10">-</td>
                  <td className="border px-3 py-2 text-center bg-blue-50/50 dark:bg-blue-950/10">-</td>
                  <td className="border px-3 py-2 text-center bg-indigo-50/50 dark:bg-indigo-950/10">-</td>
                </tr>
                <tr>
                  <td className="border px-3 py-2 font-medium sticky left-0 bg-background z-10">Prédio de Solos</td>
                  <td className="border px-3 py-2 text-center bg-amber-50/50 dark:bg-amber-950/10">-</td>
                  <td className="border px-3 py-2 text-center bg-orange-50/50 dark:bg-orange-950/10">-</td>
                  <td className="border px-3 py-2 text-center bg-blue-50/50 dark:bg-blue-950/10">-</td>
                  <td className="border px-3 py-2 text-center bg-indigo-50/50 dark:bg-indigo-950/10">-</td>
                </tr>
                <tr>
                  <td className="border px-3 py-2 font-medium sticky left-0 bg-background z-10">Pavilhão de Aulas I</td>
                  <td className="border px-3 py-2 text-center bg-amber-50/50 dark:bg-amber-950/10">-</td>
                  <td className="border px-3 py-2 text-center bg-orange-50/50 dark:bg-orange-950/10">-</td>
                  <td className="border px-3 py-2 text-center bg-blue-50/50 dark:bg-blue-950/10">-</td>
                  <td className="border px-3 py-2 text-center bg-indigo-50/50 dark:bg-indigo-950/10">-</td>
                </tr>
                <tr>
                  <td className="border px-3 py-2 font-medium sticky left-0 bg-background z-10">Biblioteca</td>
                  <td className="border px-3 py-2 text-center bg-amber-50/50 dark:bg-amber-950/10">-</td>
                  <td className="border px-3 py-2 text-center bg-orange-50/50 dark:bg-orange-950/10">-</td>
                  <td className="border px-3 py-2 text-center bg-blue-50/50 dark:bg-blue-950/10">-</td>
                  <td className="border px-3 py-2 text-center bg-indigo-50/50 dark:bg-indigo-950/10">-</td>
                </tr>
                <tr>
                  <td className="border px-3 py-2 font-medium sticky left-0 bg-background z-10">
                    Pavilhão de Aulas II
                  </td>
                  <td className="border px-3 py-2 text-center bg-amber-50/50 dark:bg-amber-950/10">-</td>
                  <td className="border px-3 py-2 text-center bg-orange-50/50 dark:bg-orange-950/10">-</td>
                  <td className="border px-3 py-2 text-center bg-blue-50/50 dark:bg-blue-950/10">-</td>
                  <td className="border px-3 py-2 text-center bg-indigo-50/50 dark:bg-indigo-950/10">-</td>
                </tr>
                <tr>
                  <td className="border px-3 py-2 font-medium sticky left-0 bg-background z-10">
                    Pavilhão de Engenharia
                  </td>
                  <td className="border px-3 py-2 text-center bg-amber-50/50 dark:bg-amber-950/10">-</td>
                  <td className="border px-3 py-2 text-center bg-orange-50/50 dark:bg-orange-950/10">-</td>
                  <td className="border px-3 py-2 text-center bg-blue-50/50 dark:bg-blue-950/10">-</td>
                  <td className="border px-3 py-2 text-center bg-indigo-50/50 dark:bg-indigo-950/10">-</td>
                </tr>
                <tr>
                  <td className="border px-3 py-2 font-medium sticky left-0 bg-background z-10">Portão 1 - Tabela</td>
                  <td className="border px-3 py-2 text-center bg-amber-50/50 dark:bg-amber-950/10">-</td>
                  <td className="border px-3 py-2 text-center bg-orange-50/50 dark:bg-orange-950/10">-</td>
                  <td className="border px-3 py-2 text-center bg-blue-50/50 dark:bg-blue-950/10">-</td>
                  <td className="border px-3 py-2 text-center bg-indigo-50/50 dark:bg-indigo-950/10">-</td>
                </tr>
                <tr>
                  <td className="border px-3 py-2 font-medium sticky left-0 bg-background z-10">
                    Ponto Externo 1 - Tabela
                  </td>
                  <td className="border px-3 py-2 text-center bg-amber-50/50 dark:bg-amber-950/10">-</td>
                  <td className="border px-3 py-2 text-center bg-orange-50/50 dark:bg-orange-950/10">-</td>
                  <td className="border px-3 py-2 text-center bg-blue-50/50 dark:bg-blue-950/10">-</td>
                  <td className="border px-3 py-2 text-center bg-indigo-50/50 dark:bg-indigo-950/10">-</td>
                </tr>
                <tr>
                  <td className="border px-3 py-2 font-medium sticky left-0 bg-background z-10">
                    Ponto Externo 2 - Tabela
                  </td>
                  <td className="border px-3 py-2 text-center bg-amber-50/50 dark:bg-amber-950/10">-</td>
                  <td className="border px-3 py-2 text-center bg-orange-50/50 dark:bg-orange-950/10">-</td>
                  <td className="border px-3 py-2 text-center bg-blue-50/50 dark:bg-blue-950/10">-</td>
                  <td className="border px-3 py-2 text-center bg-indigo-50/50 dark:bg-indigo-950/10">-</td>
                </tr>
                <tr>
                  <td className="border px-3 py-2 font-medium sticky left-0 bg-background z-10">Guarita Principal</td>
                  <td className="border px-3 py-2 text-center bg-amber-50/50 dark:bg-amber-950/10">-</td>
                  <td className="border px-3 py-2 text-center bg-orange-50/50 dark:bg-orange-950/10">-</td>
                  <td className="border px-3 py-2 text-center bg-blue-50/50 dark:bg-blue-950/10">-</td>
                  <td className="border px-3 py-2 text-center bg-indigo-50/50 dark:bg-indigo-950/10">-</td>
                </tr>
                <tr>
                  <td className="border px-3 py-2 font-medium sticky left-0 bg-background z-10">Biblioteca</td>
                  <td className="border px-3 py-2 text-center bg-amber-50/50 dark:bg-amber-950/10">-</td>
                  <td className="border px-3 py-2 text-center bg-orange-50/50 dark:bg-orange-950/10">-</td>
                  <td className="border px-3 py-2 text-center bg-blue-50/50 dark:bg-blue-950/10">-</td>
                  <td className="border px-3 py-2 text-center bg-indigo-50/50 dark:bg-indigo-950/10">-</td>
                </tr>
                <tr>
                  <td className="border px-3 py-2 font-medium sticky left-0 bg-background z-10">Reitoria</td>
                  <td className="border px-3 py-2 text-center bg-amber-50/50 dark:bg-amber-950/10">-</td>
                  <td className="border px-3 py-2 text-center bg-orange-50/50 dark:bg-orange-950/10">-</td>
                  <td className="border px-3 py-2 text-center bg-blue-50/50 dark:bg-blue-950/10">-</td>
                  <td className="border px-3 py-2 text-center bg-indigo-50/50  dark:bg-indigo-950/10">-</td>
                </tr>
                <tr>
                  <td className="border px-3 py-2 font-medium sticky left-0 bg-background z-10">Torre/CETEC</td>
                  <td className="border px-3 py-2 text-center bg-amber-50/50 dark:bg-amber-950/10">-</td>
                  <td className="border px-3 py-2 text-center bg-orange-50/50 dark:bg-orange-950/10">-</td>
                  <td className="border px-3 py-2 text-center bg-blue-50/50 dark:bg-blue-950/10">-</td>
                  <td className="border px-3 py-2 text-center bg-indigo-50/50 dark:bg-indigo-950/10">-</td>
                </tr>
                <tr>
                  <td className="border px-3 py-2 font-medium sticky left-0 bg-background z-10">RU/Residências</td>
                  <td className="border px-3 py-2 text-center bg-amber-50/50 dark:bg-amber-950/10">
                    6:50, 7:10, 7:25, 7:40, 7:55
                  </td>
                  <td className="border px-3 py-2 text-center bg-orange-50/50 dark:bg-orange-950/10">11:55, 12:20</td>
                  <td className="border px-3 py-2 text-center bg-blue-50/50 dark:bg-blue-950/10">
                    13:25, 13:45, 14:00, 16:05
                  </td>
                  <td className="border px-3 py-2 text-center bg-indigo-50/50 dark:bg-indigo-950/10">17:55, 18:15</td>
                </tr>
                <tr>
                  <td className="border px-3 py-2 font-medium sticky left-0 bg-background z-10">Fitotecnia</td>
                  <td className="border px-3 py-2 text-center bg-amber-50/50 dark:bg-amber-950/10">
                    6:40, 7:10, 7:25, 7:40, 7:55
                  </td>
                  <td className="border px-3 py-2 text-center bg-orange-50/50 dark:bg-orange-950/10">10:00</td>
                  <td className="border px-3 py-2 text-center bg-blue-50/50 dark:bg-blue-950/10">
                    12:25, 13:45, 14:00
                  </td>
                  <td className="border px-3 py-2 text-center bg-indigo-50/50 dark:bg-indigo-950/10">17:55, 18:15</td>
                </tr>
                <tr>
                  <td className="border px-3 py-2 font-medium sticky left-0 bg-background z-10">
                    Engenharia Florestal
                  </td>
                  <td className="border px-3 py-2 text-center bg-amber-50/50 dark:bg-amber-950/10">
                    6:50, 7:10, 7:25, 7:40, 7:55, 8:20
                  </td>
                  <td className="border px-3 py-2 text-center bg-orange-50/50 dark:bg-orange-950/10">
                    10:30, 11:55, 12:20
                  </td>
                  <td className="border px-3 py-2 text-center bg-blue-50/50 dark:bg-blue-950/10">
                    13:25, 13:45, 14:00, 16:05
                  </td>
                  <td className="border px-3 py-2 text-center bg-indigo-50/50 dark:bg-indigo-950/10">
                    17:55, 18:15, 21:00, 22:00, 22:50
                  </td>
                </tr>
                <tr>
                  <td className="border px-3 py-2 font-medium sticky left-0 bg-background z-10">Garagem</td>
                  <td className="border px-3 py-2 text-center bg-amber-50/50 dark:bg-amber-950/10">-</td>
                  <td className="border px-3 py-2 text-center bg-orange-50/50 dark:bg-orange-950/10">10:35, 12:45</td>
                  <td className="border px-3 py-2 text-center bg-blue-50/50 dark:bg-blue-950/10">14:30, 16:25</td>
                  <td className="border px-3 py-2 text-center bg-indigo-50/50 dark:bg-indigo-950/10">
                    18:40, 21:00, 22:50
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <h4 className="text-sm font-medium mb-2">Informações Importantes:</h4>
              <ul className="text-sm space-y-1 list-disc pl-5">
                <li>Os horários podem sofrer alterações em feriados e períodos especiais</li>
                <li>O circular não opera aos domingos</li>
                <li>Aos sábados, opera em horário reduzido até às 18:00</li>
                <li>Em caso de dúvidas, consulte a administração do campus</li>
              </ul>
            </div>

            <Card className="bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Legenda de Períodos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded bg-amber-100 dark:bg-amber-800/50 mr-2"></div>
                    <span>Manhã (6:00 - 11:00)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded bg-orange-100 dark:bg-orange-800/50 mr-2"></div>
                    <span>Meio Dia (11:00 - 13:00)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded bg-blue-100 dark:bg-blue-800/50 mr-2"></div>
                    <span>Tarde (13:00 - 18:00)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded bg-indigo-100 dark:bg-indigo-800/50 mr-2"></div>
                    <span>Noite (18:00 - 23:00)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function RestaurantContent() {
  const [weeklyMenu, setWeeklyMenu] = useState<WeeklyMenu | null>(null)
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay() || 1) // 1-6 para Segunda-Sábado

  useEffect(() => {
    // Carregar cardápio semanal
    const menu = {
      days: [
        {
          dayIndex: 1, // Segunda
          dayName: "Segunda-feira",
          date: "14/10/2024",
          breakfast: {
            drinks: "CAFÉ C/ LEITE OU CAFÉ, OU SUCO DE FRUTAS",
            protein: "BEBIDA 1 OPÇÃO 300 ML",
            vegetarian: "OPÇÃO VEGANA 50G",
            sides: "MINGAU DE AVEIA",
            fruit: "MELANCIA",
            bakery: "1 UND",
            calories: "556 Kcal",
          },
          lunch: {
            mainDish: "FRANGO À PARMEGIANA",
            secondOption: "ENSOPADO DE CARNE",
            vegetarian: "FAROFA DE SOJA",
            sides: ["FEIJÃO CARIOCA", "ARROZ C/ CENOURA", "CENOURA RALADA COM COUVE", "ALFACE COM TOMATE E CEBOLA"],
            drink: "SUCO DE ACEROLA",
            dessert: "PÉ DE MOLEQUE",
            calories: "1.127,09 Kcal",
          },
          dinner: {
            drinks: "CAFÉ C/ LEITE OU CAFÉ, OU SUCO DE FRUTAS",
            protein: "BIFE BOVINO COZIDO",
            sides: ["ARROZ C/CHEIRO VERDE", "SALADA DE CENOURA COM MAÇÃ E UVA PASSAS", "CALDO DE FEIJÃO"],
            bakery: "1 UND",
            vegetarian:
              "LEGUMES A CHINESA (BRÓCOLIS, CENOURA, ERVILHA EM GRÃO, COUVE FLOR, PIMENTÃO, TOMATE, CEBOLA, MOLHO SHOYU)",
            calories: "873,7 Kcal",
          },
        },
        {
          dayIndex: 2, // Terça
          dayName: "Terça-feira",
          date: "15/10/2024",
          breakfast: {
            drinks: "CAFÉ C/ LEITE OU CAFÉ, OU SUCO DE MANGA",
            protein: "OVOS MEXIDOS",
            vegetarian: "----",
            sides: "BOLO DE CENOURA C/ CALDA DE CHOCOLATE",
            fruit: "BANANA DA PRATA",
            bakery: "1 UND",
            calories: "689 Kcal",
          },
          lunch: {
            mainDish: "CUBOS DE CARNES GRELHADA (BOVINO, TOSCANA E FRANGO)",
            secondOption: "----",
            vegetarian: "EMPADA DE CENOURA C/ COUVE FLOR",
            sides: [
              "FEIJÃO TROPEIRO",
              "ARROZ C/CENOURA",
              "SALADA DE COUVE C/ TOMATE CEREJA",
              "BETERRABA COZIDA COM MAÇÃ",
            ],
            drink: "SUCO DE MANGA",
            dessert: "MELÃO",
            calories: "1119,8 Kcal",
          },
          dinner: {
            drinks: "CAFÉ C/ LEITE OU CAFÉ, OU SUCO DE GOIABA",
            protein: "FRANGO AO MOLHO BRANCO",
            sides: ["ARROZ BRANCO", "GRÃO DE BICO COM TOMATE", "MASSA COM CARNE E LEGUMES"],
            bakery: "1 UND",
            vegetarian: "LASANHA VEGANA/ SOPA DE MASSA COM LEGUME",
            calories: "905,9 Kcal",
          },
        },
        {
          dayIndex: 3, // Quarta
          dayName: "Quarta-feira",
          date: "16/10/2024",
          breakfast: {
            drinks: "CAFÉ C/ LEITE OU CAFÉ, OU SUCO DE ACEROLA",
            protein: "PÃO C/ QUEIJO E PRESUNTO",
            vegetarian: "QUEIJO VEGANO",
            sides: "CUSCUZ DE TAPIOCA",
            fruit: "MELÃO",
            bakery: "1 UND",
            calories: "589 Kcal",
          },
          lunch: {
            mainDish: "COXA E SOBRECOXA ASSADA",
            secondOption: "PICADINHO DE CARNE",
            vegetarian: "ALMÔNDEGAS DE SOJA",
            sides: [
              "FEIJÃO CARIOCA",
              "ARROZ COLORIDO (PASSAS, ERVILHA, CENOURA, CHEIRO VERDE)",
              "PEPINO, COM CENOURA RALADA, TOMATE, CEBOLA E CHEIRO VERDE",
              "MIX DE FOLHOSOS (REPOLHO ROXO, REPOLHO VERDE E ACELGA) C/MAÇÃ",
            ],
            drink: "SUCO DE CAJU",
            dessert: "MELANCIA",
            calories: "1.160 Kcal",
          },
          dinner: {
            drinks: "CAFÉ C/ LEITE OU CAFÉ, OU SUCO DE ACEROLA",
            protein: "ISCA DE CARNE COM CEBOLA CARAMELIZADA",
            sides: ["ARROZ COZIDO", "SALADA DE ALFACE C/ TOMATE", "LEGUMES C/ FRANGO"],
            bakery: "1 UND",
            vegetarian: "CUSCUZ VEGANO/SOPA DE LEGUMES",
            calories: "986 Kcal",
          },
        },
        {
          dayIndex: 4, // Quinta
          dayName: "Quinta-feira",
          date: "17/10/2024",
          breakfast: {
            drinks: "CAFÉ C/ LEITE OU CAFÉ, OU JENIPAPO",
            protein: "IOGURTE",
            vegetarian: "IOGURTE VEGANO",
            sides: "INHAME",
            fruit: "MAMÃO",
            bakery: "1 UND",
            calories: "569 Kcal",
          },
          lunch: {
            mainDish: "FILÉ DE FRANGO AO MOLHO",
            secondOption: "STROGONOFF DE CARNE",
            vegetarian: "LEGUMES REFOGADO (BRÓCOLIS, CENOURA E CHUCHU)",
            sides: ["FEIJÃO CARIOCA", "ARROZ C/ COLORAU", "BETERRABA RALADA COM MAÇÃ", "ALFACE C/ MANGA"],
            drink: "SUCO DE UMBU",
            dessert: "GELADO DE CEREJA",
            calories: "1116,8 Kcal",
          },
          dinner: {
            drinks: "CAFÉ C/ LEITE OU CAFÉ, OU SUCO DE CAJU",
            protein: "LOMBO SUÍNO AO MOLHO MADEIRA",
            sides: ["MACARRÃO AO ALHO E ÓLEO", "SALADA DE CENOURA COZIDA, EM CUBOS COM ERVILHA", "CALDO DE FEIJÃO"],
            bakery: "1 UND",
            vegetarian: "LENTILHA REFOGADA",
            calories: "857 Kcal",
          },
        },
        {
          dayIndex: 5, // Sexta
          dayName: "Sexta-feira",
          date: "18/10/2024",
          breakfast: {
            drinks: "CAFÉ C/ LEITE OU CAFÉ, OU SUCO DE TAMARINDO",
            protein: "FRANGO DESFIADO",
            vegetarian: "PASTA DE GRÃO DE BICO (GRÃO DE BICO, AZEITE, ÁGUA, PIMENTA DO REINO, AZEITE E COENTRO)",
            sides: "----",
            fruit: "MAÇÃ",
            bakery: "1 UND",
            calories: "547 Kcal",
          },
          lunch: {
            mainDish: "FEIJOADA",
            secondOption: "FRANGO EM CUBOS AO MOLHO DE CENOURA",
            vegetarian: "FEIJOADA VEGANA",
            sides: ["FEIJÃO PRETO", "ARROZ BRANCO", "PEPINO A VINAGRETE", "COUVE C/ BACON"],
            drink: "SUCO DE FRUTAS",
            dessert: "LARANJA",
            calories: "1.108,75 Kcal",
          },
          dinner: {
            drinks: "CAFÉ C/ LEITE OU CAFÉ, OU SUCO DE MANGA",
            protein: "FRICASSÊ DE FRANGO",
            sides: ["ARROZ A GREGA", "CALADA DE CENOURA COZIDA, EM CUBOS COM MILHO", "CALDO DE FEIJÃO"],
            bakery: "1 UND",
            vegetarian: "FRICASSÊ VEGETARIANO DE LEGUMES/ CALDO DE ABÓBORA",
            calories: "817, 5 Kcal",
          },
        },
        {
          dayIndex: 6, // Sábado
          dayName: "Sábado",
          date: "19/10/2024",
          breakfast: {
            drinks: "CAFÉ C/ LEITE OU CAFÉ, OU SUCO DE UMBU",
            protein: "OVOS C/ ORÉGANO",
            vegetarian: "---",
            sides: "MINGAU DE AMIDO DE MILHO",
            fruit: "MELÃO",
            bakery: "1 UND",
            calories: "532 Kcal",
          },
          lunch: {
            mainDish: "PEITO DE FRANGO EMPANADO AO MOLHO DE MOSTARDA",
            secondOption: "ISCA C/ MILHO",
            vegetarian: "LENTILHA REFOGADA",
            sides: ["FEIJÃO CARIOCA", "ARROZ TEMPERADO", "CENOURA RALADA C/ MILHO E ERVILHA", "ACELGA COM UVA PASSAS"],
            drink: "SUCO DE ABACAXI (FRUTA)",
            dessert: "NEOGBON",
            calories: "1056,97 Kcal",
          },
          dinner: {
            drinks: "XXX",
            protein: "XXX",
            sides: ["XXX", "XXX", "XXX"],
            bakery: "XXX",
            vegetarian: "XXX",
            calories: "XXX",
          },
        },
      ],
    }

    setWeeklyMenu(menu)
  }, [])

  // Obter o cardápio do dia selecionado
  const selectedDayMenu = weeklyMenu?.days.find((day: any) => day.dayIndex === selectedDay)

  return (
    <div className="grid gap-4">
      <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Utensils className="mr-2 h-5 w-5 text-amber-500" />
            Restaurante Universitário
          </CardTitle>
          <CardDescription>
            Horário de funcionamento: <span className="font-medium">11:00 - 14:00 (Almoço)</span> e{" "}
            <span className="font-medium">17:00 - 20:00 (Jantar)</span>
          </CardDescription>
        </CardHeader>
      </Card>

      {weeklyMenu && (
        <Card>
          <CardHeader>
            <CardTitle>Cardápio Semanal</CardTitle>
            <CardDescription>UFRB - Outubro 2024 (3ª Semana)</CardDescription>

            <div className="flex flex-wrap gap-2 mt-4">
              {weeklyMenu.days.map((day: any) => (
                <Button
                  key={day.dayIndex}
                  variant={selectedDay === day.dayIndex ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDay(day.dayIndex)}
                  className={isCurrentDay(day.dayIndex) ? "ring-2 ring-amber-500" : ""}
                >
                  {day.dayName.split("-")[0]}
                  <span className="ml-1 text-xs opacity-70">
                    {day.date.split("/")[0]}/{day.date.split("/")[1]}
                  </span>
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            {selectedDayMenu ? (
              <div className="space-y-6">
                <div className="rounded-lg border bg-amber-50/50 dark:bg-amber-950/10 p-4">
                  <h3 className="text-lg font-medium flex items-center mb-3">
                    <Badge
                      variant="outline"
                      className="mr-2 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100"
                    >
                      Desjejum
                    </Badge>
                    <span>{selectedDayMenu.date}</span>
                  </h3>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <p className="text-sm font-medium">Bebida</p>
                      <p className="text-sm">{selectedDayMenu.breakfast.drinks}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Proteína</p>
                      <p className="text-sm">{selectedDayMenu.breakfast.protein}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Opção Vegana</p>
                      <p className="text-sm">{selectedDayMenu.breakfast.vegetarian}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Acompanhamento</p>
                      <p className="text-sm">{selectedDayMenu.breakfast.sides}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Fruta</p>
                      <p className="text-sm">{selectedDayMenu.breakfast.fruit}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Padaria</p>
                      <p className="text-sm">{selectedDayMenu.breakfast.bakery}</p>
                    </div>
                  </div>

                  <div className="mt-3 text-right">
                    <Badge
                      variant="secondary"
                      className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100"
                    >
                      {selectedDayMenu.breakfast.calories}
                    </Badge>
                  </div>
                </div>

                <div className="rounded-lg border bg-blue-50/50 dark:bg-blue-950/10 p-4">
                  <h3 className="text-lg font-medium flex items-center mb-3">
                    <Badge
                      variant="outline"
                      className="mr-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                    >
                      Almoço
                    </Badge>
                    <span>{selectedDayMenu.date}</span>
                  </h3>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium">Prato Principal</p>
                      <p className="text-sm">{selectedDayMenu.lunch.mainDish}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Segunda Opção</p>
                      <p className="text-sm">{selectedDayMenu.lunch.secondOption}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Opção Vegetariana</p>
                      <p className="text-sm">{selectedDayMenu.lunch.vegetarian}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Guarnição</p>
                      <ul className="text-sm list-disc pl-5">
                        ...{(selectedDayMenu.lunch.sides && Array.isArray(selectedDayMenu.lunch.sides))  &&
                          selectedDayMenu.lunch.sides.map((side: string, index: number) => (
                            <li key={index}>{side}</li>
                          ))
                        }
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Bebida</p>
                      <p className="text-sm">{selectedDayMenu.lunch.drink}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Sobremesa</p>
                      <p className="text-sm">{selectedDayMenu.lunch.dessert}</p>
                    </div>
                  </div>

                  <div className="mt-3 text-right">
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                    >
                      {selectedDayMenu.lunch.calories}
                    </Badge>
                  </div>
                </div>

                <div className="rounded-lg border bg-indigo-50/50 dark:bg-indigo-950/10 p-4">
                  <h3 className="text-lg font-medium flex items-center mb-3">
                    <Badge
                      variant="outline"
                      className="mr-2 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100"
                    >
                      Jantar
                    </Badge>
                    <span>{selectedDayMenu.date}</span>
                  </h3>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium">Bebida</p>
                      <p className="text-sm">{selectedDayMenu.dinner.drinks}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Proteína</p>
                      <p className="text-sm">{selectedDayMenu.dinner.protein}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Acompanhamento</p>
                      <ul className="text-sm list-disc pl-5">
                      ...{(selectedDayMenu.dinner.sides && Array.isArray(selectedDayMenu.dinner.sides))  &&
                          selectedDayMenu.dinner.sides.map((side: string, index: number) => (
                            <li key={index}>{side}</li>
                          ))
                        }
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Padaria</p>
                      <p className="text-sm">{selectedDayMenu.dinner.bakery}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-sm font-medium">Opção Vegetariana</p>
                      <p className="text-sm">{selectedDayMenu.dinner.vegetarian}</p>
                    </div>
                  </div>

                  <div className="mt-3 text-right">
                    <Badge
                      variant="secondary"
                      className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100"
                    >
                      {selectedDayMenu.dinner.calories}
                    </Badge>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>OBS: cardápio sujeito a alteração</p>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <p>Selecione um dia para ver o cardápio</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
