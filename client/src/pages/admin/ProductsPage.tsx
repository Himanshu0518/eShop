import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "@/services/product.services";
import { toast } from "sonner";
import ProductFormDialog from "@/components/admin/ProductFormDialog";
import type { Product } from "@/types/product.types";
import { Spinner } from "@/components/ui/spinner";
import  Modal  from "@/components/Modal";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { data: productsData, isLoading } = useGetProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const products = productsData?.data || [];

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Calculate stats


const stats = useMemo(() => {
  const productsdB = productsData?.data || [];

  const totalProducts = productsdB.length;
  const MensProducts = productsdB.filter(p => p.category.includes("Men")).length;
  const WomensProducts = productsdB.filter(p => p.category.includes("Women")).length;
  const KidsProducts = productsdB.filter(p => p.category.includes("Kids")).length;
  const AccessoriesProducts = productsdB.filter(p => p.category.includes("Accessories")).length;
  return { totalProducts, MensProducts, WomensProducts, KidsProducts, AccessoriesProducts };
}, [productsData]);
 

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct(productToDelete.id).unwrap();

      toast.success("Product deleted", {
        description: `${productToDelete.name} has been successfully deleted.`,
      });
    } catch (error: any) {
      toast.error("Error", {
        description:
          error?.data?.message || "Failed to delete product. Please try again.",
      });
    } finally {
      setProductToDelete(null);
    }
  };

  const handleFormSubmit = async (formData: FormData) => {
    try {
      if (selectedProduct) {
        // Update existing product
        await updateProduct({
          id: selectedProduct.id,
          data: formData as any,
        }).unwrap();

        toast.success("Product updated", {
          description: "Product has been successfully updated.",
        });
      } else {
        // Create new product
        await createProduct(formData as any).unwrap();

        toast.success("Product created", {
          description: "New product has been successfully created.",
        });
      }

      setDialogOpen(false);
      setSelectedProduct(null);
    } catch (error: any) {
      toast.error("Error", {
        description:
          error?.data?.message ||
          `Failed to ${selectedProduct ? "update" : "create"} product. Please try again.`,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Spinner className="h-8 w-8" />
          <p className="mt-4 text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-light tracking-tight">Products</h2>
          <p className="text-muted-foreground mt-1">
            Manage your product inventory
          </p>
        </div>
        <Button className="sm:w-auto" onClick={handleAddProduct}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="pb-3 ">
            <CardDescription>Total Products</CardDescription>
            <CardTitle className="text-3xl">{stats.totalProducts}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Men's Products</CardDescription>
            <CardTitle className="text-3xl">{stats.MensProducts}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Women's Products</CardDescription>
            <CardTitle className="text-3xl">{stats.WomensProducts}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Kid's Products</CardDescription>
            <CardTitle className="text-3xl">{stats.KidsProducts}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Accessories Products</CardDescription>
            <CardTitle className="text-3xl">{stats.AccessoriesProducts}</CardTitle>
          </CardHeader>
        </Card>

      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Product List</CardTitle>
              <CardDescription>View and manage all products</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredProducts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Discount</TableHead>
               
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={product.img || "/api/placeholder/80/80"}
                          alt={product.name}
                          className="w-10 h-10 rounded object-cover bg-muted"
                        />
                        <div className="font-medium">{product.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {product.category.slice(0, 2).map((cat, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs"
                          >
                            {cat}
                          </Badge>
                        ))}
                        {product.category.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{product.category.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      {product.discount > 0 ? (
                        <Badge variant="outline" className="text-green-600">
                          {product.discount}% off
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">
                          No discount
                        </span>
                      )}
                    </TableCell>
                    
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link to={`/product/${product.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Product
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setProductToDelete(product);
                              setDeleteModalOpen(true);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Product
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery
                ? "No products found matching your search."
                : "No products available."}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Form Dialog */}
      <ProductFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={selectedProduct}
        onSubmit={handleFormSubmit}
        isLoading={isCreating || isUpdating}
      />

      <Modal
        title="Delete product?"
        description={`This action cannot be undone. This will permanently delete "${productToDelete?.name}".`}
        isOpen={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onSubmit={handleDeleteProduct}
        trigger={<div />}
      />
    </div>
  );
}
