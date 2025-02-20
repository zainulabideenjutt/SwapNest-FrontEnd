"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
            className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? "backdrop-blur-md bg-background/80" : "bg-background"}`}
        >
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <div className="flex items-center">
                    <Link href="/" className="text-lg font-bold text-primary">
                        MyEcommerce
                    </Link>
                </div>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center space-x-4">
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
                            <DropdownMenuItem onClick={() => logoutMutation.mutate()}>
                                {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div onClick={openCart}>
                        <CartDrawer />
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className="flex items-center space-x-2 md:hidden">
                    <div onClick={openCart}>
                        <CartDrawer />
                    </div>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Open mobile menu"
                                className="hover:bg-accent hover:text-accent-foreground transition-colors"
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                            <SheetHeader className="border-b pb-4 mb-4">
                                <SheetTitle className="text-left">Menu</SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col space-y-2">
                                <div className="flex items-center p-2 rounded-lg hover:bg-accent">
                                    <User className="h-4 w-4 mr-2" />
                                    <span className="text-sm font-medium">My Account</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start"
                                    onClick={() => router.push("/profile")}
                                >
                                    Profile
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start"
                                    onClick={() => router.push("/orders")}
                                >
                                    Orders
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                                    onClick={() => logoutMutation.mutate()}
                                    disabled={logoutMutation.isPending}
                                >
                                    {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
};

export default Header;
