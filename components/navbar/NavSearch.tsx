"use client";
import { Input } from "../ui/input";
import { useSearchParams, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";

function NavSearch() {
  const searchParams = useSearchParams();
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

  useEffect(() => {
    if (!searchParams.get("search")) {
      setSearch("");
    }
  }, [searchParams.get("search")]);
  return (
    <div className="flex items-center justify-center gap-x-2 relative  ">
      <span className="text-muted-foreground text-sm font-medium hidden absolute top-1/2 left-4 transform  -translate-y-1/2 md:block">
        <Search />
      </span>
      <span></span>
      <Input
        type="search"
        placeholder="search product..."
        className="max-w-xs hidden pl-10 dark:bg-muted md:block   dark:bg-muted "
        onChange={(e) => {
          setSearch(e.target.value);
          handleSearch(e.target.value);
        }}
        value={search}
      />
    </div>
  );
}
export default NavSearch;
