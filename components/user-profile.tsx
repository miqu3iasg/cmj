"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Camera, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface UserProfileProps {
  className?: string
}

export function UserProfile({ className }: UserProfileProps) {
  const [username, setUsername] = useState("Estudante")
  const [isEditing, setIsEditing] = useState(false)
  const [tempUsername, setTempUsername] = useState(username)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploading(true)
      // Simulate upload delay
      setTimeout(() => {
        const reader = new FileReader()
        reader.onload = (event) => {
          setAvatarUrl(event.target?.result as string)
          setIsUploading(false)
        }
        reader.readAsDataURL(file)
      }, 1000)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const saveUsername = () => {
    setUsername(tempUsername)
    setIsEditing(false)
  }

  const cancelEdit = () => {
    setTempUsername(username)
    setIsEditing(false)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className={cn("flex flex-col items-center p-4", className)}>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

      <Dialog>
        <DialogTrigger asChild>
          <div className="relative cursor-pointer group">
            <Avatar className="h-16 w-16 border-2 border-blue-400">
              <AvatarImage src={avatarUrl || ""} />
              <AvatarFallback className="bg-blue-900 text-white">
                {isUploading ? "..." : getInitials(username)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="h-6 w-6 text-white" />
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Atualizar Foto de Perfil</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24 border-2 border-blue-400">
              <AvatarImage src={avatarUrl || ""} />
              <AvatarFallback className="bg-blue-900 text-white text-xl">
                {isUploading ? "..." : getInitials(username)}
              </AvatarFallback>
            </Avatar>
            <Button onClick={triggerFileInput} className="w-full">
              {isUploading ? "Enviando..." : "Escolher Imagem"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="mt-4 text-center w-full">
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <Input
              value={tempUsername}
              onChange={(e) => setTempUsername(e.target.value)}
              className="text-center"
              autoFocus
            />
            <div className="flex gap-2 justify-center">
              <Button size="icon" variant="outline" onClick={saveUsername}>
                <Check className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" onClick={cancelEdit}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="cursor-pointer" onClick={() => setIsEditing(true)}>
            <div className="font-medium text-lg">{username}</div>
            <div className="text-xs text-muted-foreground">Clique para editar</div>
          </div>
        )}
      </div>
    </div>
  )
}
