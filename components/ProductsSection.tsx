"use client"

import type React from "react"
import { useQuery } from '@tanstack/react-query'
import { useState, useMemo, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Select from "react-select"
import Image from "next/image"
import { useCart } from "@/lib/CartContext"
import { toast } from "sonner"
import type { Product, Category } from '@/lib/apiClient'
import ProductDetailModal from "./ProductDetailModal"
import { Search } from "lucide-react"
import apiClient from "@/lib/apiClient"
import { AxiosResponse } from "axios"

const ProductsSection: React.FC = () => {
    const { addToCart, openCart } = useCart()
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000])
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const productsPerPage = 12

    const { isLoading: isProductLoading, isError: isProductError, data: Products, error: productError } = useQuery<Product[]>({
        queryKey: ['Products'],
        queryFn: apiClient.products.list,
    })
    const { isLoading: isCategorytLoading, isError: isPCategoryError, data: Categories, error: CategoryError } = useQuery<Category[]>({
        queryKey: ['Categories'],
        queryFn: apiClient.categories.list,
    })

    const categoryOptions = [
        { value: "All", label: "All" },  // Static option
        ...Categories?.map((category) => ({
            value: category.name,
            label: category.name
        })) || [] // Ensure it doesn't break if Categories is undefined
    ];

    // Filter products based on search, category, and price range
    const filteredProducts = useMemo(() => {
        if (!Products) return [];
        return Products.filter((product) => {

            const matchesSearch = product.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            const matchesCategory =
                !selectedCategory ||
                selectedCategory === "All" ||
                product.category_name === selectedCategory
            const matchesPrice =
                product.price >= priceRange[0] && product.price <= priceRange[1]
            return matchesSearch && matchesCategory && matchesPrice
        })
    }, [Products, selectedCategory, priceRange, searchTerm])

    const totalPages = useMemo(
        () => Math.ceil(filteredProducts.length / productsPerPage),
        [filteredProducts.length]
    )

    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * productsPerPage
        return filteredProducts.slice(start, start + productsPerPage)
    }, [filteredProducts, currentPage])

    const handlePageChange = useCallback((newPage: number) => {
        setCurrentPage(newPage)
    }, [])

    const handleAddToCart = useCallback(
        async (product: Product) => {
            const wasAdded = await addToCart(product)
            if (wasAdded) {
                toast.success(`${product.title} added to cart`)
                openCart()
            }
        },
        [addToCart, openCart]
    )
    if (isProductLoading) {
        return <div>Loading...</div>;
    }

    if (isProductError) {
        return <div>Error: {productError.message}</div>;
    }
    if (isCategorytLoading) {
        return <div>Loading...</div>;
    }

    if (isPCategoryError) {
        return <div>Error: {CategoryError.message}</div>;
    }

    return (
        <section className="py-12 bg-background">
            <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
                {/* Filter Sidebar */}
                <aside className="hidden lg:block">
                    <h3 className="text-lg font-semibold mb-4">Filters</h3>
                    {/* Category Filter */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                            Category
                        </label>
                        {typeof window !== "undefined" && (
                            <Select
                                options={categoryOptions}
                                value={
                                    selectedCategory
                                        ? { value: selectedCategory, label: selectedCategory }
                                        : null
                                }
                                onChange={(option) => setSelectedCategory(option?.value || null)}
                                placeholder="Select Category"
                                isClearable
                                instanceId="category-select"
                                className="react-select-container"
                                styles={{
                                    control: (baseStyles) => ({
                                        ...baseStyles,
                                        borderColor: "#d1d5db",
                                        borderRadius: "0.5rem",
                                        "&:hover": { borderColor: "#9ca3af" },
                                    }),
                                }}
                            />
                        )}
                    </div>
                    {/* Price Range Filter */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                            Price Range
                        </label>
                        <div className="flex items-center space-x-2">
                            <Input
                                type="number"
                                value={priceRange[0]}
                                onChange={(e) =>
                                    setPriceRange([Number(e.target.value), priceRange[1]])
                                }
                                className="w-24"
                                min="0"
                                max="1000000"
                            />
                            <span>-</span>
                            <Input
                                type="number"
                                value={priceRange[1]}
                                onChange={(e) =>
                                    setPriceRange([priceRange[0], Number(e.target.value)])
                                }
                                className="w-24"
                                min="0"
                                max="1000000"
                            />
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main>
                    {/* Search Bar */}
                    <div className="flex items-center space-x-4 mb-6">
                        <Input
                            type="search"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-grow"
                        />
                        <Button variant="outline" size="icon" aria-label="Search">
                            <Search className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {paginatedProducts.map((product: Product) => (
                            <Card
                                key={product.id}
                                className="p-2 transition-transform duration-300 hover:scale-105"
                            >
                                <CardContent>
                                    <div
                                        className="relative w-full aspect-video rounded-md overflow-hidden mb-2 cursor-pointer"
                                        onClick={() => setSelectedProduct(product)}
                                    >
                                        <Image
                                            src={product.images[0].image_url || "/placeholder.svg"}
                                            alt={product.title}
                                            fill
                                            style={{ objectFit: "contain" }}
                                            className="rounded-md"
                                            onError={(e) => {
                                                const target = e.currentTarget as HTMLImageElement
                                                target.src = "/fallback-image.jpg"
                                            }}
                                        />
                                    </div>
                                    <h3 className="text-sm font-semibold">{product.title}</h3>
                                    <p className="text-xs text-muted-foreground">
                                        {product.category_name}
                                    </p>
                                    <p className="text-sm font-bold mt-1">${product.price}</p>
                                    <Button
                                        className="w-full mt-2"
                                        onClick={() => handleAddToCart(product)}
                                    >
                                        Add to Cart
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center mt-8 space-x-2">
                        <Button
                            variant="outline"
                            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <span className="text-muted-foreground">
                            Page {currentPage} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </main>

                <ProductDetailModal
                    product={selectedProduct}
                    isOpen={!!selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            </div>
        </section>
    )
}

export default ProductsSection
