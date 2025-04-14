"use client"

import { createContext, useState, type ReactNode, useEffect } from "react"
import React from "react"
import { TutorialDialog } from "./tutorial-dialog" 
import User from "@/types/user"
import { createUserSchema } from "@/types/user"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (usernameOrEmail: string, password: string) => Promise<boolean>
  register: (username: string, email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  updateUser: (user: Partial<User>) => void
  generateRecoveryCode: (email: string) => Promise<boolean>
  resetPassword: (email: string, code: string, newPassword: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | null>(null)

// Usuários de demonstração
const DEMO_USERS = [
  { nickname: "aluno", email: "aluno@salvaluno.edu", password: "senha123", fullname: "Estudante" },
  { nickname: "admin", email: "admin@salvaluno.edu", password: "admin123", fullname: "Administrador" },
]

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showTutorial, setShowTutorial] = useState(false)

  useEffect(() => {
    // Verificar se o usuário já está autenticado
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user")
      const storedAuth = localStorage.getItem("isAuthenticated")

      if (storedUser && storedAuth === "true") {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)

        // Verificar se é o primeiro login
        if (parsedUser.isFirstLogin) {
          setShowTutorial(true)
          // Atualizar o usuário para não mostrar o tutorial novamente
          const updatedUser = { ...parsedUser, isFirstLogin: false }
          localStorage.setItem("user", JSON.stringify(updatedUser))
        }
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (usernameOrEmail: string, password: string): Promise<boolean> => {
    // Simular um atraso de rede
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Verificar usuários salvos no localStorage
    const savedUsers = localStorage.getItem("registeredUsers")
    const allUsers = savedUsers ? [...DEMO_USERS, ...JSON.parse(savedUsers)] : DEMO_USERS

    const foundUser = allUsers.find(
      (u) =>
        (u.username.toLowerCase() === usernameOrEmail.toLowerCase() ||
          u.email?.toLowerCase() === usernameOrEmail.toLowerCase()) &&
        u.password === password,
    )

    if (foundUser) {
      // Verificar se o usuário já fez login antes
      const storedUsers = localStorage.getItem("loggedUsers") || "[]"
      const loggedUsers = JSON.parse(storedUsers) as string[]
      const isFirstLogin = !loggedUsers.includes(foundUser.username)

      // Adicionar à lista de usuários que já fizeram login
      if (isFirstLogin) {
        loggedUsers.push(foundUser.username)
        localStorage.setItem("loggedUsers", JSON.stringify(loggedUsers))
      }

      const data = createUserSchema.parse(foundUser)
      const userObj = new User({ ...data, image: data.image ?? "" })

      setUser(userObj)
      localStorage.setItem("user", JSON.stringify(userObj))
      localStorage.setItem("isAuthenticated", "true")

      if (isFirstLogin) {
        setShowTutorial(true)
      }

      return true
    }

    return false
  }

  const register = async (nickname: string, email: string, password: string, fullname: string): Promise<boolean> => {
    // Simular um atraso de rede
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Verificar se o usuário já existe
    const savedUsers = localStorage.getItem("registeredUsers")
    const registeredUsers = savedUsers ? JSON.parse(savedUsers) : []

    const allUsers = [...DEMO_USERS, ...registeredUsers]

    const userExists = allUsers.some(
      (u) => u.username.toLowerCase() === nickname.toLowerCase() || u.email?.toLowerCase() === email.toLowerCase(),
    )

    if (userExists) {
      return false
    }

    // Registrar novo usuário
    const newUser = { nickname, email, password, fullname }
    const updatedUsers = [...registeredUsers, newUser]
    localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers))

    setShowTutorial(true)

    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("isAuthenticated")
  }

  const updateUser = (updatedUser: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return null

      const newUser = new User({ ...prevUser.getProps(), ...updatedUser })
      localStorage.setItem("user", JSON.stringify(newUser))
      return newUser
    })
  }

  // Gerar código de recuperação para o email fornecido
  const generateRecoveryCode = async (email: string): Promise<boolean> => {
    // Simular um atraso de rede
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Verificar se o email existe
    const savedUsers = localStorage.getItem("registeredUsers")
    const allUsers = savedUsers ? [...DEMO_USERS, ...JSON.parse(savedUsers)] : DEMO_USERS

    const userWithEmail = allUsers.find((u) => u.email?.toLowerCase() === email.toLowerCase())

    if (!userWithEmail) {
      return false
    }

    // Gerar código de recuperação (6 dígitos)
    const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString()

    // Armazenar código de recuperação (com expiração de 1 hora)
    const recoveryCodes = JSON.parse(localStorage.getItem("recoveryCodes") || "{}")
    recoveryCodes[email.toLowerCase()] = {
      code: recoveryCode,
      expires: Date.now() + 3600000, // 1 hora
    }
    localStorage.setItem("recoveryCodes", JSON.stringify(recoveryCodes))

    // Simular envio de email (apenas para demonstração)
    console.log(`Email enviado para ${email} com código de recuperação: ${recoveryCode}`)

    // Em um ambiente real, aqui seria chamada uma API para enviar o email

    return true
  }

  // Resetar senha usando código de recuperação
  const resetPassword = async (email: string, code: string, newPassword: string): Promise<boolean> => {
    // Simular um atraso de rede
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Verificar código de recuperação
    const recoveryCodes = JSON.parse(localStorage.getItem("recoveryCodes") || "{}")
    const recoveryData = recoveryCodes[email.toLowerCase()]

    if (!recoveryData || recoveryData.code !== code || Date.now() > recoveryData.expires) {
      return false
    }

    // Atualizar senha do usuário
    const savedUsers = localStorage.getItem("registeredUsers")
    let allUsers = savedUsers ? JSON.parse(savedUsers) : []

    // Verificar se é um usuário demo ou registrado
    const isDemoUser = DEMO_USERS.some((u) => u.email?.toLowerCase() === email.toLowerCase())

    if (isDemoUser) {
      // Para usuários demo, criar uma cópia no localStorage
      const demoUser = DEMO_USERS.find((u) => u.email?.toLowerCase() === email.toLowerCase())
      if (demoUser) {
        const updatedDemoUser = { ...demoUser, password: newPassword }
        allUsers.push(updatedDemoUser)
      }
    } else {
      // Para usuários normais, atualizar no localStorage
      allUsers = allUsers.map((u: { email: string }) => {
        if (u.email?.toLowerCase() === email.toLowerCase()) {
          return { ...u, password: newPassword }
        }
        return u
      })
    }

    localStorage.setItem("registeredUsers", JSON.stringify(allUsers))

    // Remover código de recuperação usado
    delete recoveryCodes[email.toLowerCase()]
    localStorage.setItem("recoveryCodes", JSON.stringify(recoveryCodes))

    return true
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        generateRecoveryCode,
        resetPassword,
      }}
    >
      {children}
      <TutorialDialog open={showTutorial} onOpenChange={setShowTutorial} />
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
