import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeaturedCategories from "@/components/CategoriesSection";
import ProductsSection from "@/components/ProductsSection";
import { allProducts } from "@/lib/productData";

export default function Home() {
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
