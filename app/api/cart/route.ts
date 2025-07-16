import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { auth } from "@clerk/nextjs/server";

async function getCurrentUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) return "";
  return userId;
}

export async function POST(req: NextRequest) {
  try {
    const { userId, productId, quantity } = await req.json();
    // const userId=body.userId
    if (userId.trim() === "")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // const { productId, quantity = 1 } = await req.json();
    // console.log(productId, quantity);

    if (!productId) {
      return NextResponse.json(
        { error: "productId is required" },
        { status: 400 }
      );
    }
    let user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      const id = await crypto.randomUUID();
      user = await prisma.user.create({
        data: { id: id, clerkId: userId },
      });
    }

    let cart = await prisma.cart.findFirst({ where: { id: user.id } });
    if (!cart) {
      cart = await prisma.cart.create({
        data: { id: user.id, user: { connect: { id: user.id } } },
      });
    }

    const existingCartItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingCartItem) {
      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: { increment: quantity } },
      });
    } else {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { price: true },
      });
      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }

      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          price: product.price,
        },
      });
    }

    const updatedCartItems = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            image: true,
            areaOfUse: true,
            company: true,
            type: true,
          },
        },
      },
      orderBy: { id: "asc" },
    });

    const formattedCart = updatedCartItems.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      image: item.product.image,
      quantity: item.quantity,
      areaOfUse: item.product.areaOfUse,
      company: item.product.company,
      type: item.product.type,
    }));

    return NextResponse.json({ success: true, cart: formattedCart });
  } catch (error) {
    console.error("[CART_POST]", error);
    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();
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

export async function PUT(req: NextRequest) {
  try {
    const { productId, quantity } = await req.json();
    const userId = await getCurrentUserId();
    const getUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    const productExists = await prisma.cartItem.findFirst({
      where: { productId: productId, cartId: getUser?.id },
    });
    if (productExists) {
      await prisma.cartItem.update({
        where: { id: productExists.id },
        data: {
          quantity: quantity,
        },
      });
    }
    return NextResponse.json({
      success: true,
      message: "Product removed from cart",
    });
  } catch (error) {}
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    const productId = await req.json();
    console.log(productId.productId);
    const getUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    const resp = await prisma.cartItem.delete({
      where: {
        productId: productId.productId,
      },
    });
    console.log(resp);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[CART_DELETE]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
