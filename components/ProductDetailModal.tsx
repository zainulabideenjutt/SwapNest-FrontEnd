"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, MessageCircle, X } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/lib/CartContext"
import { toast } from "sonner"
import type { Product } from "@/lib/apiClient"

interface ProductDetailModalProps {
    product: Product | null
    isOpen: boolean
    onClose: () => void
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, isOpen, onClose }) => {
    const { addToCart, openCart } = useCart()

    if (!isOpen || !product) return null

    const handleAddToCart = () => {
        addToCart({ ...product })
        toast(`${product.title} has been added to your cart.`)
        openCart()
        onClose()
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                    aria-label="Close product details modal"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="relative w-full aspect-video rounded-md overflow-hidden mb-4">
                    <Image
                        src={product.images[0].image_url || "/placeholder.svg"}
                        alt={product.title}
                        fill
                        style={{ objectFit: "contain" }}
                        className="rounded-md"
                    />
                </div>

                <h2 id="modal-title" className="text-xl font-bold">
                    {product.title}
                </h2>
                <p className="text-sm text-muted-foreground">{product.category_name}</p>
                <p className="text-lg font-bold mt-2">${product.price}</p>
                <p id="modal-description" className="text-sm text-muted-foreground mt-4">
                    {product.description}
                </p>

                <div className="flex justify-between mt-6">
                    <Button className="w-full mr-2" onClick={handleAddToCart}>
                        <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                    </Button>
                    <Button variant="outline" className="w-full ml-2">
                        <MessageCircle className="mr-2 h-4 w-4" /> Contact Seller
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ProductDetailModal

