import prisma from "@/lib/prisma";
import { updateUserSchema } from "@/types/user";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = Number((await params).id);

  const user = await prisma.user.findUnique({ where: { id } });

  return new Response(JSON.stringify(user), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = Number((await params).id);

  const body = await request.json();

  const parsedBody = updateUserSchema.safeParse(body);

  if (!parsedBody.success) return new Response(JSON.stringify(parsedBody.error), {
    status: 400,
    headers: { 'Content-Type': 'application/json' }
  });

  const hasSomeValue = Array(parsedBody.data).some((v) => v !== null);

  if (!hasSomeValue) return new Response(JSON.stringify({ message: 'send some value to edit' }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' }
  });

  const updatedUser = await prisma.user.update({
    where: { id },
    data: parsedBody.data,
  });

  return new Response(JSON.stringify(updatedUser), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = Number((await params).id);

  await prisma.user.delete({ where: { id } });

  return new Response(JSON.stringify({}), {
    status: 203,
    headers: { 'Content-Type': 'application/json' }
  });
}