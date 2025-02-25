"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import apiClient from "@/lib/apiClient"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { ProfileResponse } from '@/lib/apiClient';
import { useMutation } from '@tanstack/react-query';

interface UserDetailsProps {
  user: ProfileResponse;
  updateUser: (user: ProfileResponse) => void;
}

export function UserDetails({ user, updateUser }: UserDetailsProps) {
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState(user)

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<ProfileResponse>) => {
      const response = await apiClient.auth.updateProfile(data)
      return response.data
    },
    onSuccess: (data) => {
      updateUser(data)
      setEditing(false)
      toast.success("Profile updated successfully")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to update profile")
    }
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    updateMutation.mutate(formData)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      <div className="flex items-center space-x-4">
        <Avatar className="w-24 h-24">
          <AvatarImage src={user.profile_picture_url || "/placeholder.svg"} alt={user.username} />
          <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-3xl font-bold">{user.username}</h2>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>
      {editing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" value={formData.username} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="contact_details">Contact Details</Label>
              <Input
                id="contact_details"
                name="contact_details"
                value={formData.contact_details || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <Button type="submit">Save</Button>
            <Button type="button" variant="outline" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Role</p>
            <p>{user.role}</p>
          </div>
          <div>
            <p className="font-semibold">Balance</p>
            <p>${user.balance}</p>
          </div>
          <div>
            <p className="font-semibold">Contact Details</p>
            <p>{user.contact_details || "N/A"}</p>
          </div>
          <div>
            <p className="font-semibold">Active</p>
            <p>{user.is_active ? "Yes" : "No"}</p>
          </div>
          <div>
            <p className="font-semibold">Created At</p>
            <p>{new Date(user.created_at).toLocaleString()}</p>
          </div>
          <div>
            <p className="font-semibold">Updated At</p>
            <p>{new Date(user.updated_at).toLocaleString()}</p>
          </div>
          <div className="md:col-span-2">
            <Button onClick={() => setEditing(true)}>Edit Profile</Button>
          </div>
        </div>
      )}
    </motion.div>
  )
}

