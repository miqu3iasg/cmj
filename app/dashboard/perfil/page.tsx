"use client";

import { useState, useEffect } from "react";
import {
  BicepsFlexed,
  Mail,
  Book,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/router";
import type Cuorse from "@/types/Cuorse";

interface UserProfile {
  email: string;
  nickname: string;
  fullname: string;
<<<<<<< HEAD
  image: string;
  course: string;
=======
  image?: string;
  course: Cuorse["id"] | null; 
>>>>>>> 2139b22b2681e28276958437cf2094c5c061fc56
}

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

<<<<<<< HEAD
=======
  const userProps = user?.getProps();
>>>>>>> 2139b22b2681e28276958437cf2094c5c061fc56

  const [profile, setProfile] = useState<UserProfile>({
    email: "",
    nickname: "",
    fullname: "",
<<<<<<< HEAD
    image: "",
    course: "",
=======
    course: userProps?.courseId || null, // Corrected property name
>>>>>>> 2139b22b2681e28276958437cf2094c5c061fc56
  });

  useEffect(() => {
    if (user) {
<<<<<<< HEAD
      localStorage.getItem(`userProfile_${user.getFullname()}`);
    } if (profile) {
      const savedProfile = localStorage.getItem(`userProfile_${profile.fullname}`);
=======
      const savedProfile = localStorage.getItem(`userProfile_${user.getFullname()}`);
>>>>>>> 2139b22b2681e28276958437cf2094c5c061fc56
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    }
  }, [user, profile]);

  // Redirecionar se não estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Mostrar loading enquanto verifica autenticação
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-current border-t-transparent text-blue-400" />
      </div>
    );
  }

  const handleSaveProfile = () => {
    if (user) {
      localStorage.setItem(`userProfile_${user.getFullname()}`, JSON.stringify(profile));

      toast({
        title: "Perfil salvo",
        description:
          "Suas informações de perfil foram atualizadas com sucesso.",
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Meu Perfil
          </h1>
        </div>

        <div className="grid gap-6 md:grid-cols-1">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Gerencie suas informações pessoais e como elas são
                compartilhadas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                <Avatar className="h-20 w-20 border-2 border-blue-400">
                  <AvatarImage src={profile?.image || ""} />
                  <AvatarFallback className="bg-blue-900 text-white text-xl">
                    {getInitials(profile?.fullname || "Estudante")}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-medium">{profile?.fullname}</h3>
                  <p className="text-sm text-muted-foreground">@{profile?.fullname}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex">
                  <div className="flex items-center justify-center bg-muted px-3 rounded-l-md border border-r-0">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="email"
                    placeholder="Ex: seu.email@exemplo.com"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    className="rounded-l-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Username</Label>
                <div className="flex">
                  <div className="flex items-center justify-center bg-muted px-3 rounded-l-md border border-r-0">
                    <BicepsFlexed className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="username"
                    placeholder="Ex: rickzin"
                    value={profile.nickname}
                    onChange={(e) =>
                      setProfile({ ...profile, nickname: e.target.value })
                    }
                    className="rounded-l-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="course">Curso</Label>
                <div className="flex">
                  <div className="flex items-center justify-center bg-muted px-3 rounded-l-md border border-r-0">
                    <Book className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="course"
                    placeholder="Ex: Engenharia de Computação"
                    value={profile.course?.toString() || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, course: e.target.value ? parseInt(e.target.value, 10) : null })
                    }
                    className="rounded-l-none"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} className="">
                  <Save className="h-4 w-4" />
                  Salvar Perfil
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
