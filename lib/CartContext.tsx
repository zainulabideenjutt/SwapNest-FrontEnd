"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"

interface CartItem {
    id: number
    name: string
    price: number
    quantity: number
    image: string
}

interface CartContextType {
    cart: CartItem[]
    addToCart: (item: CartItem) => void
    removeFromCart: (id: number) => void
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

    const addToCart = useCallback((item: CartItem) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((cartItem) => cartItem.id === item.id)
            if (existingItem) {
                return prevCart.map((cartItem) =>
                    cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
                )
            }
            return [...prevCart, { ...item, quantity: 1 }]
        })
    }, [])

    const removeFromCart = useCallback((id: number) => {
        setCart((prevCart) =>
            prevCart.reduce((acc, item) => {
                if (item.id === id) {
                    if (item.quantity > 1) {
                        acc.push({ ...item, quantity: item.quantity - 1 })
                    }
                } else {
                    acc.push(item)
                }
                return acc
            }, [] as CartItem[]),
        )
    }, [])

    const clearCart = useCallback(() => {
        setCart([])
    }, [])

    const getCartTotal = useCallback(() => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0)
    }, [cart])

    const getCartCount = useCallback(() => {
        return cart.reduce((count, item) => count + item.quantity, 0)
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

