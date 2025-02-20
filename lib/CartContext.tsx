"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import type { ProductImage, Product, DbCartItem } from "./apiClient"
import { toast } from "sonner"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import apiClient from "./apiClient"

interface CartContextType {
    cart: DbCartItem[]
    addToCart: (product: Product) => Promise<boolean>
    removeFromCart: (id: string) => void
    clearCart: () => void
    getCartTotal: () => number
    getCartCount: () => number
    isCartOpen: boolean
    openCart: () => void
    closeCart: () => void
    isLoading: boolean
    error: Error | null
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
    const [isCartOpen, setIsCartOpen] = useState(false)
    const queryClient = useQueryClient()

    // Fetch cart items
    const { data: cart = [], isLoading, error } = useQuery<DbCartItem[]>({
        queryKey: ['cart'],
        queryFn: () => apiClient.cart.items.list().then(res => res.data)
    })

    // Add to cart mutation
    const addToCartMutation = useMutation({
        mutationFn: (productId: string) => apiClient.cart.items.add({ product_id: productId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || 'Failed to add item to cart')
        }
    })

    // Remove from cart mutation
    const removeFromCartMutation = useMutation({
        mutationFn: (productId: string) => apiClient.cart.items.remove(productId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || 'Failed to remove item from cart')
        }
    })

    // Clear cart mutation
    const clearCartMutation = useMutation({
        mutationFn: () => apiClient.cart.empty(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || 'Failed to clear cart')
        }
    })
    const addToCart = async (product: Product): Promise<boolean> => {
        try {
            await addToCartMutation.mutateAsync(product.id)
            return true
        } catch {
            return false
        }
    }

    const removeFromCart = useCallback((id: string) => {
        removeFromCartMutation.mutate(id)
    }, [removeFromCartMutation])

    const clearCart = useCallback(() => {
        clearCartMutation.mutate()
    }, [clearCartMutation])

    const getCartTotal = useCallback(() => {
        return cart.reduce((total, item) => total + Number(item.product.price), 0)
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
                isLoading,
                error: error as Error | null
            }}
        >
            {children}
        </CartContext.Provider>
    )
}