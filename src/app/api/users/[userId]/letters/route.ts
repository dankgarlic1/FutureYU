import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
export async function GET(req: NextRequest, { params }: any) {
  const { userId } = params;

  const letters = await prisma.letter.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(letters, { status: 200 });
}
