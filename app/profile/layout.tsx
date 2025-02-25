import type React from "react"
import type { Metadata } from "next"

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
    <div className="container mx-auto p-6 max-w-7xl">
      {children}
    </div>
  )
}

