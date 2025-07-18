"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Instagram,
  Twitter,
  Facebook,
  Mail,
  Phone,
  MapPin,
  Heart,
  Leaf,
  Shield,
  Truck,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import HeroCarousel from "./HeroCarousel";
import Logo from "../navbar/Logo";
const AnimatedText = ({ text }: { text: string }) => {
  return (
    <span className="sm:inline ">
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15, delay: index * 0.05 }}
          className="inline "
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
};
export function Hero() {
  return (
    <section className="relative container  mx-auto grid grid-cols-1  lg:grid-cols-2 p-0 lg:gap-12 items-center overflow-hidden -translate-y-10 max-w-7xl ">
      <motion.div
        className="space-y-6 relative container max-w-xl mx-auto "
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="flex items-center space-x-2 mb-2">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-xs">
            Discover Something Different
          </span>
        </div>

        <motion.h1
          className="max-w-2xl container mx-auto font-bold text-3xl md:text-5xl xl:text-6xl tracking-tight leading-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.span
            className="text-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.8,
              staggerChildren: 0.1,
            }}
          >
            <AnimatedText text="Elevate Your Everyday" />
          </motion.span>
          <br />
          <motion.span
            className="bg-gradient-to-br from-neutral-900 to-neutral-400 dark:from-neutral-200 to-neutral-700 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            With Thoughtful Design
          </motion.span>
        </motion.h1>

        <motion.p
          className="max-w-xl text-sm leading-5 text-muted-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          We curate beautiful, functional products that make life simpler and
          more enjoyable. From home essentials to personal accessories, each
          item is thoughtfully crafted with sustainability and style in mind.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 pt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Button
            asChild
            size="lg"
            className="px-8 group bg-indigo-600  hover:bg-indigo-700 dark:text-white  relative overflow-hidden"
          >
            <Link href="/products" className="flex z-50 items-center">
              Shop Collection
              <div className="ml-2">
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="group ">
            <Link href="/about" className="flex items-center">
              Our Story
              <div className="ml-1">
                <ChevronRight className="h-4 w-4" />
              </div>
            </Link>
          </Button>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          className="flex flex-wrap gap-6 items-center pt-8 opacity-70"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.7, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <span className="text-xs font-medium uppercase tracking-wider">
            As Featured In
          </span>
          <div className="flex flex-wrap gap-6">
            <span className="font-semibold">Design Week</span>
            <span className="font-semibold">Vogue</span>
            <span className="font-semibold">Apartment Therapy</span>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className=" max-w-8xl "
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="relative  w-[82%] h-[80%] mx-auto">
          <HeroCarousel />
          <motion.div
            className=" absolute hidden lg:block bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            New Collection
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

const FooterLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <motion.a
    href={href}
    className="text-muted-foreground hover:text-primary transition-colors duration-200 group flex items-center"
    whileHover={{ x: 2 }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.a>
);

export  function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-background border-t pt-10 border-border/40">
      {/* Newsletter Section */}
      <motion.div
        className="bg-gradient-to-r from-primary/5 to-primary/10 py-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <motion.h3
            className="text-2xl md:text-3xl font-bold mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <AnimatedText text="Stay in the Know" />
          </motion.h3>
          <motion.p
            className="text-muted-foreground mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Be the first to discover new collections, exclusive offers, and
            design inspiration. Join our community of thoughtful living
            enthusiasts.
          </motion.p>
          <motion.form
            onSubmit={handleSubscribe}
            className="flex flex-col items-center sm:flex-row gap-4 max-w-md mx-auto"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              required
            />
            <Button
              type="submit"
              className="px-6 bg-primary hover:bg-primary/90 group"
              disabled={isSubscribed}
            >
              {isSubscribed ? "Subscribed!" : "Subscribe"}
              {!isSubscribed && (
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              )}
            </Button>
          </motion.form>
        </div>
      </motion.div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-6 pt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
               <Logo/>
              </div>
              <h3 className="text-xl font-bold">Bytecraft</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Thoughtfully curated products that bring beauty and function to
              your everyday life. Sustainable design meets modern living.
            </p>
            <div className="flex space-x-4 pt-2">
              <motion.a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Instagram className="h-5 w-5" />
              </motion.a>
              <motion.a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Twitter className="h-5 w-5" />
              </motion.a>
              <motion.a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Facebook className="h-5 w-5" />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-foreground">Shop</h4>
            <div className="space-y-3">
              <FooterLink href="/products">All Products</FooterLink>
              <FooterLink href="#">Home & Living</FooterLink>
              <FooterLink href="#">Accessories</FooterLink>
              <FooterLink href="#">New Arrivals</FooterLink>
              <FooterLink href="#">Sale</FooterLink>
            </div>
          </motion.div>

          {/* Company */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-foreground">Company</h4>
            <div className="space-y-3">
              <FooterLink href="#">About Us</FooterLink>
              <FooterLink href="#">Sustainability</FooterLink>
              <FooterLink href="#">Careers</FooterLink>
              <FooterLink href="#">Press</FooterLink>
              <FooterLink href="#">Contact</FooterLink>
            </div>
          </motion.div>

          {/* Support */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-foreground">Support</h4>
            <div className="space-y-3">
              <FooterLink href="#">Help Center</FooterLink>
              <FooterLink href="#">Shipping Info</FooterLink>
              <FooterLink href="#">Returns</FooterLink>
              <FooterLink href="#">Size Guide</FooterLink>
              <FooterLink href="#">Care Instructions</FooterLink>
            </div>
            <div className="pt-4 space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="h-4 w-4 mr-2" />
                hello@Bytecraft.com
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="h-4 w-4 mr-2" />
                1-800-bytecraft
              </div>
            </div>
          </motion.div>
        </div>

        {/* Trust Badges */}
        <motion.div
          className="flex flex-wrap justify-center gap-8 items-center py-12 mt-12 border-t border-border/40"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Leaf className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium">Eco-Friendly</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Shield className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium">Secure Checkout</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Truck className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium">Free Shipping</span>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center pt-8 mt-8 border-t border-border/40 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <p>&copy; 2025 Bytecraft. All rights reserved.</p>
          <div className="flex flex-wrap gap-6 mt-4 md:mt-0">
            <FooterLink href="#">Privacy Policy</FooterLink>
            <FooterLink href="#">Terms of Service</FooterLink>
            <FooterLink href="#">Cookie Policy</FooterLink>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
