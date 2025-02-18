"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Smartphone, Laptop, Headphones, Watch, Camera, Gamepad } from "lucide-react"

const FeaturedCategories = () => {
    const categories = [
        {
            id: 1,
            name: "Smartphones",
            icon: <Smartphone className="h-8 w-8 text-primary" />,
            description: "Explore the latest smartphones.",
        },
        {
            id: 2,
            name: "Laptops",
            icon: <Laptop className="h-8 w-8 text-primary" />,
            description: "Find your perfect laptop.",
        },
        {
            id: 3,
            name: "Headphones",
            icon: <Headphones className="h-8 w-8 text-primary" />,
            description: "Enjoy high-quality sound.",
        },
        {
            id: 4,
            name: "Watches",
            icon: <Watch className="h-8 w-8 text-primary" />,
            description: "Stay stylish with smartwatches.",
        },
        {
            id: 5,
            name: "Cameras",
            icon: <Camera className="h-8 w-8 text-primary" />,
            description: "Capture every moment.",
        },
        {
            id: 6,
            name: "Gaming",
            icon: <Gamepad className="h-8 w-8 text-primary" />,
            description: "Level up your gaming experience.",
        },
    ]

    return (
        <section className="py-12 bg-background">
            <div className="container mx-auto px-4">
                {/* Section Title */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold">Featured Categories</h2>
                    <p className="text-muted-foreground mt-2">Explore our top product categories.</p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {categories.map(({ id, name, icon, description }) => (
                        <Card key={id} className="flex flex-col items-center p-4 hover:shadow-lg transition-shadow duration-300">
                            <div className="mb-4">{icon}</div>
                            <h3 className="text-lg font-semibold text-center">{name}</h3>
                            <p className="text-sm text-muted-foreground text-center mt-2">{description}</p>
                            <Button variant="link" className="mt-4" aria-label={`View more about ${name}`}>
                                View More
                            </Button>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default FeaturedCategories

