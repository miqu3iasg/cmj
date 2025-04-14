"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, User, Users, FileUp } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"

interface TutorialDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const tutorialSteps = [
  {
    title: "Bem-vindo ao Salvaluno!",
    description: "Vamos conhecer as principais funcionalidades do aplicativo para ajudar na sua vida acadêmica.",
    icon: (
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/salvar-nos%20%282%29-Photoroom-zBpz6UiRm0PWB67OXFrbNzNqeI9Xnz.png"
        alt="Salvaluno Logo"
        className="w-16 h-16"
      />
    ),
  },
  {
    title: "Perfil",
    description:
      "Complete seu perfil com suas informações acadêmicas. Você pode escolher se deseja tornar seu perfil público para outros estudantes.",
    icon: <User className="w-16 h-16 text-blue-500" />,
  },
  {
    title: "Horários",
    description:
      "Adicione suas aulas manualmente ou importe um arquivo de horários. O sistema organizará tudo para você.",
    icon: <Clock className="w-16 h-16 text-blue-500" />,
  },
  {
    title: "Mapa do Campus",
    description:
      "Navegue pelo mapa interativo do campus para encontrar salas de aula, restaurantes e outros pontos importantes.",
    icon: <MapPin className="w-16 h-16 text-blue-500" />,
  },
  {
    title: "Importar Horários",
    description:
      "Você pode importar seu horário de aulas a partir de um arquivo. O sistema identificará automaticamente as informações relevantes.",
    icon: <FileUp className="w-16 h-16 text-blue-500" />,
  },
  {
    title: "Comunidade",
    description:
      "Conecte-se com outros estudantes que tornaram seus perfis públicos. Encontre colegas de curso e compartilhe informações.",
    icon: <Users className="w-16 h-16 text-blue-500" />,
  },
  {
    title: "Pronto para começar!",
    description:
      "Agora você já conhece as principais funcionalidades do Salvaluno. Vamos começar a organizar sua vida acadêmica!",
    icon: <Calendar className="w-16 h-16 text-blue-500" />,
  },
]

export function TutorialDialog({ open, onOpenChange }: TutorialDialogProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const totalSteps = tutorialSteps.length
  const progress = ((currentStep + 1) / totalSteps) * 100

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onOpenChange(false)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl">{tutorialSteps[currentStep].title}</DialogTitle>
            <DialogDescription className="text-base pt-2">{tutorialSteps[currentStep].description}</DialogDescription>
          </DialogHeader>

          <div className="flex justify-center py-8">{tutorialSteps[currentStep].icon}</div>
        </div>

        <div className="bg-muted/20 p-6 border-t">
          <Progress value={progress} className="mb-4" />

          <div className="flex justify-between items-center">
            <div>
              {currentStep > 0 ? (
                <Button variant="outline" onClick={handlePrevious}>
                  <ChevronLeft className="mr-1 h-4 w-4" /> Anterior
                </Button>
              ) : (
                <Button variant="outline" onClick={handleSkip}>
                  Pular
                </Button>
              )}
            </div>

            <div className="text-sm text-muted-foreground">
              {currentStep + 1} de {totalSteps}
            </div>

            <Button onClick={handleNext}>
              {currentStep < totalSteps - 1 ? (
                <>
                  Próximo <ChevronRight className="ml-1 h-4 w-4" />
                </>
              ) : (
                "Começar"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
