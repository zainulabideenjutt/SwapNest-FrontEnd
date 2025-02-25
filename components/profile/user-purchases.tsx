"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Product, ProductImageResponse } from '@/lib/apiClient'

interface UserPurchasesProps {
  purchases: Product[];
}

export function UserPurchases({ purchases = [] }: UserPurchasesProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  if (purchases.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">No purchases found.</CardContent>
      </Card>
    )
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="space-y-4">
      {purchases.map((purchase) => (
        <Card key={purchase.id} className="overflow-hidden">
          <CardHeader className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative h-16 w-16 rounded-md overflow-hidden">
                  <Image
                    src={purchase.images[0]?.image_url || "/placeholder.svg"}
                    alt={purchase.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <CardTitle className="text-lg">{purchase.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">${purchase.price}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => toggleExpand(purchase.id)}>
                {expandedId === purchase.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          <AnimatePresence>
            {expandedId === purchase.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CardContent className="pb-4 px-4">
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <p className="text-sm text-muted-foreground">Description</p>
                      <p>{purchase.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Seller</p>
                        <p>{purchase.seller}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Condition</p>
                        <p>{purchase.condition}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p>{purchase.location || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Category</p>
                        <p>{purchase.category_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Purchased At</p>
                        <p>{formatDate(purchase.updated_at)}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {purchase.images.map((image) => (
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
                  </div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      ))}
    </div>
  )
}

