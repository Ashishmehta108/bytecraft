import db from "@/utils/db";
import { redirect } from "next/navigation";

export const fetchFeaturedProducts = async () => {
  const products = await db.product.findMany({
    where: {
      featured: true,
    },
  });
  return products;
};

async function fetchAllProducts({ search = "" }: { search: string }) {
  return await db.product.findMany({
    where: {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
      ],
    },
  });
}

export { fetchAllProducts };
export const fetchSingleProduct = async (productId: string) => {
  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
  });
  if (!product) {
    redirect("/products");
  }
  return product;
};

export const createReview = async ({
  productId,
  rating,
  comment,
  userId,
}: {
  productId: string;
  rating: number;
  userId: string;
  comment: string;
}) => {
  try {
    if (!userId) throw new Error("User ID is required");
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    const newReview = await db.review.create({
      data: {
        productId,
        content: comment,
        stars: rating,
        userId: user?.id!,
      },
    });

    return newReview;
  } catch (error: any) {
    console.error("Error creating review:", error.message);
    throw new Error("Failed to create review");
  }
};

export const fetchReviews = async (productId: string) => {
  try {
    const reviews = await db.review.findMany({
      where: {
        productId: productId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return reviews;
  } catch (error: any) {
    console.error("Error fetching reviews:", error.message);
    throw new Error("Failed to fetch reviews");
  }
};
