// Tipos para as aulas e horários
export interface ClassSchedule {
  id: string
  name: string
  professor: string
  location: string
  locationId?: string // ID da localização no mapa
  day: number // 0-6 (domingo-sábado)
  startHour: number // 7-22
  endHour: number // 7-22
  color: string
}

// Dias da semana
export const DAYS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]
export const SHORT_DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

// Horários disponíveis (7h às 22h)
export const HOURS = Array.from({ length: 16 }, (_, i) => i + 7)

// Cores disponíveis para as aulas
export const CLASS_COLORS = [
  "bg-blue-900/50",
  "bg-green-900/50",
  "bg-purple-900/50",
  "bg-amber-900/50",
  "bg-rose-900/50",
  "bg-cyan-900/50",
  "bg-emerald-900/50",
  "bg-indigo-900/50",
]

// Verificar se há aula em determinado dia e hora
export const getClassForTimeSlot = (classes: ClassSchedule[], day: number, hour: number) => {
  return classes.find((c) => c.day === day && hour >= c.startHour && hour < c.endHour)
}

// Encontrar a próxima aula
export const getNextClass = (classes: ClassSchedule[]) => {
  if (classes.length === 0) return null

  const now = new Date()
  const currentDay = now.getDay() // 0-6 (domingo-sábado)
  const currentHour = now.getHours()

  // Primeiro, procurar aulas no dia atual após a hora atual
  let nextClass = classes.find((c) => c.day === currentDay && c.startHour > currentHour)

  // Se não encontrar, procurar nos próximos dias
  if (!nextClass) {
    for (let dayOffset = 1; dayOffset <= 7; dayOffset++) {
      const nextDay = (currentDay + dayOffset) % 7
      const classesOnNextDay = classes.filter((c) => c.day === nextDay)

      if (classesOnNextDay.length > 0) {
        // Ordenar por horário de início
        nextClass = classesOnNextDay.sort((a, b) => a.startHour - b.startHour)[0]
        break
      }
    }
  }

  return nextClass
}

// Formatar hora para exibição
export const formatHour = (hour: number): string => {
  return `${hour}:00`
}

// Verificar se é a hora atual
export const isCurrentHour = (hour: number): boolean => {
  const now = new Date()
  return now.getHours() === hour
}

// Verificar se é o dia atual
export const isCurrentDay = (day: number): boolean => {
  const now = new Date()
  return now.getDay() === day
}

// Obter todas as aulas para um dia específico
export const getClassesForDay = (classes: ClassSchedule[], day: number): ClassSchedule[] => {
  return classes.filter((c) => c.day === day)
}

// Obter todas as aulas para uma localização específica
export const getClassesForLocation = (classes: ClassSchedule[], locationId: string): ClassSchedule[] => {
  return classes.filter((c) => c.locationId === locationId)
}
