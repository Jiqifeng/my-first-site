import { Hero } from "@/components/Hero";
import { ProductA } from "@/components/products/ProductA";
import { ProductB } from "@/components/products/ProductB";
import { ProductC } from "@/components/products/ProductC";

export default function Home() {
  return (
    <main className="min-h-screen bg-surface">
      <Hero />
      <ProductA />
      <ProductB />
      <ProductC />
    </main>
  );
}
