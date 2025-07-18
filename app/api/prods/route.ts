import { NextResponse } from "next/server";
import { fetchAllProducts } from "@/utils/actions";
import prisma from "@/utils/db";
export async function GET(req: Request) {
  const url = new URL(req.url);
  console.log(url);
  const search = url.searchParams.get("search") || "";
  const products = await fetchAllProducts({ search: search });

  return NextResponse.json(products);
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const id = body.id;
    const res = await prisma?.product.update({
      where: { id: id },
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        image: body.image,
        areaOfUse: body.areaOfUse,
        type: body.type,
        company: body.company,
        featured: body.featured,
      },
    });
    return NextResponse.json({ message: "Product updated successfully" });
  } catch (error: any) {
    console.error("API error updating product:", error.message);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const id = body.id;

    const res = await prisma?.product.delete({ where: { id: id } });
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error: any) {
    console.error("API error deleting product:", error.message);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const res = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        image: body.image,
        areaOfUse: body.areaOfUse,
        type: body.type,
        company: body.company,
        featured: body.featured,
        id: body.id,
      },
    });
    return NextResponse.json(
      {
        message: "Product added successfully",
        data: res,
      },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    console.error("API error adding product:", error.message);
    return NextResponse.json(
      { error: "Failed to add product" },
      { status: 500 }
    );
  }
}
