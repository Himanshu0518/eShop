import { useState, useEffect, useRef,useMemo } from "react";
import { Search, X, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetRecommendationByqueryQuery,useGetProductsQuery  } from "@/services/product.services";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import Spinner from "./Spinner";

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState(""); // For AI search
  const [isDeepSearch, setIsDeepSearch] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: allProducts } = useGetProductsQuery();
const products = useMemo(() => {
  if (!allProducts?.data) return [];
  if (!searchQuery.trim()) return allProducts.data;

  return allProducts.data.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
}, [searchQuery, allProducts]);


  // Only make API call when user explicitly submits (clicks Search button)
  const { data: recommendations, isLoading } = useGetRecommendationByqueryQuery(
    submittedQuery,
    {
      skip: !isDeepSearch || !submittedQuery.trim(),
    }
  );

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

    
  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
    handleClose();
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchQuery("");
    setSubmittedQuery("");
    setIsDeepSearch(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    if (isDeepSearch) {
      // AI-Powered Search: Trigger API call by setting submittedQuery
      setSubmittedQuery(searchQuery);
    } 
  };



  return (
    <>
      {/* Search Trigger Button */}
      <Button
        variant="ghost"
      
        className="gap-2 text-muted-foreground hover:text-foreground"
        onClick={() => setIsOpen(true)}
      >
        <Search className="md:h-8 md:w-8 h-4 w-4" />
       
      </Button>

      {/* Search Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Products
            </DialogTitle>
          </DialogHeader>

          {/* Search Input */}
          <div className="px-6 pt-4">
            <form onSubmit={handleSearch} className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Search for products, styles, or describe what you're looking for..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 h-12 text-base"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Deep Search Toggle & Search Button */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant={isDeepSearch ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsDeepSearch(!isDeepSearch)}
                    className="gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    AI-Powered Search
                  </Button>
                  {isDeepSearch && (
                    <Badge variant="secondary" className="text-xs">
                      Semantic Search
                    </Badge>
                  )}
                </div>

                {/* Search Button - Always visible */}
              {
                isDeepSearch && (
                    <Button 
                  type="submit" 
                  size="sm"
                  disabled={!searchQuery.trim() || isLoading}
                  className="gap-2"
                >
                  {isLoading ? (
                    <>
                      <Spinner className="h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      Search
                    </>
                  )}
                </Button>
                )
              }
              </div>

              {isDeepSearch && (
                <p className="text-xs text-muted-foreground">
                  AI-powered search understands context and finds products similar to your description. 
                  <span className="font-medium"> Click Search to find similar products.</span>
                </p>
              )}
            </form>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {/* Loading State */}
            {isLoading && isDeepSearch && (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <Spinner className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Analyzing your search with AI...
                </p>
                <p className="text-xs text-muted-foreground">
                  This may take a few moments
                </p>
              </div>
            )}

            {/* Deep Search Results */}
            {isDeepSearch && recommendations && !isLoading && submittedQuery && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="h-4 w-4" />
                  <span>Found {recommendations.data.length} similar products for "{submittedQuery}"</span>
                </div>

                {recommendations.data.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                      <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="font-medium mb-1">No similar products found</p>
                    <p className="text-sm text-muted-foreground">
                      Try a different description or search term
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendations.data.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="flex gap-4 p-3 rounded-lg border hover:border-foreground transition-colors text-left"
                      >
                        <div className="w-20 h-20 shrink-0 bg-muted rounded overflow-hidden">
                          <img
                            src={product.img }
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2 mb-1">
                            {product.name}
                          </h4>
                          <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                            {product.description}
                          </p>
                          <div className="flex items-center gap-2">
                            {product.discount > 0 ? (
                              <>
                                <span className="font-semibold text-sm">
                                  ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                                </span>
                                <span className="text-xs text-muted-foreground line-through">
                                  ${product.price.toFixed(2)}
                                </span>
                              </>
                            ) : (
                              <span className="font-semibold text-sm">
                                ${product.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {!isDeepSearch && products && searchQuery && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="h-4 w-4" />
                  <span>Found {products.length} similar products for "{submittedQuery}"</span>
                </div>

                {products.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                      <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="font-medium mb-1">No similar products found</p>
                    <p className="text-sm text-muted-foreground">
                      Try a different description or search term
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {products.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="flex gap-4 p-3 rounded-lg border hover:border-foreground transition-colors text-left"
                      >
                        <div className="w-20 h-20 shrink-0 bg-muted rounded overflow-hidden">
                          <img
                            src={product.img }
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2 mb-1">
                            {product.name}
                          </h4>
                          <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                            {product.description}
                          </p>
                          <div className="flex items-center gap-2">
                            {product.discount > 0 ? (
                              <>
                                <span className="font-semibold text-sm">
                                  ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                                </span>
                                <span className="text-xs text-muted-foreground line-through">
                                  ${product.price.toFixed(2)}
                                </span>
                              </>
                            ) : (
                              <span className="font-semibold text-sm">
                                ${product.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Empty State - Before Search */}
            {!submittedQuery && !isLoading && (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium mb-1">Start searching</p>
                  <p className="text-sm text-muted-foreground">
                    {isDeepSearch 
                      ? "Type your search and click the Search button for AI-powered results"
                      : "Type your search query and press Enter or click Search"
                    }
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Sparkles className="h-3 w-3" />
                  <span>Tip: Try AI-Powered Search for semantic matching</span>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
