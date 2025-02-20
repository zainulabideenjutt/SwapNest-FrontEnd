"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import apiClient, { LoginDataTypes } from '@/lib/apiClient';
import Link from 'next/link'
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const router = useRouter();

  // Check if user is already authenticated
  const { data: authData } = useQuery({
    queryKey: ['isAuthenticated'],
    queryFn: () => apiClient.auth.isAuthenticated(),
    retry: false
  });

  useEffect(() => {
    if (authData?.data?.success) {
      router.push('/');
      toast.error('You are already logged in');
    }
  }, [authData, router]);

  const [formData, setFormData] = useState<LoginDataTypes>({ email: '', password: '' });

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (data: LoginDataTypes) => apiClient.auth.login(data),
    onSuccess: (response) => {
      toast.success('Login successful!');
      router.push('/');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Login failed');
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(formData);
  };

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSubmit}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="m@example.com" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required />
        </div>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Logging in...' : 'Login'}
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </form>
  )
}
