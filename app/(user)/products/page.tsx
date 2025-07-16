"use client";
import ProductsContainer from "@/components/products/ProductsContainer";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function Products() {
  const params = useSearchParams();
  const layout = params.get("layout");
  const search = params.get("search");
  return <ProductsContainer layout={layout || "grid"} search={search || ""} />;
}
function ProductsPage() {
  return (
    <Suspense>
      <Products />
    </Suspense>
  );
}
export default ProductsPage;


