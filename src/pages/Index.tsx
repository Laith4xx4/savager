import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { CoachesPreviewSection } from "@/components/landing/CoachesPreviewSection";
import { SessionsPreviewSection } from "@/components/landing/SessionsPreviewSection";
import { CTASection } from "@/components/landing/CTASection";

const Index = () => {
  // Redirect logic removed to allow logged-in users to view the landing page
  // Users can access their dashboard via the Navbar link


  return (
    <PublicLayout>
      <HeroSection />
      <FeaturesSection />
      <CoachesPreviewSection />

    </PublicLayout>
  );
};

export default Index;
