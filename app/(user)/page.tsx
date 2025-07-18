import FeaturedProducts from '@/components/home/FeaturedProducts';
import {Hero,Footer} from '@/components/home/Hero';
import LoadingContainer from '@/components/global/LoadingContainer';
import { Suspense } from 'react';
function HomPage() {
  return (
    <>
      <Hero />
      <Suspense fallback={<LoadingContainer />}>
        <FeaturedProducts />
      </Suspense>
      <Footer/>
    </>
  );
}
export default HomPage;