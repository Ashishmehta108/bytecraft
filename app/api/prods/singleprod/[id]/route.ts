import { NextResponse } from "next/server";
import { fetchSingleProduct } from "@/utils/actions";
export async function POST(req: Request) {
  const body = await req.json();
  const id = body.id;
  if (!id)
    return NextResponse.json(
      {
        message: "no product id found",
      },
      { status: 403 }
    );
  console.log("this is search", id);

  const product = await fetchSingleProduct(id);
  if (!product)
    return NextResponse.json(
      {
        message: "no product found with this id",
      },
      { status: 404 }
    );
  return NextResponse.json(product);
}
