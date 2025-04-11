"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Mail, Phone, Book, Briefcase, Globe, Eye, EyeOff, Save, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/components/ui/use-toast"

interface UserProfile {
  bio: string
  email: string
  phone: string
  course: string
  occupation: string
  website: string
  isPublic: boolean
}

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  const [profile, setProfile] = useState<UserProfile>({
    bio: "",
    email: "",
    phone: "",
    course: "",
    occupation: "",
    website: "",
    isPublic: false,
  })

  // Carregar perfil salvo
  useEffect(() => {
    if (user) {
      const savedProfile = localStorage.getItem(`userProfile_${user.name}`)
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile))
      }
    }
  }, [user])

  // Redirecionar se não estiver autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, router])

  // Mostrar loading enquanto verifica autenticação
  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-current border-t-transparent text-blue-400" />
      </div>
    )
  }

  const handleSaveProfile = () => {
    if (user) {
      localStorage.setItem(`userProfile_${user.name}`, JSON.stringify(profile))

      toast({
        title: "Perfil salvo",
        description: "Suas informações de perfil foram atualizadas com sucesso.",
      })
    }
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
    <div className="container mx-auto py-6 px-4 sm:px-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Meu Perfil</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>Gerencie suas informações pessoais e como elas são compartilhadas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                <Avatar className="h-20 w-20 border-2 border-blue-400">
                  <AvatarImage src={user?.image || ""} />
                  <AvatarFallback className="bg-blue-900 text-white text-xl">
                    {getInitials(user?.name || "Estudante")}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-medium">{user?.name}</h3>
                  <p className="text-sm text-muted-foreground">@{user?.name}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <Textarea
                  id="bio"
                  placeholder="Conte um pouco sobre você..."
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex">
                  <div className="flex items-center justify-center bg-muted px-3 rounded-l-md border border-r-0">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="email"
                    placeholder="seu.email@exemplo.com"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="rounded-l-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <div className="flex">
                  <div className="flex items-center justify-center bg-muted px-3 rounded-l-md border border-r-0">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="phone"
                    placeholder="(00) 00000-0000"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="rounded-l-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações Acadêmicas</CardTitle>
              <CardDescription>Adicione detalhes sobre sua formação e ocupação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="course">Curso</Label>
                <div className="flex">
                  <div className="flex items-center justify-center bg-muted px-3 rounded-l-md border border-r-0">
                    <Book className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="course"
                    placeholder="Ex: Engenharia de Computação"
                    value={profile.course}
                    onChange={(e) => setProfile({ ...profile, course: e.target.value })}
                    className="rounded-l-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupation">Ocupação</Label>
                <div className="flex">
                  <div className="flex items-center justify-center bg-muted px-3 rounded-l-md border border-r-0">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="occupation"
                    placeholder="Ex: Estudante, Estagiário, etc."
                    value={profile.occupation}
                    onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
                    className="rounded-l-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <div className="flex">
                  <div className="flex items-center justify-center bg-muted px-3 rounded-l-md border border-r-0">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="website"
                    placeholder="https://seusite.com"
                    value={profile.website}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    className="rounded-l-none"
                  />
                </div>
              </div>

              <div className="pt-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Visibilidade do Perfil</AlertTitle>
                  <AlertDescription>
                    Escolha se deseja que seu perfil seja visível para outros usuários.
                  </AlertDescription>
                </Alert>

                <div className="flex items-center justify-between mt-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="public-profile">Perfil Público</Label>
                    <p className="text-sm text-muted-foreground">
                      {profile.isPublic ? (
                        <span className="flex items-center">
                          <Eye className="mr-1 h-3 w-3" /> Seu perfil está visível para outros usuários
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <EyeOff className="mr-1 h-3 w-3" /> Seu perfil está privado
                        </span>
                      )}
                    </p>
                  </div>
                  <Switch
                    id="public-profile"
                    checked={profile.isPublic}
                    onCheckedChange={(checked) => setProfile({ ...profile, isPublic: checked })}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveProfile} className="gap-2">
                <Save className="h-4 w-4" />
                Salvar Perfil
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
