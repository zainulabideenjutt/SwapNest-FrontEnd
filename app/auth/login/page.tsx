"use client"
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import apiClient from '@/lib/apiClient';

type LoginDataTypes = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginDataTypes>({ email: '', password: '' });

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (data: LoginDataTypes) => apiClient.auth.login(data),
    onSuccess: () => {
      toast.success('Login successful!');
      router.push('profile');
    },
    onError: (error) => {
      toast.error(error.message);
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
    <div>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <br />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <br />
        <button type="submit" disabled={isPending}>
          {isPending ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
