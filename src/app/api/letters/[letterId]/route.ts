import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

//get specific letter
export async function GET(req: NextRequest, { params }: any) {
  try {
    console.log(params);

    const { letterId } = params;
    const letter = await prisma.letter.findUnique({
      where: {
        id: letterId,
      },
    });
    if (!letter)
      return NextResponse.json({ error: "Letter not found" }, { status: 404 });
    return NextResponse.json(letter, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Error fetching letter", details: error },
      { status: 500 }
    );
  }
}

//edit letter
export async function PUT(req: NextRequest, { params }: any) {
  try {
    const { letterId } = params;
    const body = await req.json();
    const letter = await prisma.letter.findUnique({ where: { id: letterId } });
    if (!letter)
      return NextResponse.json({ error: "Letter not found" }, { status: 404 });
    const now = new Date(); // Current time
    const scheduledAt = new Date(letter.scheduledAt);
    console.log(`now ${now}`);
    console.log(`scheduled at ${scheduledAt}`);
    console.log(
      `diff wihtiut hioru converse ${now.getTime() - scheduledAt.getTime()}`
    );

    // Calculate the difference in milliseconds and convert to hours
    const hoursDiff =
      Math.abs(now.getTime() - scheduledAt.getTime()) / (1000 * 60 * 60);

    console.log(`Hours diff: ${hoursDiff}`); // Check the hours diff

    if (hoursDiff > 48) {
      {
        return NextResponse.json(
          { error: "Cannot edit after 48 hours" },
          { status: 400 }
        );
      }
    }
    const updatedLetter = await prisma.letter.update({
      where: { id: letterId },
      data: body,
    });
    return NextResponse.json(updatedLetter, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Error editing letter", details: error },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: any) {
  try {
    const { letterId } = params;
    const letter = await prisma.letter.update({
      where: { id: letterId },
      data: { status: "CANCELED" },
    });
    return NextResponse.json(letter, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error cancelling the letter", details: error },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: any) {
  try {
    const { letterId } = params;
    const deleteLetter = await prisma.letter.delete({
      where: { id: letterId },
    });
    return NextResponse.json(deleteLetter, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting the letter", details: error },
      { status: 500 }
    );
  }
}
