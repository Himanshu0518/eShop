import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Upload } from "lucide-react";
import type { Product } from "@/types/product.types";
import { Spinner } from "@/components/ui/spinner";

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  onSubmit: (formData: FormData) => Promise<void>;
  isLoading?: boolean;
}

const CATEGORY_OPTIONS = ["Men", "Women", "Kids", "Accessories"];
const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];

export default function ProductFormDialog({
  open,
  onOpenChange,
  product,
  onSubmit,
  isLoading = false,
}: ProductFormDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discount: "",
    categories: [] as string[],
    sizes: [] as string[],
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

   const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      discount: "",
      categories: [],
      sizes: [],
    });
    setImageFile(null);
    setImagePreview("");
  };
  
  useEffect(() => {
    if (product) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: product.name,
        description: product.description || "",
        price: product.price.toString(),
        discount: product.discount.toString(),
        categories: product.category,
        sizes: product.sizes,
      });
      setImagePreview(product.img || "");
    } else {
      resetForm();
    }
  }, [product]);

 

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleCategory = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const toggleSize = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("discount", formData.discount);
    data.append("category", formData.categories.join(','));
    data.append("sizes", formData.sizes.join(','));

    if (imageFile) {
      data.append("img", imageFile);
    }

    await onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogDescription>
            {product
              ? "Update the product information below"
              : "Fill in the details to create a new product"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Product Image</Label>
            <div className="flex items-center gap-4">
              <div className="relative w-32 h-32 border-2 border-dashed border-border rounded-lg overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Upload a product image (JPG, PNG)
                </p>
              </div>
            </div>
          </div>

          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Product Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter product name"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter product description"
              rows={4}
            />
          </div>

          {/* Price and Discount */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">
                Price ($) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount">Discount (%)</Label>
              <Input
                id="discount"
                type="number"
                min="0"
                max="100"
                value={formData.discount}
                onChange={(e) =>
                  setFormData({ ...formData, discount: e.target.value })
                }
                placeholder="0"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <Label>
              Categories <span className="text-red-500">*</span>
            </Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map((category) => (
                <Badge
                  key={category}
                  variant={
                    formData.categories.includes(category)
                      ? "default"
                      : "outline"
                  }
                  className="cursor-pointer"
                  onClick={() => toggleCategory(category)}
                >
                  {category}
                  {formData.categories.includes(category) && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Select at least one category
            </p>
          </div>

          {/* Sizes */}
          <div className="space-y-2">
            <Label>
              Available Sizes <span className="text-red-500">*</span>
            </Label>
            <div className="flex flex-wrap gap-2">
              {SIZE_OPTIONS.map((size) => (
                <Badge
                  key={size}
                  variant={formData.sizes.includes(size) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleSize(size)}
                >
                  {size}
                  {formData.sizes.includes(size) && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Select at least one size
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isLoading ||
                !formData.name ||
                !formData.price ||
                formData.categories.length === 0 ||
                formData.sizes.length === 0
              }
            >
              {isLoading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4 animate-spin" />
                  {product ? "Updating..." : "Creating..."}
                </>
              ) : product ? (
                "Update Product"
              ) : (
                "Create Product"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
