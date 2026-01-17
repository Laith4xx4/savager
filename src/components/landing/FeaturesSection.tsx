import { Dumbbell, Clock, Users, TrendingUp, Heart, Zap } from "lucide-react";

const features = [
  {
    icon: Dumbbell,
    title: "تدريب احترافي",
    description: "تدرب مع محترفين معتمدين يصممون برامج مخصصة لأهدافك الشخصية.",
  },
  {
    icon: Clock,
    title: "جدول مرن",
    description: "احجز جلسات تناسب نمط حياتك بسهولة من خلال نظام الحجز المتطور لدينا.",
  },
  {
    icon: Users,
    title: "مجتمع داعم",
    description: "انضم إلى مجتمع محفز من عشاق اللياقة البدنية الذين يشاركونك نفس الشغف.",
  },
  {
    icon: TrendingUp,
    title: "تتبع تقدمك",
    description: "راقب إنجازاتك من خلال تحليلات مفصلة وتقارير دورية عن أدائك.",
  },
  {
    icon: Heart,
    title: "نهج شامل",
    description: "من القوة إلى المرونة، نغطي جميع جوانب رحلتك نحو اللياقة البدنية.",
  },
  {
    icon: Zap,
    title: "نتائج سريعة",
    description: "شاهد تحولاً حقيقياً مع منهجيات التدريب المثبتة لدينا.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-black border-y border-white/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 blur-3xl rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-white/60 font-medium tracking-wider text-sm uppercase mb-3 block">
            لماذا نحن؟
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 text-white">
            لماذا تختار <span className="text-white/50">The Savage</span>؟
          </h2>
          <p className="text-white/60 text-lg leading-relaxed">
            نقدم تجربة لياقة بدنية شاملة مصممة لمساعدتك على تحقيق أهدافك بشكل أسرع وأكثر فعالية من خلال التكنولوجيا والخبرة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-8 rounded-3xl bg-zinc-900/40 border border-white/5 hover:border-white/20 hover:bg-zinc-900/60 transition-all duration-300 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                <feature.icon className="h-7 w-7 text-white group-hover:text-black transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-display font-bold mb-3 text-white group-hover:text-white transition-colors">
                {feature.title}
              </h3>
              <p className="text-white/50 leading-relaxed group-hover:text-white/70 transition-colors">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
