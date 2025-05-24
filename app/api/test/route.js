const { auth } = require("@/app/auth");
const { NextResponse } = require("next/server");

async function GETHandler(req) {
  const session = await auth();
  console.log("Session:", session);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  return NextResponse.json({
    message: "Hello, authenticated user!",
    user: session.user,
  });
}

export const GET = GETHandler;
