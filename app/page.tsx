
"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, MapPin, Menu, Settings, User, X } from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useIsMobile } from "@/hooks/use-mobile"
import { UserProfile } from "@/components/user-profile"

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isMobile = useIsMobile()

  // Close sidebar by default on mobile, open by default on desktop
  useEffect(() => {
    setSidebarOpen(!isMobile)
  }, [isMobile])

  return (
    <div className="flex min-h-screen bg-background relative">
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && isMobile && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r bg-background transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-6">
          <h2 className="text-lg font-semibold tracking-tight">UniAgenda</h2>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* User Profile Section */}
        <UserProfile className="border-b py-4" />

        <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Calendar className="h-5 w-5 text-blue-400" />
            Aulas
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Clock className="h-5 w-5 text-blue-400" />
            Horários de Ônibus
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <MapPin className="h-5 w-5 text-blue-400" />
            Restaurantes
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Settings className="h-5 w-5 text-blue-400" />
            Configurações
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <User className="h-5 w-5 text-blue-400" />
            Perfil
          </Button>
        </nav>
      </div>

      {/* Main content */}
      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-300",
          sidebarOpen && !isMobile ? "md:ml-[280px]" : "",
        )}
      >
        <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background px-4 sm:px-6">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Alternar menu lateral</span>
          </Button>
          <div className="ml-auto flex items-center space-x-2 sm:space-x-4">
            <Button variant="outline" className="text-blue-400 text-sm sm:text-base">
              Hoje
            </Button>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">
          <div className="flex flex-col space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Painel</h1>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="classes">Aulas</TabsTrigger>
                <TabsTrigger value="buses">Ônibus</TabsTrigger>
                <TabsTrigger value="restaurants">Restaurantes</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-4 pt-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <ScheduleCard
                    title="Próxima Aula"
                    description="Ciência da Computação 101"
                    time="10:00 - 11:30"
                    location="Prédio A, Sala 203"
                    type="class"
                  />
                  <ScheduleCard
                    title="Próximo Ônibus"
                    description="Circular do Campus"
                    time="11:45"
                    location="Ponto Principal do Campus"
                    type="bus"
                  />
                  <ScheduleCard
                    title="Horário de Almoço"
                    description="Restaurante Universitário"
                    time="11:00 - 14:00"
                    location="Centro Estudantil, 1º Andar"
                    type="restaurant"
                  />
                </div>
                <WeeklyCalendar />
              </TabsContent>
              <TabsContent value="classes" className="space-y-4 pt-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <ScheduleCard
                    title="Ciência da Computação 101"
                    description="Introdução à Programação"
                    time="10:00 - 11:30"
                    location="Prédio A, Sala 203"
                    type="class"
                  />
                  <ScheduleCard
                    title="Matemática 202"
                    description="Álgebra Linear"
                    time="13:00 - 14:30"
                    location="Prédio de Ciências, Sala 105"
                    type="class"
                  />
                  <ScheduleCard
                    title="Física 101"
                    description="Mecânica"
                    time="15:00 - 16:30"
                    location="Laboratório de Física, Sala 302"
                    type="class"
                  />
                </div>
              </TabsContent>
              <TabsContent value="buses" className="space-y-4 pt-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <ScheduleCard
                    title="Circular do Campus"
                    description="Rota Principal"
                    time="A cada 15 minutos"
                    location="Ponto Principal do Campus"
                    type="bus"
                  />
                  <ScheduleCard
                    title="Expresso Centro"
                    description="Direto para o Centro da Cidade"
                    time="De hora em hora a partir das 8:00"
                    location="Entrada Norte"
                    type="bus"
                  />
                  <ScheduleCard
                    title="Circular de Fim de Semana"
                    description="Rota do Shopping"
                    time="A cada 30 minutos"
                    location="Moradia Estudantil"
                    type="bus"
                  />
                </div>
              </TabsContent>
              <TabsContent value="restaurants" className="space-y-4 pt-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <ScheduleCard
                    title="Restaurante Universitário"
                    description="Várias Opções"
                    time="7:00 - 20:00"
                    location="Centro Estudantil, 1º Andar"
                    type="restaurant"
                  />
                  <ScheduleCard
                    title="Café da Biblioteca"
                    description="Café e Lanches"
                    time="8:00 - 22:00"
                    location="Biblioteca Principal, Térreo"
                    type="restaurant"
                  />
                  <ScheduleCard
                    title="Lanchonete do Prédio de Ciências"
                    description="Sanduíches e Saladas"
                    time="11:00 - 15:00"
                    location="Prédio de Ciências, Sala 001"
                    type="restaurant"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}

interface ScheduleCardProps {
  title: string
  description: string
  time: string
  location: string
  type: "class" | "bus" | "restaurant"
}

function ScheduleCard({ title, description, time, location, type }: ScheduleCardProps) {
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        {getIcon()}
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
        <div className="mt-2 space-y-1">
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

function WeeklyCalendar() {
  const isMobile = useIsMobile()
  const days = ["Seg", "Ter", "Qua", "Qui", "Sex"]
  const fullDays = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"]
  const hours = Array.from({ length: 12 }, (_, i) => i + 8) // 8 AM to 7 PM

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Agenda Semanal</CardTitle>
        <CardDescription>Sua programação para esta semana</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="grid min-w-[500px]" style={{ gridTemplateColumns: "60px repeat(5, 1fr)" }}>
            <div className="sticky left-0 bg-background"></div>
            {(isMobile ? days : fullDays).map((day) => (
              <div key={day} className="px-2 py-1 text-center font-medium">
                {day}
              </div>
            ))}

            {hours.map((hour) => (
              <>
                <div key={hour} className="sticky left-0 bg-background border-t px-2 py-3 text-sm">
                  {hour}
                  {isMobile ? "h" : ":00"}
                </div>
                {fullDays.map((day) => (
                  <div key={`${day}-${hour}`} className="border-t px-1 py-1 min-h-[60px]">
                    {/* Example events - in a real app these would be dynamic */}
                    {day === "Segunda" && hour === 10 && (
                      <div className="rounded bg-blue-900/50 p-1 text-xs">
                        <div className="font-medium">CC 101</div>
                        <div className="hidden sm:block">10:00 - 11:30</div>
                      </div>
                    )}
                    {day === "Quarta" && hour === 10 && (
                      <div className="rounded bg-blue-900/50 p-1 text-xs">
                        <div className="font-medium">CC 101</div>
                        <div className="hidden sm:block">10:00 - 11:30</div>
                      </div>
                    )}
                    {day === "Terça" && hour === 13 && (
                      <div className="rounded bg-blue-900/50 p-1 text-xs">
                        <div className="font-medium">Mat 202</div>
                        <div className="hidden sm:block">13:00 - 14:30</div>
                      </div>
                    )}
                    {day === "Quinta" && hour === 13 && (
                      <div className="rounded bg-blue-900/50 p-1 text-xs">
                        <div className="font-medium">Mat 202</div>
                        <div className="hidden sm:block">13:00 - 14:30</div>
                      </div>
                    )}
                    {day === "Sexta" && hour === 11 && (
                      <div className="rounded bg-green-900/50 p-1 text-xs">
                        <div className="font-medium">Tour</div>
                        <div className="hidden sm:block">11:00 - 12:00</div>
                      </div>
                    )}
                  </div>
                ))}
              </>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

