"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { formatCurrency } from "@/utils/format";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import Loader from "@/components/Loading";

function SingleProductPage() {
  const { id } = useParams() as { id: string };
  const [product, setProduct] = React.useState({
    id: "",
    name: "",
    image: "",
    company: "",
    description: "",
    price: 0,
  });
  const [loading, setLoading] = React.useState(true);
  useEffect(() => {
    const fetchProduct = async () => {
      const product = await fetch(`/api/prods/singleprod/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      const data = await product.json();
      if (!data) {
        toast.error("No product found with this id");
        return;
      }
      setProduct(data);
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    };
    fetchProduct();
  }, []);
  const { name, image, company, description, price } = product;
  const dollarsAmount = formatCurrency(price);

  if (loading) {
    return (
      <div className="flex items-center justify-center top-1/2">
        <Loader />
      </div>
    );
  }
  return (
    <div className="flex flex-col bg-background ">
      <section>
        <div className="mt-6 grid gap-y-8 lg:grid-cols-2 lg:gap-x-16">
          <div className="relative h-96 md:h-[500px]">
            <Image
              src={image}
              alt={name}
              fill
              sizes="(max-width:768px) 100vw,(max-width:1200px) 50vw,33vw"
              priority
              className="w-full rounded-md object-contain"
            />
          </div>
          <div>
            <div className="flex gap-x-8 items-center">
              <h1 className="capitalize text-3xl font-bold">{name}</h1>
            </div>
            <h4 className="text-xl mt-2">{company}</h4>
            <p className="mt-3 text-md bg-muted inline-block p-2 rounded-md">
              {dollarsAmount}
            </p>
            <p className="mt-6 leading-8 text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
export default SingleProductPage;
