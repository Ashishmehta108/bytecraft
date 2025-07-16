import { auth } from "@clerk/nextjs/server";
import prisma from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId)
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      const id = await crypto.randomUUID();
      const user = await prisma.user.create({
        data: {
          id: id,
          clerkId: userId,
        },
      });
      return NextResponse.json(
        {
          message: "new user created",
          user: user,
        },
        { status: 200 }
      );
    }

    return new Response(JSON.stringify({ user }), { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message,
        error: error,
      },
      {
        status: 500,
      }
    );
  }
}
