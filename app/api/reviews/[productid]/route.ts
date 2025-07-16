import { NextResponse } from "next/server";
import { fetchReviews } from "@/utils/actions";

export async function GET(
  request: Request,
  { params }: { params: { productid: string } }
) {
  const { productid } = await params;
  console.log(productid);

  if (!productid) {
    return NextResponse.json(
      { error: "Product ID is required" },
      { status: 400 }
    );
  }

  try {
    const reviews = await fetchReviews(productid);
    return NextResponse.json(reviews);
  } catch (error: any) {
    console.error("API error fetching reviews:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
