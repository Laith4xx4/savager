import { Link } from "react-router-dom";
import { Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data - will be replaced with API data
const coaches = [
  {
    id: "1",
    fullName: "Alex Johnson",
    specialization: "Strength & Conditioning",
    bio: "10+ years of experience in professional fitness coaching.",
    profilePictureUrl: null,
    averageRating: 4.9,
    totalReviews: 128,
  },
  {
    id: "2",
    fullName: "Sarah Williams",
    specialization: "Yoga & Flexibility",
    bio: "Certified yoga instructor with holistic wellness approach.",
    profilePictureUrl: null,
    averageRating: 4.8,
    totalReviews: 95,
  },
  {
    id: "3",
    fullName: "Mike Chen",
    specialization: "HIIT & Cardio",
    bio: "Former athlete specializing in high-intensity training.",
    profilePictureUrl: null,
    averageRating: 4.9,
    totalReviews: 156,
  },
];

export function CoachesPreviewSection() {
  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
          <div className="text-center md:text-right">
            <span className="text-white/60 font-medium tracking-wider text-sm uppercase mb-2 block">
              فريقنا المحترف
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
              تعرف على <span className="text-white/50">مدربينا الخبراء</span>
            </h2>
            <p className="text-white/60 text-lg max-w-xl">
              نخبة من المدربين المعتمدين والمحترفين، مكرسون لمساعدتك في تحقيق أقصى إمكاناتك وبناء جسمك المثالي.
            </p>
          </div>
          <Button variant="outline" asChild className="h-12 px-8 rounded-full border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300 group">
            <Link to="/coaches" className="flex items-center gap-2">
              عرض جميع المدربين
              <ArrowRight className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coaches.map((coach, index) => (
            <Link
              key={coach.id}
              to={`/coaches/${coach.id}`}
              className="group block animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden hover:border-white/20 hover:bg-zinc-900 transition-all duration-500 hover:-translate-y-2 group">
                {/* Avatar Placeholder */}
                <div className="aspect-[4/5] bg-gradient-to-br from-zinc-800 to-black relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-8xl font-display font-bold text-white/5 group-hover:text-white/10 transition-colors duration-500 transform scale-150 relative z-0">
                      {coach.fullName.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>

                  {/* Overlay Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent pt-20">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`h-3.5 w-3.5 ${s <= Math.round(coach.averageRating) ? "fill-white text-white" : "fill-white/10 text-white/10"}`} />
                        ))}
                      </div>
                      <span className="text-white/60 text-xs text-medium">({coach.totalReviews} تقييم)</span>
                    </div>

                    <h3 className="text-2xl font-display font-bold text-white mb-1 group-hover:text-white transition-colors">
                      {coach.fullName}
                    </h3>
                    <p className="text-white/60 text-sm font-medium mb-3 uppercase tracking-wider">{coach.specialization}</p>
                    <p className="text-white/40 text-sm line-clamp-2 leading-relaxed">{coach.bio}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
