"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// import { useCart } from "@/lib/CartContext";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { User, Menu, Search, ShoppingCart } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useCart } from "@/lib/CartContext"
import CartDrawer from "./CartDrawer";
import { useMutation } from "@tanstack/react-query";
import { toast } from 'sonner'
import apiClient from "@/lib/apiClient";
const Header: React.FC = () => {
    const { openCart } = useCart();
    const router = useRouter();
    const [isScrolled, setIsScrolled] = useState(false);
    // Optional: If you wish to show a cart count badge, you can manage a cartCount state.
    const [cartCount] = useState(3); // Example cart count
    const logoutMutation = useMutation({
        mutationFn: () => apiClient.auth.logout(),
        onSuccess: () => {
            toast.success('Logged out successfully');
            router.push('/login');
        },
    });
    const handleScroll = useCallback(() => {
        setIsScrolled(window.scrollY > 50);
    }, []);


    useEffect(() => {
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    return (
        <header
            className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? "backdrop-blur-md bg-background/80" : "bg-background"
                }`}
        >
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <div className="flex items-center">
                    <Link href="/" className="text-lg font-bold text-primary">
                        MyEcommerce
                    </Link>
                </div>

                {/* Desktop Search */}
                <div className="hidden md:flex w-full max-w-sm mx-auto relative">
                    <Input
                        type="search"
                        placeholder="Search products..."
                        aria-label="Search products"
                        className="w-full pl-10 pr-4 py-2 rounded-full border-none focus:ring-2 focus:ring-primary"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center space-x-4">
                    {/* Profile Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Account menu"
                                className="hover:bg-accent hover:text-accent-foreground transition-colors"
                            >
                                <User className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={() => router.push("/profile")}>
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>Orders</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => logoutMutation.mutate()}>{logoutMutation.isPending ? 'Logging out...' : 'Logout'}</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div onClick={openCart}>

                        <CartDrawer />
                    </div>
                </div>

                {/* Mobile Menu */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Open mobile menu"
                            className="md:hidden hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <SheetHeader>
                            <VisuallyHidden>
                                <SheetTitle>Mobile Menu</SheetTitle>
                            </VisuallyHidden>
                        </SheetHeader>
                        <div className="flex flex-col space-y-4 mt-4">
                            <div className="flex">
                                <Input
                                    type="search"
                                    placeholder="Search products..."
                                    aria-label="Search products"
                                    className="flex-grow"
                                />
                                <Button size="icon">
                                    <Search className="h-5 w-5" />
                                </Button>
                            </div>
                            <Button variant="ghost" onClick={() => router.push("/profile")}>
                                Profile
                            </Button>
                            <CartDrawer />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
};

export default Header;
