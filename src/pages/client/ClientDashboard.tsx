
import { Link } from "react-router-dom";
import { Dumbbell, Calendar, Users, ArrowRight, Star, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicLayout } from "@/components/layout/PublicLayout";

export default function ClientDashboard() {
    return (
        <PublicLayout>
            <div className="min-h-screen bg-black text-white">
                {/* Hero Section */}
                <section className="relative py-24 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/hero-1.png')] bg-cover bg-center opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/90 to-black" />

                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm mb-6 backdrop-blur-md">
                            مرحباً بك في The Savage
                        </span>
                        <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
                            ابدأ رحلتك نحو <span className="text-white/50">الأفضل</span>
                        </h1>
                        <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
                            لقد قمت بالخطوة الأولى بإنشاء حسابك. استكشف ما نقدمه لك وكيف يمكننا مساعدتك في تحقيق أهدافك البدنية والصحية.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild size="lg" className="bg-white text-black hover:bg-white/90 font-bold h-14 px-8 rounded-full text-lg">
                                <Link to="/sessions">تصفح الجلسات</Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 h-14 px-8 rounded-full text-lg">
                                <Link to="/coaches">تعرف على المدربين</Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="py-20 bg-zinc-900/30 border-y border-white/5">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-display font-bold mb-4">لماذا نحن؟</h2>
                            <p className="text-white/60">نقدم لك تجربة متكاملة تتجاوز مجرد "نادي رياضي"</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-white/20 transition-all group">
                                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Dumbbell className="h-7 w-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">تدريب احترافي</h3>
                                <p className="text-white/50 leading-relaxed">
                                    احصل على برامج تدريبية مخصصة من مدربين معتمدين وخبراء في مجالاتهم.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-white/20 transition-all group">
                                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Calendar className="h-7 w-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">مرونة في الحجز</h3>
                                <p className="text-white/50 leading-relaxed">
                                    نظام حجز سهل ومرن يتيح لك اختيار الأوقات التي تناسب جدولك المزدحم.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-white/20 transition-all group">
                                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Users className="h-7 w-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">مجتمع شغوف</h3>
                                <p className="text-white/50 leading-relaxed">
                                    انضم إلى مجتمع يدعم بعضه البعض ويتشارك نفس الأهداف والشغف.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Steps Section */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                                    كيف تبدأ؟
                                </h2>
                                <div className="space-y-8">
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold">1</div>
                                        <div>
                                            <h4 className="text-xl font-bold mb-2">أكمل ملفك الشخصي</h4>
                                            <p className="text-white/60">أضف معلوماتك الصحية وأهدافك لنتمكن من مساعدتك بشكل أفضل.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-zinc-800 text-white flex items-center justify-center font-bold border border-white/20">2</div>
                                        <div>
                                            <h4 className="text-xl font-bold mb-2">اشترك في عضوية</h4>
                                            <p className="text-white/60">اختر الباقة التي تناسب احتياجاتك لتتمكن من حجز الجلسات.</p>

                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-zinc-800 text-white flex items-center justify-center font-bold border border-white/20">3</div>
                                        <div>
                                            <h4 className="text-xl font-bold mb-2">احجز أول جلسة</h4>
                                            <p className="text-white/60">تصفح الجدول واحجز جلستك الأولى مع أحد مدربينا.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <Button className="gap-2 bg-white text-black hover:bg-white/90">
                                        ترقية العضوية الآن <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent rounded-3xl blur-2xl" />
                                <div className="bg-zinc-900 border border-white/10 p-8 rounded-3xl relative">
                                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                        <ShieldCheck className="h-6 w-6 text-green-400" />
                                        مزايا العضوية
                                    </h3>
                                    <ul className="space-y-4">
                                        {["دخول غير محدود للصالة", "جلسات تدريب جماعية مجانية", "تتبع تقدم ذكي", "خصومات خاصة على المنتجات", "استشارة مجانية مع خبير تغذية"].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-white/70">
                                                <Star className="h-4 w-4 text-white fill-white/20" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
