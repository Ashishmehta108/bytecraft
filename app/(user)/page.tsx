import FeaturedProducts from "@/components/home/FeaturedProducts";
import { Hero, Footer } from "@/components/home/Hero";
import LoadingContainer from "@/components/global/LoadingContainer";
import { Suspense } from "react";
import AdminCheck from "@/components/home/Admincomp";
import { AnimatedBeamDemo } from "@/components/Techstackcomp";
function HomPage() {
  return (
    <>
      <Hero />
      <Suspense fallback={<LoadingContainer />}>
        <FeaturedProducts />
      </Suspense>
      <AdminCheck />
      <div className="text-center font-semibold text-2xl text-foreground">
        Tech Architecture followed
      </div>
      <AnimatedBeamDemo />
      <Footer />
    </>
  );
}
export default HomPage;
