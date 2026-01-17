import { Link } from "react-router-dom";
import { ArrowRight, Users, Calendar, Trophy, Star, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const slides = [
  {
    image: `${import.meta.env.BASE_URL}hero-1.png`,
    badge: "Rated 4.9/5 by 1000+ members",
    title: "Transform Your Body,",
    subtitle: "Elevate Your Life.",
    description: "Join our elite fitness community with world-class coaches, personalized training programs, and state-of-the-art facilities designed for your success.",
  },
  {
    image: `${import.meta.env.BASE_URL}hero-2.png`,
    badge: "Expert Personal Training",
    title: "One-on-One Coaching,",
    subtitle: "Real Results.",
    description: "Work directly with certified professionals who create customized programs tailored to your goals, fitness level, and lifestyle.",
  },
  {
    image: `${import.meta.env.BASE_URL}hero-3.png`,
    badge: "Community & Energy",
    title: "Train Together,",
    subtitle: "Achieve Together.",
    description: "Experience the power of group fitness with high-energy classes that motivate, challenge, and inspire you every session.",
  },
  {
    image: `${import.meta.env.BASE_URL}hero-4.png`,
    badge: "Strength & Power",
    title: "Build Strength,",
    subtitle: "Earn Your Power.",
    description: "Progressive strength training programs designed to push your limits and unlock your full physical potential.",
  },
  {
    image: `${import.meta.env.BASE_URL}hero-5.png`,
    badge: "Cardio Excellence",
    title: "Boost Endurance,",
    subtitle: "Ignite Energy.",
    description: "High-performance cardio workouts that elevate your heart health, burn calories, and build lasting stamina.",
  },
  {
    image: `${import.meta.env.BASE_URL}hero-6.png`,
    badge: "Mind & Body Wellness",
    title: "Find Balance,",
    subtitle: "Discover Peace.",
    description: "Holistic yoga and wellness sessions that nurture your body, calm your mind, and restore your inner balance.",
  },
];

const stats = [
  { icon: Users, value: "1000+", label: "Active Members" },
  { icon: Calendar, value: "50+", label: "Weekly Classes" },
  { icon: Trophy, value: "15+", label: "Expert Coaches" },
  { icon: Star, value: "4.9", label: "Average Rating" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-black">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        speed={2000}
        pagination={{
          clickable: true,
          renderBullet: (index, className) => {
            return `<span class="${className}"><span class="bullet-inner"></span></span>`;
          },
        }}
        loop={true}
        className="absolute inset-0 w-full h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${slide.image})`,
              }}
            >
              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full min-h-screen flex items-center justify-center">
              <div className="container mx-auto px-4 sm:px-6 py-20">
                <div className="max-w-5xl mx-auto text-center">

                  {/* Badge */}
                  <div className="flex justify-center mb-8 animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm">
                      <Star className="h-4 w-4 text-primary fill-primary" />
                      <span className="font-medium">{slide.badge}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h1 className="text-5xl sm:text-6xl lg:text-8xl font-display font-bold text-white leading-[1.1] mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                    {slide.title}
                    <br />
                    <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                      {slide.subtitle}
                    </span>
                  </h1>

                  {/* Description */}
                  <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
                    {slide.description}
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-16 justify-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
                    <Button
                      size="lg"
                      className="text-base h-14 px-8 rounded-full border-2 border-white/30 bg-zinc-900/2 text-white hover:bg-black/20 backdrop-blur-md hover:scale-105 transition-all duration-300 group"
                    >
                      <Link to="/register" className="flex items-center gap-2">
                        Start Your Journey
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="text-base h-14 px-8 rounded-full border-2 border-white/30 bg-zinc-900/2 text-white hover:bg-black/20 backdrop-blur-md hover:scale-105 transition-all duration-300 group"
                    >
                      <Link to="/sessions" className="flex items-center gap-2">
                        <Play className="h-5 w-5" />
                        View Schedule
                      </Link>
                    </Button>
                  </div>

                  {/* Stats */}
               
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Pagination Styles */}
      <style>{`
        .swiper-pagination {
          bottom: 3rem !important;
          left: 50%;
          transform: translateX(-50%);
          width: auto !important;
          display: flex;
          gap: 12px;
          z-index: 20;
        }
        
        .swiper-pagination-bullet {
          width: 48px;
          height: 4px;
          border-radius: 2px;
          background: rgba(255, 255, 255, 0.3);
          opacity: 1;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          margin: 0 !important;
        }

        .bullet-inner {
          position: absolute;
          inset: 0;
          background: white;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .swiper-pagination-bullet-active {
          background: rgba(255, 255, 255, 0.5);
        }

        .swiper-pagination-bullet-active .bullet-inner {
          transform: scaleX(1);
          animation: progress 5000ms linear;
        }

        @keyframes progress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        
        .swiper-pagination-bullet:hover {
          background: rgba(255, 255, 255, 0.5);
          transform: scaleY(1.5);
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
          opacity: 0;
        }

        @media (max-width: 640px) {
          .swiper-pagination {
            bottom: 2rem !important;
          }
          .swiper-pagination-bullet {
            width: 32px;
          }
        }
      `}</style>
    </section>
  );
}
