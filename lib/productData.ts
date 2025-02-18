export const allProducts = [
  {
    id: 1,
    name: "Wireless Earbuds",
    category: "Electronics",
    price: 99,
    image:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    description: "High-quality wireless earbuds with noise cancellation and long battery life.",
  },
  {
    id: 2,
    name: "Smartphone X",
    category: "Electronics",
    price: 599,
    image:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    description: "A powerful smartphone with a stunning display and advanced camera features.",
  },
  {
    id: 3,
    name: "Laptop Pro",
    category: "Electronics",
    price: 1299,
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    description: "A high-performance laptop designed for productivity and creativity.",
  },
  {
    id: 4,
    name: "Men's Casual Shirt",
    category: "Clothing",
    price: 49,
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    description: "Comfortable and stylish casual shirt for everyday wear.",
  },
  {
    id: 5,
    name: "Women's Handbag",
    category: "Clothing",
    price: 79,
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    description: "Elegant handbag perfect for formal and casual occasions.",
  },
  {
    id: 6,
    name: "Coffee Mug",
    category: "Home",
    price: 15,
    image:
      "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    description: "Durable coffee mug for your daily caffeine fix.",
  },
  {
    id: 7,
    name: "Novel Book",
    category: "Books",
    price: 25,
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    description: "An engaging novel to keep you entertained for hours.",
  },
]

interface ProductImage {
    id: string;
    product: string;
    image_url: string;
    caption: string;
    order: number;
    created_at: string;
}

export interface Product {
    id: string;
    seller: string;
    title: string;
    description: string;
    price: number;
    condition: "New" | "Used";
    location: string | null;
    category_name: string;
    is_active: boolean;
    is_sold: boolean;
    bought_by: string | null;
    created_at: string;
    updated_at: string;
    images: ProductImage[];
}
