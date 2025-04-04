import type React from "react"
import type { Metadata } from "next"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export const metadata: Metadata = {
  title: "User Profile",
  description: "Manage your account, listings, purchases, and reports.",
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <div className="container mx-auto p-6 max-w-7xl">
        {children}
      </div>
      <Footer />
    </>
  )
}

