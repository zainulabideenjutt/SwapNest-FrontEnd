"use client";
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeaturedCategories from "@/components/CategoriesSection";
import ProductsSection from "@/components/ProductsSection";
import ProtectedRoute from '@/components/ProtectedRoute';
export default function Home() {
  return (
    <>
      <ProtectedRoute>
        <Header />
        <main>
          <HeroSection />
          <FeaturedCategories />
          <ProductsSection />
        </main>
        <Footer />
      </ProtectedRoute>
    </>
  );
}
