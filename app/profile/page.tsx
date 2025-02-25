import { Suspense } from "react"
import { UserProfile } from "@/components/profile/user-profile"
import apiClient from "@/lib/apiClient"
import { ProfileSkeleton } from "@/components/profile/profile-skeleton"
import { ErrorBoundary } from "@/components/profile/error-boundary"
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'

export default async function ProfilePage() {
    const queryClient = new QueryClient()
    
    // Prefetch the profile data
    await queryClient.prefetchQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            const response = await apiClient.auth.profile()
            return response.data
        }
    })

    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto py-8 px-4">
                <h1 className="text-4xl font-bold mb-8 text-foreground">User Profile</h1>
                <ErrorBoundary
                    fallback={
                        <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
                            Error loading profile. Please try again later.
                        </div>
                    }
                >
                    <HydrationBoundary state={dehydrate(queryClient)}>
                        <Suspense fallback={<ProfileSkeleton />}>
                            <UserProfile />
                        </Suspense>
                    </HydrationBoundary>
                </ErrorBoundary>
            </div>
        </main>
    )
}

