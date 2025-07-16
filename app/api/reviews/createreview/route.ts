import { NextResponse } from "next/server";
import { createReview } from "@/utils/actions";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { comment, rating, productId } = body;

    if (!comment || !rating || !productId) {
      return NextResponse.json(
        { error: "comment, rating, and productId are required" },
        { status: 400 }
      );
    }

    const review = await createReview({ comment, rating, productId });

    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    console.error("API error creating review:", error.message);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
