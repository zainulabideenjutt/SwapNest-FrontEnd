"use client"

import type React from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/CartContext"
import { Trash2, ShoppingCart, Loader2 } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import apiClient from "@/lib/apiClient"
import { useMutation, useQueryClient } from "@tanstack/react-query"  // Add useQueryClient

const CartDrawer: React.FC = () => {
    const queryClient = useQueryClient();  // Add this line
    const {
        cart,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartCount,
        isCartOpen,
        openCart,
        closeCart,
        isLoading,
        error
    } = useCart()
    // implement checkout with apiClient.checkout.process post method with react query
    const checkout = useMutation({
        mutationFn: () => apiClient.checkout.process(),
        onSuccess: () => {
            toast.success("Checkout successful");
            closeCart();
            clearCart();
            // Invalidate and refetch products
            queryClient.invalidateQueries({ queryKey: ['Products'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || "Checkout failed")
        }
    });

    return (
        <Sheet open={isCartOpen} onOpenChange={closeCart}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Open shopping cart"
                    className="relative hover:bg-accent hover:text-accent-foreground transition-colors"
                    onClick={openCart}
                >
                    <ShoppingCart className="h-5 w-5" />
                    {getCartCount() > 0 && (
                        <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {getCartCount()}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Your Cart</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col h-full">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                    ) : error ? (
                        <p className="text-center text-red-500 mt-4">Error loading cart</p>
                    ) : cart.length === 0 ? (
                        <p className="text-center text-muted-foreground mt-4">Your cart is empty</p>
                    ) : (
                        <>
                            <ul className="divide-y divide-gray-200 flex-grow overflow-auto">
                                {cart.map((item) => (
                                    <li key={item.id} className="py-4 flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 mr-4">
                                                <Image
                                                    src={item.product.images[0]?.image_url || "/placeholder.svg"}
                                                    alt={item.product.title}
                                                    width={64}
                                                    height={64}
                                                    className="h-full w-full object-cover object-center"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium">{item.product.title}</h3>
                                                <p className="text-sm text-muted-foreground">${item.product.price}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => {
                                                    removeFromCart(item.id)
                                                    toast.success(`${item.product.title} removed from cart`)
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-4 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">Total:</span>
                                    <span>${getCartTotal()}</span>
                                </div>
                                <Button
                                    className="w-full"
                                    onClick={() => {
                                        toast.success("Proceeding to checkout")
                                        checkout.mutate()
                                        closeCart()
                                    }}
                                >
                                    Checkout
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => {
                                        clearCart()
                                        toast.success("Cart cleared")
                                    }}
                                >
                                    Clear Cart
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default CartDrawer

