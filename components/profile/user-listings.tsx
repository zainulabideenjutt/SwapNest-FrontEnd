"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ChevronDown, ChevronUp, Edit, Trash2 } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import apiClient, { Product } from '@/lib/apiClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/lib/contexts/AuthContext';

interface UserListingsProps {
  listings: Product[];
  updateListings: (data: { listings: Product[] }) => void;
}

export function UserListings({ listings, updateListings }: UserListingsProps) {
  const updateMutation = useMutation({
    mutationFn: async (data: Product) => {
      const response = await apiClient.products.update(data.id, data)
      return response.data
    },
    onSuccess: (updatedListing) => {
      updateListings({
        listings: listings.map((l) => (l.id === updatedListing.id ? updatedListing : l))
      })
      setEditingId("")
      toast.success("Listing updated successfully")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to update listing")
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.products.delete(id)
      return id
    },
    onSuccess: (deletedId) => {
      updateListings({
        listings: listings.filter((l) => l.id !== deletedId)
      })
      toast.success("Listing deleted successfully")
    },
    onError: () => {
      toast.error("Failed to delete listing")
    }
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    updateMutation.mutate(formData as Product)
  }

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
  }
  const [editingId, setEditingId] = useState<string>("")
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Product>>({})

  const handleEdit = (listing: Product) => {
    setEditingId(listing.id)
    setFormData(listing)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
  }

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()
  //   try {
  //     // Need to ensure formData matches the expected format
  //     const response = await apiClient.products.update(editingId, {
  //       title: formData.title,
  //       description: formData.description,
  //       price: formData.price,
  //       condition: formData.condition,
  //       location: formData.location,
  //       category_id: formData.category_name // This might need adjustment based on your API
  //     })
  //     updateListings({
  //       listings: listings.map((l) => (l.id === editingId ? response.data : l))
  //     })
  //     setEditingId("")
  //     toast.success("Listing updated successfully")
  //   } catch (error: any) {
  //     toast.error(error.response?.data?.detail || "Failed to update listing")
  //   }
  // }

  // const handleDelete = async (id: string) => {
  //   try {
  //     await apiClient.products.delete(id)
  //     // Update only the listings array directly
  //     updateListings({
  //       listings: listings.filter((l) => l.id !== id)
  //     })
  //     toast.success("Listing deleted successfully")
  //   } catch (error) {
  //     toast.error("Failed to delete listing")
  //   }
  // }

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  if (!listings?.length) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">No listings found.</CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {listings.map((listing) => (
        <Card key={listing.id} className="overflow-hidden">
          <CardHeader className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative h-16 w-16 rounded-md overflow-hidden">
                  <Image
                    src={listing.images[0]?.image_url || "/placeholder.svg"}
                    alt={listing.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <CardTitle className="text-lg">{listing.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">${listing.price}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => toggleExpand(listing.id)}>
                {expandedId === listing.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          <AnimatePresence>
            {expandedId === listing.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CardContent className="pb-4 px-4">
                  {editingId === listing.id ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid gap-4">
                        <div>
                          <Label htmlFor="title">Title</Label>
                          <Input id="title" name="title" value={formData.title} onChange={handleInputChange} />
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="price">Price</Label>
                          <Input
                            id="price"
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button type="submit">Save</Button>
                        <Button type="button" variant="outline" onClick={() => setEditingId("")}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <p className="text-sm text-muted-foreground">Description</p>
                        <p>{listing.description}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Condition</p>
                          <p>{listing.condition}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Location</p>
                          <p>{listing.location || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Category</p>
                          <p>{listing.category_name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Status</p>
                          <p>
                            {listing.is_active ? "Active" : "Inactive"}
                            {listing.is_sold ? ", Sold" : ""}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {listing.images.map((image) => (
                          <div key={image.id} className="relative aspect-square rounded-md overflow-hidden">
                            <Image
                              src={image.image_url || "/placeholder.svg"}
                              alt={image.caption || "Product image"}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(listing)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(listing.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      ))}
    </div>
  )
}

