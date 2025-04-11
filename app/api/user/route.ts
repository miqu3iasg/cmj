export async function GET() {
  const users = [
    { id: 0, name: 'Rick' },
    { id: 1, name: 'Miquéias' },
  ]

  return new Response(JSON.stringify(users), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name } = body;

  const newUser = { id: Date.now(), name };

  return new Response(JSON.stringify(newUser), {
    status: 201,
    headers: { 'Content-Type': 'application/json' }
  })
}