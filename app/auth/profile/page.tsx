"use client"
import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import apiClient from '../../../lib/apiClient';

const ProfilePage = () => {
  const router = useRouter();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: () => apiClient.auth.profile(),
  });

  const logoutMutation = useMutation({
    mutationFn: () => apiClient.auth.logout(),
    onSuccess: () => {
      toast.success('Logged out successfully');
      router.push('/login');
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading profile</div>;

  const user = profile?.data;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      {user && (
        <div className="space-y-4">
          <div>
            {user.profile_picture_url && (
              <img
                src={user.profile_picture_url}
                alt="Profile"
                className="w-32 h-32 rounded-full"
              />
            )}
          </div>
          <div>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Balance:</strong> {user.balance}</p>
            <p><strong>Contact:</strong> {user.contact_details || 'Not provided'}</p>
            <p><strong>Member since:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <p><strong>Listings:</strong> {user.listings.length}</p>
            <p><strong>Purchases:</strong> {user.purchased_products.length}</p>
          </div>
          <button
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
