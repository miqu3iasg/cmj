import { z } from 'zod';

/*
Mudei essa classe de user porque ela não estava de acordo com as
definições do banco de dados e iria dar conflito de tipos. Agora,
o banco e a classe estão de acordo
*/ 

export const AuthStatusEnum = z.enum([
  'AUTHENTICATED',
  'UNAUTHENTICATED',
  'PENDING',
  'BLOCKED',
]);

export type AuthStatus = z.infer<typeof AuthStatusEnum>;

export const createUserSchema = z.object({
  fullname: z.string().min(1, 'Nome completo é obrigatório'),
  nickname: z.string().min(1, 'Apelido é obrigatório'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  courseId: z.number().optional(),
  authStatus: AuthStatusEnum.optional().default('UNAUTHENTICATED'),
});

export const updateUserSchema = z.object({
  fullname: z.string().optional(),
  nickname: z.string().optional(),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres').optional(),
  authStatus: AuthStatusEnum.optional(),
  courseId: z.number().optional(),
});

type Props = {
  fullname: string;
  nickname: string;
  email: string;
  password: string;
  courseId?: number;
  authStatus: AuthStatus;
};

export default class User {
  private id: number | null = null; 
  private createdAt: Date = new Date();

  private props: Props;

  constructor(props: Props) {
    this.props = {
      ...props,
      authStatus: props.authStatus ?? 'UNAUTHENTICATED',
    };
  }

  public getId(): number | null {
    return this.id;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getFullname(): string {
    return this.props.fullname;
  }

  public getNickname(): string {
    return this.props.nickname;
  }

  public getEmail(): string {
    return this.props.email;
  }

  public getPassword(): string {
    return this.props.password;
  }

  public getCourseId(): number | undefined {
    return this.props.courseId;
  }

  public getAuthStatus(): AuthStatus {
    return this.props.authStatus;
  }

  public updateFullname(fullname: string): void {
    this.props.fullname = fullname;
  }

  public updateNickname(nickname: string): void {
    this.props.nickname = nickname;
  }

  public updatePassword(password: string): void {
    this.props.password = password;
  }

  public updateAuthStatus(status: AuthStatus): void {
    this.props.authStatus = status;
  }

  public updateCourseId(courseId?: number): void {
    this.props.courseId = courseId;
  }

  public setId(id: number): void {
    this.id = id;
  }

  public getProps(): Readonly<{
    id: number | null;
    createdAt: Date;
    fullname: string;
    nickname: string;
    email: string;
    password: string;
    courseId?: number;
    authStatus: AuthStatus;
  }> {
    return {
      id: this.id,
      createdAt: this.createdAt,
      ...this.props,
    };
  }
}
