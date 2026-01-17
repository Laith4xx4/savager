import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star, Search, User, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { coachProfilesApi, usersApi } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorAlert } from "@/components/ErrorAlert";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


export default function Coaches() {
  const [search, setSearch] = useState("");
  const [selectedSpec, setSelectedSpec] = useState("All");
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const { data: profiles, isLoading: profilesLoading, error: profilesError } = useApi(
    () => coachProfilesApi.getAll(),
    { autoFetch: true }
  );

  // We only fetch users if authenticated to get extra details, but main list comes from profiles
  const { data: users } = useApi(
    () => usersApi.getAll(),
    { autoFetch: isAuthenticated }
  );

  const isLoading = profilesLoading;
  const error = profilesError;

  // Map directly from profiles since they represent the public coach directory
  const coaches = profiles?.map(profile => {
    // Try to find matching user for extra info if available
    const user = users?.find(u => u.userName === profile.userName);
    return {
      id: profile.id, // Use profile ID
      userName: profile.userName,
      specialization: profile.specialization,
      bio: profile.bio,
      certifications: profile.certifications,
      sessionsCount: profile.sessionsCount,
      feedbacksCount: profile.feedbacksCount
    };
  }) || [];

  // Extract unique specializations
  const specializations = coaches
    ? ["All", ...Array.from(new Set(coaches.map((c) => c.specialization)))]
    : ["All"];

  const filteredCoaches = coaches?.filter((coach) => {
    const matchesSearch =
      coach.userName.toLowerCase().includes(search.toLowerCase()) ||
      coach.specialization.toLowerCase().includes(search.toLowerCase()) ||
      coach.bio.toLowerCase().includes(search.toLowerCase());
    const matchesSpec = selectedSpec === "All" || coach.specialization === selectedSpec;
    return matchesSearch && matchesSpec;
  }) || [];


  if (isLoading) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <LoadingSpinner size="lg" text="جاري تحميل المدربين..." />
        </div>
      </PublicLayout>
    );
  }

  if (error) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-background py-24">
          <div className="container mx-auto px-4">
            <ErrorAlert error={error} title="خطأ في تحميل المدربين" />
            <div className="text-center mt-4">
              <Button onClick={() => navigate("/login")}>
                تسجيل الدخول
              </Button>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <section className="relative py-20 pt-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background z-0" />
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              مدربونا الخبراء
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              تعرف على فريقنا من المحترفين المعتمدين المكرسين لمساعدتك في تحقيق أهداف اللياقة البدنية
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 border-b border-border/10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ابحث عن مدربين..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-secondary border-none text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {specializations.map((spec) => (
                  <Button
                    key={spec}
                    variant={selectedSpec === spec ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setSelectedSpec(spec)}
                    className={selectedSpec === spec ? "bg-white text-black hover:bg-white/90" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}
                  >
                    {spec === "All" ? "الكل" : spec}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Coaches Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {filteredCoaches.length === 0 ? (
              <div className="text-center py-12">
                <User className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-20" />
                <p className="text-muted-foreground text-lg">لم يتم العثور على مدربين</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCoaches.map((coach, index) => (
                  <Link
                    key={coach.id}
                    to={`/coaches/${coach.id}`}
                    className="group block animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="bg-secondary/30 border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
                      <div className="aspect-[4/3] bg-gradient-to-br from-secondary to-background flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/20" />
                        <span className="text-6xl font-display font-bold text-white/10 relative z-10">
                          {coach.userName.substring(0, 2).toUpperCase()}
                        </span>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-display font-bold text-white group-hover:text-primary transition-colors">
                            {coach.userName}
                          </h3>
                          {coach.certifications && (
                            <span className="text-xs bg-white/10 text-white px-2 py-1 rounded-full border border-white/10">
                              معتمد
                            </span>
                          )}
                        </div>

                        <p className="text-white/60 text-sm font-medium mb-4">
                          {coach.specialization}
                        </p>

                        <p className="text-muted-foreground text-sm line-clamp-2 mb-4 h-10">
                          {coach.bio}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4 border-t border-white/5">
                          <span className="flex items-center gap-1.5">
                            <Star className="h-4 w-4 fill-white/10" />
                            {coach.sessionsCount} جلسة
                          </span>
                          <span className="flex items-center gap-1.5">
                            💬 {coach.feedbacksCount} تقييم
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
