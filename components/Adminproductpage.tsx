"use client";
import React, { useState, useEffect } from "react";
import {
  AddEditProductDrawer,
  mockProducts,
  ProductEmptyState,
  ProductError,
  ProductFilters,
  ProductGrid,
  ProductPagination,
} from "./Productcomps";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Plus, UserRound } from "lucide-react";
import { Product } from "./Productcomps";
import { AdminPageSkeleton } from "./Adminpageskeleton";
interface ProductHeaderProps {
  total: number;
  onAdd: () => void;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({ total, onAdd }) => {
  return (
    <div className="bg-white dark:bg-neutral-950 shadow-none border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Package className="h-8 w-8 " />
            <h1 className="text-2xl font-bold text-gray-900">
              Bytecraft Admin
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="text-sm">
              {total} products
            </Badge>
            <Button
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-500"
              onClick={onAdd}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/prods");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        console.log(data);
        setProducts(data);
        setFilteredProducts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const uniqueTypes = Array.from(new Set(products.map((p) => p.type)));

  useEffect(() => {
    let filtered = [...products];
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterType !== "all") {
      filtered = filtered.filter((product) => product.type === filterType);
    }
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, searchTerm, filterType]);

  const handleAdd = () => setIsAddDrawerOpen(true);
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsEditDrawerOpen(true);
  };
  const handleSave = async (product: Product, mode: "add" | "edit") => {
    if (mode === "add") {
      setProducts((prev) => [...prev, product]);
      const res = await fetch("/api/prods/addprod", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
    } else {
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? product : p))
      );
      const res = await fetch("/api/prods/editprod", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
    }
  };
  const handleDelete = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    const res = await fetch(`/api/prods/${id}`, {
      method: "DELETE",
    });
  };

  const handleToggleFeatured = (id: string) =>
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p))
    );
  if (isLoading) {
    return <AdminPageSkeleton />;
  }
  return (
    <div className="min-h-screen bg-background">
      <ProductHeader total={filteredProducts.length} onAdd={handleAdd} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ProductFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterType={filterType}
          setFilterType={setFilterType}
          viewMode={viewMode}
          setViewMode={setViewMode}
          uniqueTypes={uniqueTypes}
        />
        <ProductError error={error} setError={setError} />
        <ProductGrid
          products={paginatedProducts}
          viewMode={viewMode}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleFeatured={handleToggleFeatured}
        />
        <ProductPagination
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        {filteredProducts.length === 0 && <ProductEmptyState />}
      </div>
      <AddEditProductDrawer
        mode="add"
        product={null}
        isOpen={isAddDrawerOpen}
        onOpenChange={setIsAddDrawerOpen}
        onSave={(p) => handleSave(p, "add")}
      />
      <AddEditProductDrawer
        mode="edit"
        product={editingProduct}
        isOpen={isEditDrawerOpen}
        onOpenChange={setIsEditDrawerOpen}
        onSave={(p) => handleSave(p, "edit")}
      />
    </div>
  );
};

export default AdminProductsPage;
