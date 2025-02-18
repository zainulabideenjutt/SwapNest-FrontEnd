"use client"

import type React from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/CartContext"
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

const CartDrawer: React.FC = () => {
    const { cart, addToCart, removeFromCart, clearCart, getCartTotal, getCartCount, isCartOpen, openCart, closeCart } =
        useCart()

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
                    {cart.length === 0 ? (
                        <p className="text-center text-muted-foreground mt-4">Your cart is empty</p>
                    ) : (
                        <>
                            <ul className="divide-y divide-gray-200 flex-grow overflow-auto">
                                {cart.map((item) => (
                                    <li key={item.id} className="py-4 flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 mr-4">
                                                <Image
                                                    src={item.image || "/placeholder.svg"}
                                                    alt={item.name}
                                                    width={64}
                                                    height={64}
                                                    className="h-full w-full object-cover object-center"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium">{item.name}</h3>
                                                <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button variant="outline" size="icon" onClick={() => removeFromCart(item.id)}>
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                            <span>{item.quantity}</span>
                                            <Button variant="outline" size="icon" onClick={() => addToCart(item)}>
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => {
                                                    for (let i = 0; i < item.quantity; i++) {
                                                        removeFromCart(item.id)
                                                    }
                                                    toast.success(`${item.name} removed from cart`)
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
                                    <span>${getCartTotal().toFixed(2)}</span>
                                </div>
                                <Button
                                    className="w-full"
                                    onClick={() => {
                                        toast.success("Proceeding to checkout")
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

