import prisma from "@/lib/prisma";
import { createUserSchema } from "@/types/user";

export async function GET() {
  const users = await prisma.user.findMany();

  return new Response(JSON.stringify(users), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsedBody = createUserSchema.safeParse(body);

  if (!parsedBody.success) {
    return new Response(JSON.stringify(parsedBody.error), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const preparedUserData = prepareUserData(parsedBody.data);

  const createdUser = await prisma.user.create({
   data: preparedUserData, 
  });

  return new Response(JSON.stringify(createdUser), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function prepareUserData(data: any) {
  return {
    ...data,
    image: data.image ?? undefined,
    courseId: data.courseId ?? undefined,
  };
}
