import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { auth } from "@clerk/nextjs/server";
export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    const getUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    const cart = await prisma.cart.findFirst({
      where: {
        id: getUser?.id,
      },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, price: true, image: true },
            },
          },
        },
      },
    });
    console.log(await prisma.cart.findFirst({ where: { userId } }));
    const formattedItems =
      cart?.items.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.image,
        quantity: item.quantity,
      })) || [];

    return NextResponse.json({ success: true, cart: formattedItems });
  } catch (error: any) {
    console.error("[CART_GET]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
