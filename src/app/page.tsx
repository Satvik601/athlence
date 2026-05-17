import { Nav } from '@/components/layout/Nav';
import { StickyEarlyAccess } from '@/components/layout/StickyEarlyAccess';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/hero/Hero';
import { Vision } from '@/components/vision/Vision';
import { BlazeShowcase } from '@/components/blaze/BlazeShowcase';
import { Culture } from '@/components/culture/Culture';
import { Community } from '@/components/community/Community';
import { Founder } from '@/components/founder/Founder';
import { FutureProducts } from '@/components/future/FutureProducts';

/*
 * Brief §4 + §5 — Homepage composition. Sections in exact spec order.
 *
 * RSC by default; sections that need client interactivity declare 'use client'
 * inside. This keeps initial JS shipping under the brief §8 budget of 200KB.
 */
export default function HomePage() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />              {/* 5.1 */}
        <Vision />            {/* 5.2 — #movement */}
        <BlazeShowcase />     {/* 5.3 — #blaze */}
        <Culture />           {/* 5.4 — #culture */}
        <Community />         {/* 5.5 + 5.7 — #community + IG feed embedded */}
        <Founder />           {/* 5.6 — #story */}
        <FutureProducts />    {/* 5.8 */}
      </main>
      <Footer />              {/* 5.9 */}
      <StickyEarlyAccess />
    </>
  );
}
