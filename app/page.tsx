"use client";
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeaturedCategories from "@/components/CategoriesSection";
import ProductsSection from "@/components/ProductsSection";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import apiClient from "@/lib/apiClient";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>MyEcommerce | Home</title>
        <meta
          name="description"
          content="Discover the latest trends and best deals on MyEcommerce. Shop for electronics, clothing, home goods, books, and more!"
        />
      </Head>
      <Header />
      <main>
        <HeroSection />
        <FeaturedCategories />
        <ProductsSection />
      </main>
      <Footer />
    </>
  );
}
