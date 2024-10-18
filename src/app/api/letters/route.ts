import { Prisma, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

//create letter
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, content, recipient, scheduledDate, isPublic } = body;
  const authHeader = req.headers.get("authorization");
  console.log(`Auth header ${authHeader}`);
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sessionToken = authHeader.split(" ")[1];

  const session = await prisma.session.findUnique({
    where: {
      sessionToken,
    },
    include: { user: true },
  });

  if (!session || session.expires < new Date()) {
    return NextResponse.json(
      { error: "Session expired or invalid" },
      { status: 401 }
    );
  }
  const userId = session.user?.id;
  if (!userId) {
    return NextResponse.json(
      { error: "User not found in session" },
      { status: 404 }
    );
  }

  try {
    const letter = await prisma.letter.create({
      data: {
        title,
        content,
        recipient,
        scheduledDate: new Date(scheduledDate),
        isPublic,
        userId,
      },
    });
    return NextResponse.json(letter, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating letter", details: error },
      { status: 500 }
    );
  }
}

//fetch letters for feed
export async function GET() {
  try {
    const letters = await prisma.letter.findMany({
      where: { isPublic: true },
      orderBy: { scheduledDate: "asc" },
    });
    return NextResponse.json(letters, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching letter", details: error },
      { status: 500 }
    );
  }
}
