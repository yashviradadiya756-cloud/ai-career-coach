import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import InteractiveDashboard from "../components/InteractiveDashboard";
import WhyChooseUs from "../components/WhyChooseUs";
import Testimonials from "../components/Testimonials";
import Pricing from "../components/Pricing";
import Footer from "../components/Footer";
import ContactUs from "./ContactUs";

export default function LandingPage() {
  return (
    <div className="landing-page">
      <Navbar />

      <main className="landing-main">
        <Hero />
        <Features />
        <InteractiveDashboard />
        <WhyChooseUs />
        <Testimonials />
        <Pricing />
        <ContactUs />
      </main>

      <Footer />
    </div>
  );
}