import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = Number((await params).id);

  const users = [
    { id: 0, name: 'Rick' },
    { id: 1, name: 'Miquéias' },
  ];

  const user = users.find(({ id: userId }) => userId === id)

  return new Response(JSON.stringify(user), {
    status: 201,
    headers: { 'Content-Type': 'application/json' }
  })
}