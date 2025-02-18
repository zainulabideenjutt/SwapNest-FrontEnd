"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import type { ProductImage, Product } from "./apiClient"
interface CartItem {
    id: string
    title: string
    price: number
    images: ProductImage[]
}

interface CartContextType {
    cart: CartItem[]
    addToCart: (item: Product) => void
    removeFromCart: (id: string) => void
    clearCart: () => void
    getCartTotal: () => number
    getCartCount: () => number
    isCartOpen: boolean
    openCart: () => void
    closeCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error("useCart must be used within a CartProvider")
    }
    return context
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([])
    const [isCartOpen, setIsCartOpen] = useState(false)

    const addToCart = useCallback((item: Product) => {
        setCart((prevCart) => [...prevCart, {
            id: item.id,
            title: item.title,
            price: item.price,
            images: item.images
        }])
    }, [])

    const removeFromCart = useCallback((id: string) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id))
    }, [])

    const clearCart = useCallback(() => {
        setCart([])
    }, [])

    const getCartTotal = useCallback(() => {
        return cart.reduce((total, item) => total + Number(item.price), 0)
    }, [cart])

    const getCartCount = useCallback(() => {
        return cart.length
    }, [cart])

    const openCart = useCallback(() => {
        setIsCartOpen(true)
    }, [])

    const closeCart = useCallback(() => {
        setIsCartOpen(false)
    }, [])

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                clearCart,
                getCartTotal,
                getCartCount,
                isCartOpen,
                openCart,
                closeCart,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

