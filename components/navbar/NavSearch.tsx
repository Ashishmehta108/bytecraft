"use client";
import { Input } from "../ui/input";
import { useSearchParams, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useState, useEffect } from "react";
import { Cross, Search, X } from "lucide-react";
import { SearchNormal1 } from "iconsax-reactjs";

type SearchProduct = {
  id: string;
  name: string;
  company: string;
  type: string;
  areaOfUse: string;
  description: string;
  featured: boolean;
  image: string;
  price: number;
};
import ProductsContainer from "../products/ProductsContainer";
import Image from "next/image";
function NavSearch() {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const toggleProductsSearchBar = () => setOpen(!open);
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const { replace } = useRouter();
  const [search, setSearch] = useState(
    searchParams.get("search")?.toString() || ""
  );
  const handleSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    replace(`/products?${params.toString()}`);
  }, 300);
  const handleSearchBar = useDebouncedCallback(async (search: string) => {
    const res = await fetch(`/api/prods?search=${search}`);
    const data = await res.json();
    console.log(data);
    setProducts(data);
  }, 800);
  useEffect(() => {
    if (!searchParams.get("search")) {
      setSearch("");
    }
  }, [searchParams.get("search")]);
  return (
    <div className="flex items-center justify-center z-50  gap-x-2 relative  ">
      <span
        className="text-neutral-900 dark:text-neutral-100  text-sm font-medium  absolute top-1/2 cursor-pointer left-4 transform  -translate-y-1/2 "
        onClick={toggleProductsSearchBar}
      >
        <SearchNormal1 />
      </span>
      <Input
        type="search"
        placeholder="search product..."
        className="max-w-xs hidden pl-12  md:block    dark:bg-neutral-900 dark:border-neutral-800 "
        onChange={(e) => {
          setSearch(e.target.value);
          handleSearch(e.target.value);
        }}
        value={search}
      />
      {open && (
        <div className="fixed inset-x-0 top-20 z-50 flex flex-col items-center justify-start w-full min-h-[600px] max-h-[80vh] bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 overflow-hidden md:hidden">
          <button
            className="absolute top-4 right-2 cursor-pointer p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition"
            onClick={toggleProductsSearchBar}
            aria-label="Close Search"
          >
            <X className="text-neutral-900 dark:text-neutral-100" size={24} />
          </button>

          <div className="w-full flex justify-center p-4">
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full max-w-sm pl-4 dark:bg-neutral-900 dark:border-neutral-800"
              onChange={(e) => {
                setSearch(e.target.value);
                handleSearchBar(e.target.value);
              }}
              value={search}
              autoFocus
            />
          </div>

          <div className="flex-1 w-full overflow-y-auto px-4 pb-6">
            {products.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 w-full">
                {products.map((product) => (
                  <a
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="w-full rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 transition-transform cursor-pointer"
                  >
                    
                    <div className="relative w-full aspect-[4/3] dark:bg-neutral-900 bg-white">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="100vw"
                        className="object-contain p-2"
                      />
                    </div>

                    {/* Text content */}
                    <div className="p-3">
                      <h3 className="text-neutral-900 dark:text-neutral-50 font-semibold text-md line-clamp-1">
                        {product.name}
                      </h3>
                      
                      <p className="text-neutral-300 font-normal text-sm mt-2">
                        ₹{product.price.toFixed(2)}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-center text-neutral-400 mt-6">
                No products found.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default NavSearch;
