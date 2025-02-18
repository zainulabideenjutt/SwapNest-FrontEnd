"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import apiClient, { RegisterDataTypes } from '@/lib/apiClient';
import Link from 'next/link'
export function RegisterForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"form">) {
    const router = useRouter();
    const [formData, setFormData] = useState<RegisterDataTypes>({
        username: '',
        email: '',
        password: '',
    });

    const { mutate, isPending, isSuccess, isError } = useMutation({
        mutationFn: (data: RegisterDataTypes) => apiClient.auth.register(data),
        onSuccess: () => {
            toast.success('Registration successful!');
            router.push('login');
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate({ ...formData });
    };

    return (
        <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSubmit}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Login to your account</h1>
                <p className="text-balance text-sm text-muted-foreground">
                    Enter your Details below to Register your account
                </p>
            </div>
            <div className="grid gap-8">
                <div className="grid gap-2">
                    <Label htmlFor="email">Username</Label>
                    <Input id="username" name="username" type="username" placeholder="username" value={formData.username} onChange={handleChange} required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="m@example.com" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                    </div>
                    <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required />
                </div>
                <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? 'Registering...' : 'Register'}
                </Button>
            </div>
            <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline underline-offset-4">
                    Login
                </Link>
            </div>
        </form>
    )
}
