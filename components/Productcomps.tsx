"use client";
import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Grid, List, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Package, Plus } from "lucide-react";
export type Product = {
  id: string;
  name: string;
  type: string;
  areaOfUse: string;
  price: number;
  image: string;
  description: string;
  company: string;
  featured: boolean;
  clerkId: string;
};
interface ProductFiltersProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  filterType: string;
  setFilterType: (val: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (val: "grid" | "list") => void;
  uniqueTypes: string[];
}
interface ProductHeaderProps {
  total: number;
  onAdd: () => void;
}

interface ProductGridProps {
  products: Product[];
  viewMode: "grid" | "list";
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onToggleFeatured: (id: string) => void;
}
interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onToggleFeatured: (id: string) => void;
  isLoading?: boolean;
}

interface AddEditProductDrawerProps {
  product: Product | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (product: Product) => void;
  isLoading?: boolean;
  mode: "add" | "edit";
}

interface ProductErrorProps {
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
}

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Pencil,
  Trash2,
  Star,
  StarOff,
  Tag,
  Building,
  AlertCircle,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Avant-garde Lamp",
    type: "lamp",
    areaOfUse: "lighting",
    price: 299.99,
    image:
      "https://images.pexels.com/photos/943150/pexels-photo-943150.jpeg?auto=compress&cs=tinysrgb&w=400",
    description: "Modern sculptural lamp with adjustable brightness",
    company: "Modenza",
    featured: true,
    clerkId: "user_123",
  },
  {
    id: "2",
    name: "Ergonomic Office Chair",
    type: "chair",
    areaOfUse: "seating",
    price: 549.99,
    image:
      "https://images.pexels.com/photos/586806/pexels-photo-586806.jpeg?auto=compress&cs=tinysrgb&w=400",
    description: "Premium ergonomic chair with lumbar support",
    company: "ComfortCorp",
    featured: false,
    clerkId: "user_456",
  },
  {
    id: "3",
    name: "Minimalist Coffee Table",
    type: "table",
    areaOfUse: "furniture",
    price: 199.99,
    image:
      "https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=400",
    description: "Clean lines and sustainable materials",
    company: "Nordic Design",
    featured: true,
    clerkId: "user_789",
  },
  {
    id: "4",
    name: "Decorative Vase Set",
    type: "decor",
    areaOfUse: "decoration",
    price: 89.99,
    image:
      "https://images.pexels.com/photos/1129019/pexels-photo-1129019.jpeg?auto=compress&cs=tinysrgb&w=400",
    description: "Handcrafted ceramic vase collection",
    company: "Artisan Craft",
    featured: false,
    clerkId: "user_101",
  },
  {
    id: "5",
    name: "Smart Bookshelf",
    type: "storage",
    areaOfUse: "storage",
    price: 399.99,
    image:
      "https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=400",
    description: "Modern bookshelf with integrated LED lighting",
    company: "TechFurniture",
    featured: true,
    clerkId: "user_202",
  },
  {
    id: "6",
    name: "Velvet Accent Chair",
    type: "chair",
    areaOfUse: "seating",
    price: 329.99,
    image:
      "https://images.pexels.com/photos/586806/pexels-photo-586806.jpeg?auto=compress&cs=tinysrgb&w=400",
    description: "Luxurious velvet upholstery with gold accents",
    company: "Luxury Living",
    featured: false,
    clerkId: "user_303",
  },
];

export const ProductError: React.FC<ProductErrorProps> = ({
  error,
  setError,
}) => {
  return (
    <div>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
          <span className="text-red-800">{error}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setError("")}
            className="ml-auto"
          >
            Dismiss
          </Button>
        </div>
      )}
    </div>
  );
};

export const ProductEmptyState: React.FC = () => {
  return (
    <div className="text-center py-12">
      <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No products found
      </h3>
      <p className="text-gray-600">Try adjusting your search or filters</p>
    </div>
  );
};

export const ProductPagination: React.FC<ProductPaginationProps> = ({
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-8">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            onClick={() => setCurrentPage(page)}
            className="w-10 h-10"
          >
            {page}
          </Button>
        ))}

        <Button
          variant="outline"
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export const AddEditProductDrawer: React.FC<AddEditProductDrawerProps> = ({
  product,
  isOpen,
  onOpenChange,
  onSave,
  isLoading = false,
  mode,
}) => {
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (mode === "add") {
      setEditProduct({
        id: "",
        name: "",
        company: "",
        type: "",
        areaOfUse: "",
        price: 0,
        image: "",
        description: "",
        featured: false,
        clerkId: "user_current",
      });
    } else if (product) {
      setEditProduct({ ...product });
    }
  }, [product, mode, isOpen]);

  const handleInputChange = (field: keyof Product, value: any) => {
    if (editProduct) {
      setEditProduct((prev) => (prev ? { ...prev, [field]: value } : null));
    }
  };

  const handleSubmit = () => {
    if (editProduct) {
      if (mode === "add") {
        editProduct.id = Date.now().toString();
      }
      onSave(editProduct);
    }
  };

  const isFormValid =
    editProduct &&
    editProduct.name.trim() !== "" &&
    editProduct.company.trim() !== "" &&
    editProduct.type !== "" &&
    editProduct.areaOfUse !== "" &&
    editProduct.price > 0 &&
    editProduct.image.trim() !== "" &&
    editProduct.description.trim() !== "";

  if (!editProduct) return null;

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[95vh]">
        <DrawerHeader>
          <DrawerTitle>
            {mode === "add" ? "Add New Product" : "Edit Product"}
          </DrawerTitle>
        </DrawerHeader>

        <div className="p-6 overflow-y-auto">
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={editProduct.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={editProduct.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  placeholder="Enter company name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={editProduct.type}
                  onValueChange={(value) => handleInputChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lamp">Lamp</SelectItem>
                    <SelectItem value="chair">Chair</SelectItem>
                    <SelectItem value="table">Table</SelectItem>
                    <SelectItem value="decor">Decor</SelectItem>
                    <SelectItem value="storage">Storage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="areaOfUse">Area of Use</Label>
                <Select
                  value={editProduct.areaOfUse}
                  onValueChange={(value) =>
                    handleInputChange("areaOfUse", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lighting">Lighting</SelectItem>
                    <SelectItem value="seating">Seating</SelectItem>
                    <SelectItem value="furniture">Furniture</SelectItem>
                    <SelectItem value="decoration">Decoration</SelectItem>
                    <SelectItem value="storage">Storage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={editProduct.price}
                  onChange={(e) =>
                    handleInputChange("price", parseFloat(e.target.value) || 0)
                  }
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={editProduct.image}
                  onChange={(e) => handleInputChange("image", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editProduct.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={4}
                placeholder="Enter product description"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading || !isFormValid}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {mode === "add" ? "Adding..." : "Saving..."}
                  </>
                ) : mode === "add" ? (
                  "Add Product"
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
  onToggleFeatured,
  isLoading = false,
}) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-none cursor-pointer bg-white/80 backdrop-blur-sm">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-bold text-lg text-gray-900 capitalize line-clamp-1">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600">{product.company}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Tag className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600 capitalize">
                {product.type}
              </span>
            </div>
            <div className="text-md font-normal text-neutral-800">
              ₹{product.price}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Building className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600 capitalize">
              {product.areaOfUse}
            </span>
          </div>

          <p className="text-sm text-gray-700 line-clamp-2">
            {product.description}
          </p>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex flex-wrap gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(product)}
            disabled={isLoading}
            className="flex items-center space-x-1 cursor-pointer"
          >
            <Pencil className="h-3 w-3" />
            <span>Edit</span>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={isLoading}
                className="flex items-center space-x-1 bg-red-50 hover:text-red-600 cursor-pointer hover:bg-red-100 text-red-700"
              >
                <Trash2 className="h-3 w-3" />
                <span>Delete</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Product</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{product.name}"? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(product.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
};

export const ProductHeader: React.FC<ProductHeaderProps> = ({
  total,
  onAdd,
}) => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Package className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Products Admin</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="text-sm">
              {total} products
            </Badge>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
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

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  viewMode,
  setViewMode,
  uniqueTypes,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {uniqueTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Button>
            <Grid className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  viewMode,
  onEdit,
  onDelete,
  onToggleFeatured,
}) => {
  return (
    <div
      className={`grid gap-6 ${
        viewMode === "grid"
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1"
      }`}
    >
      {products.map((product,index) => (
        <Link key={index} href={`/admin/product/${product.id}`}>
          <ProductCard
            key={product.id}
            product={product}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleFeatured={onToggleFeatured}
          />
        </Link>
      ))}
    </div>
  );
};
