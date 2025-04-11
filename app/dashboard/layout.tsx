"use client"

import type React from "react"

import { useState, useEffect } from "react"
//import { useRouter } from "next/navigation"
import Link from "next/link"
import { Calendar, Clock, MapPin, Menu, Settings, User, X, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { UserProfile } from "@/components/user-profile"
import { useMobile } from "@/hooks/use-mobile"
//import { useAuth } from "@/components/auth-context"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isMobile = useMobile()
  //const { user, isLoading, isAuthenticated, logout } = useAuth()
  //const router = useRouter()

  // Redirect if not authenticated
  /*useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, router])*/

  // Close sidebar by default on mobile, open by default on desktop
  useEffect(() => {
    setSidebarOpen(!isMobile)
  }, [isMobile])

  /*
  const handleLogout = () => {
    LogOut()
    router.push("/login")
  }*/

 /* // Show loading or nothing while checking authentication
  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-current border-t-transparent text-blue-400" />
      </div>
    )
  }*/

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
          <Button variant="ghost" className="w-full justify-start gap-2" asChild>
            <Link href="/dashboard">
              <Calendar className="h-5 w-5 text-blue-400" />
              Painel
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2" asChild>
            <Link href="/dashboard/horarios">
              <Clock className="h-5 w-5 text-blue-400" />
              Horários
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2" asChild>
            <Link href="/dashboard/mapa">
              <MapPin className="h-5 w-5 text-blue-400" />
              Mapa do Campus
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2" asChild>
            <Link href="/dashboard/perfil">
              <User className="h-5 w-5 text-blue-400" />
              Perfil
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Settings className="h-5 w-5 text-blue-400" />
            Configurações
          </Button>
        </nav>

        <div className="border-t p-4">
          <Button variant="outline" className="w-full justify-start gap-2" /*onClick={handleLogout}*/>
            <LogOut className="h-5 w-5 text-red-400" />
            Sair
          </Button>
        </div>
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
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
