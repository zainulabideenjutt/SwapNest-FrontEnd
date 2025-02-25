"use client"

import { useState } from "react"
import { UserDetails } from "./user-details"
import { UserListings } from "./user-listings"
import { UserPurchases } from "./user-purchases"
import { UserReports } from "./user-reports"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import apiClient, { ProfileResponse, Product } from '@/lib/apiClient'
import { useQuery } from '@tanstack/react-query'
import { ProfileSkeleton } from "./profile-skeleton"

export function UserProfile({ initialData }: { initialData?: ProfileResponse }) {
  const [activeTab, setActiveTab] = useState("details")
  
  const { data: userData, isLoading, error, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await apiClient.auth.profile()
      return response.data
    },
    initialData
  })

  const updateUserData = async (newData: Partial<ProfileResponse>) => {
    try {
      const response = await apiClient.auth.updateProfile(newData)
      if (response.data) {
        refetch()
        toast.success("Profile updated successfully!")
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to update profile")
    }
  }

  const updateListings = async (newData: { listings: Product[] }) => {
    try {
      // Update each listing individually since there's no bulk update endpoint
      await Promise.all(
        newData.listings.map(listing =>
          apiClient.products.update(listing.id, listing)
        )
      )
      refetch()
      toast.success("Listings updated successfully!")
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to update listings")
    }
  }

  if (isLoading) return <ProfileSkeleton />
  if (error || !userData) return <div>Error loading profile</div>

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="overflow-hidden border-2">
        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-4 h-14 rounded-none bg-muted/50">
            <TabsTrigger value="details" className="data-[state=active]:bg-background rounded-none h-14">
              Profile Details
            </TabsTrigger>
            <TabsTrigger value="listings" className="data-[state=active]:bg-background rounded-none h-14">
              My Listings
            </TabsTrigger>
            <TabsTrigger value="purchases" className="data-[state=active]:bg-background rounded-none h-14">
              Purchase History
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-background rounded-none h-14">
              Reports
            </TabsTrigger>
          </TabsList>
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <TabsContent value="details" forceMount={activeTab === "details" ? true : undefined}>
                  <UserDetails user={userData} updateUser={updateUserData} />
                </TabsContent>
                <TabsContent value="listings" forceMount={activeTab === "listings" ? true : undefined}>
                  <UserListings listings={userData.listings} updateListings={updateListings} />
                </TabsContent>
                <TabsContent value="purchases" forceMount={activeTab === "purchases" ? true : undefined}>
                  <UserPurchases purchases={userData.purchased_products} />
                </TabsContent>
                <TabsContent value="reports" forceMount={activeTab === "reports" ? true : undefined}>
                  <UserReports reports={userData.reports} />
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </div>
        </Tabs>
      </Card>
    </motion.div>
  )
}

