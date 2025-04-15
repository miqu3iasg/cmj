import { User } from "@/lib/generated/prisma";

export interface CreateUserRequest {
  fullname: string;
  nickname: string;
  email: string;
  password: string;
}

export interface CreateUserResponse {
  data: User
}

export async function createUser(dto: CreateUserRequest) {
  const res = await fetch('http://localhost:3000/api/user', {
    method: 'POST',
    body: JSON.stringify(dto),
  });

  const json: CreateUserResponse = await res.json();

  return {
    success: res.ok,
    data: json.data,
  };
}