"use client"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import apiClient, { CreateProduct, Product, Category } from "@/lib/apiClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import Link from "next/link"
import React, { useState, useEffect } from 'react'
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import Image from "next/image"

// Add this function before the Page component
const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

export default function Page() {
    const router = useRouter();
    const [formData, setFormData] = useState<Omit<CreateProduct, 'images'> & { images: string[] }>({
        title: '',
        description: '',
        price: 0,
        condition: "New",
        location: '',
        category_id: '',
        images: []
    });
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    // Fetch categories
    const { data: categories } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: () => apiClient.categories.list()
    });

    const { mutate: createProduct, isPending } = useMutation({
        mutationFn: async (data: Omit<CreateProduct, 'images'> & { images: string[] }) => {
            const response = await apiClient.products.create(data as any);
            return response;
        },
        onSuccess: () => {
            toast.success('Product created successfully');
            router.push('/');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || 'Failed to create product');
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' ? parseFloat(value) : value
        }));
    };

    const handleConditionChange = (value: "New" | "Used") => {
        setFormData(prev => ({ ...prev, condition: value }));
    };

    const handleCategoryChange = (value: string) => {
        setFormData(prev => ({ ...prev, category_id: value }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setSelectedFiles(prev => [...prev, ...files]);

            // Create preview URLs and convert images to base64
            const newPreviewUrls: string[] = [];
            const base64Images: string[] = [];

            for (const file of files) {
                const previewUrl = URL.createObjectURL(file);
                newPreviewUrls.push(previewUrl);

                const base64 = await convertToBase64(file);
                base64Images.push(base64);
            }

            setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...base64Images]
            }) as Omit<CreateProduct, 'images'> & { images: string[] });
        }
    };

    const removeImage = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }) as Omit<CreateProduct, 'images'> & { images: string[] });
    };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formData.category_id) {
            toast.error('Please select a category');
            return;
        }
        if (formData.images.length === 0) {
            toast.error('Please add at least one image');
            return;
        }
        console.log(formData);
        createProduct(formData);
    };

    return (
        <>
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-2xl font-bold mb-6">Create New Product</h1>
                    <Link
                        href="/"
                        className="text-primary hover:text-primary/80 mb-4 inline-flex items-center"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Home
                    </Link>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Price</Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Condition</Label>
                                <Select onValueChange={handleConditionChange} value={formData.condition}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select condition" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="New">New</SelectItem>
                                        <SelectItem value="Used">Used</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                name="location"
                                value={formData.location || ''}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select onValueChange={handleCategoryChange} value={formData.category_id}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories?.map(category => (
                                        <SelectItem key={category.id} value={category.id}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="images">Product Images</Label>
                            <Input
                                id="images"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileChange}
                                className="cursor-pointer"
                            />
                            <div className="grid grid-cols-3 gap-4 mt-4">
                                {previewUrls.map((url, index) => (
                                    <div key={index} className="relative">
                                        <Image
                                            src={url}
                                            alt={`Preview ${index + 1}`}
                                            width={200}
                                            height={200}
                                            className="rounded-lg object-cover"
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            className="absolute top-2 right-2"
                                            onClick={() => removeImage(index)}
                                        >
                                            ×
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isPending}
                        >
                            {isPending ? 'Creating...' : 'Create Product'}
                        </Button>
                    </form>
                </div>
            </main>
            <Footer />
        </>
    );
}