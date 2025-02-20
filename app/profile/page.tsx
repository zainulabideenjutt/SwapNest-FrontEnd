"use client"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import apiClient, { CreateCategory } from "@/lib/apiClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import React, { useState } from 'react'
import { useMutation } from "@tanstack/react-query"

export default function Page() {
    const [formData, setFormData] = useState<CreateCategory>({ name: '', description: '' });
    const { mutate: createCategory, isPending } = useMutation({
        mutationFn: (data: CreateCategory) => apiClient.categories.create(data),
        onSuccess: () => {
            toast.success('Category created successfully');
            setFormData({ name: '', description: '' }); // Reset form
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || 'Failed to create category');
        }
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createCategory(formData);
    };
    return (
        <>
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-md mx-auto">
                    <h3 className="text-2xl font-bold mb-6">Add Category</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input 
                                id="name" 
                                name="name"
                                type="text" 
                                placeholder="Category name" 
                                value={formData.name} 
                                onChange={handleChange}
                                required 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input 
                                id="description" 
                                name="description"
                                type="text" 
                                placeholder="Category description" 
                                value={formData.description} 
                                onChange={handleChange}
                                required 
                            />
                        </div>
                        <Button 
                            type="submit" 
                            className="w-full"
                            disabled={isPending}
                        >
                            {isPending ? 'Creating...' : 'Add Category'}
                        </Button>
                    </form>
                </div>
            </main>
            <Footer />
        </>
    )
}