"use client"

import type React from "react"
import { useMemo, useState } from "react"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ShoppingCart, MessageCircle } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/lib/CartContext"
import { toast } from "sonner"
import { allProducts } from "@/lib/productData"
import ProductDetailModal from "./ProductDetailModal"

const HeroSection: React.FC = () => {
    const { addToCart, openCart } = useCart()
    const [selectedProduct, setSelectedProduct] = useState<(typeof allProducts)[0] | null>(null)

    const sliderSettings = useMemo(
        () => ({
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 3000,
            pauseOnHover: false,
        }),
        [],
    )

    const featuredProducts = useMemo(() => allProducts.slice(0, 3), [])

    const handleAddToCart = (product: (typeof allProducts)[0]) => {
        addToCart({ ...product, quantity: 1 })
        toast(`${product.name} has been added to your cart.`)
        openCart()
    }

    return (
        <section className="py-10 bg-background overflow-hidden">
            <div className="container mx-auto px-4">
                <Slider {...sliderSettings}>
                    {featuredProducts.map((product) => (
                        <div key={product.id}>
                            <Card className="flex flex-col md:flex-row items-center justify-between p-6 bg-card text-card-foreground shadow-lg rounded-lg">
                                <div className="w-full md:w-1/2 mb-4 md:mb-0 relative aspect-video">
                                    <Image
                                        src={product.image || "/placeholder.svg"}
                                        alt={product.name}
                                        fill
                                        style={{ objectFit: "contain" }}
                                        className="rounded-md cursor-pointer"
                                        onClick={() => setSelectedProduct(product)}
                                        priority={product.id === 1}
                                    />
                                </div>
                                <div className="w-full md:w-1/2 space-y-4 text-center md:text-left">
                                    <h2 className="text-2xl font-bold">{product.name}</h2>
                                    <p className="text-lg text-muted-foreground">${product.price}</p>
                                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                                        <Button
                                            className="w-full sm:w-auto"
                                            aria-label={`Add ${product.name} to cart`}
                                            onClick={() => handleAddToCart(product)}
                                        >
                                            <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full sm:w-auto"
                                            aria-label={`Contact seller for ${product.name}`}
                                        >
                                            <MessageCircle className="mr-2 h-4 w-4" /> Contact Seller
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    ))}
                </Slider>
            </div>
            <ProductDetailModal
                product={selectedProduct}
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </section>
    )
}

export default HeroSection

