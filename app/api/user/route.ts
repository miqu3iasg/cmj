import prisma from '@/lib/prisma';
import User, { createUserSchema } from '@/types/user';

export async function GET(request: Request) {
  const users = await prisma.user.findMany();

  return new Response(JSON.stringify({ response: users }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsedBody = createUserSchema.safeParse(body);

  if (!parsedBody.success) {
    return new Response(JSON.stringify(parsedBody.error), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  };

  const props = new User(parsedBody.data).getProps();

  const createdUser = await prisma.user.create({
    data: {
      ...props,
    }
  });

  return new Response(JSON.stringify({ data: createdUser }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' }
  });
}