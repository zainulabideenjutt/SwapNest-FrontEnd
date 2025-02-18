"use client"
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import apiClient, { RegisterDataTypes } from '../../../lib/apiClient';
import { toast } from 'sonner';

const RegisterPage = () => {
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
      router.push('/auth/login');
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
    <div>
      <h1>Register</h1>
      {isError && <div>Error occurred. Please try again.</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          required
        />
        <br />
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
          {isPending ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
