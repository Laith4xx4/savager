import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { sessionsApi, bookingsApi } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorAlert } from "@/components/ErrorAlert";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString("ar-SA", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function getDuration(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const minutes = Math.round((endDate.getTime() - startDate.getTime()) / 60000);
  return `${minutes} دقيقة`;
}

export default function Sessions() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookingSessionId, setBookingSessionId] = useState<number | null>(null);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const { data: sessions, isLoading, error, refetch } = useApi(
    () => sessionsApi.getAll()
  );

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const handleBookSession = async (sessionId: number) => {
    if (!isAuthenticated || !user) {
      navigate("/login");
      return;
    }

    // Prevent 'Client' role from booking
    if (user.role === 'Client') {
      toast.error("عذراً، يجب عليك ترقية عضويتك إلى 'عضو' لتتمكن من حجز الجلسات.", {
        action: {
          label: "ترقية",
          onClick: () => navigate("/client?tab=upgrade") // Assuming /client dashboard has upgrade info
        }
      });
      return;
    }

    try {
      setBookingSessionId(sessionId);
      await bookingsApi.bookSession(sessionId);
      toast.success("تم حجز الجلسة بنجاح!");
      await refetch();
    } catch (error) {
      toast.error("فشل حجز الجلسة: " + (error as Error).message);
    } finally {
      setBookingSessionId(null);
    }
  };

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <LoadingSpinner size="lg" text="جاري تحميل الجلسات..." />
        </div>
      </PublicLayout>
    );
  }

  if (error) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-background py-24">
          <div className="container mx-auto px-4">
            <ErrorAlert error={error} title="خطأ في تحميل الجلسات" />
          </div>
        </div>
      </PublicLayout>
    );
  }

  // Filter sessions for selected date
  const filteredSessions = sessions?.filter(session =>
    isSameDay(new Date(session.startTime), selectedDate)
  ) || [];

  return (
    <PublicLayout>
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <section className="relative py-20 pt-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background z-0" />
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              جدول الحصص
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              تصفح جدولنا الأسبوعي واعثر على الصف المثالي لأهداف اللياقة البدنية الخاصة بك
            </p>
          </div>
        </section>

        {/* Week Selector */}
        <section className="py-8 bg-black border-y border-white/5 sticky top-16 z-20 backdrop-blur-md bg-black/80">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <Button variant="ghost" size="icon" onClick={() => setSelectedDate(addDays(selectedDate, -7))} className="text-white hover:bg-white/10">
                <span className="rotate-180">→</span>
              </Button>
              <h2 className="text-lg font-bold text-white">
                {selectedDate.toLocaleDateString("ar-SA", { day: 'numeric', month: 'long', year: 'numeric' })}
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setSelectedDate(addDays(selectedDate, 7))} className="text-white hover:bg-white/10">
                →
              </Button>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x">
              {weekDays.map((day) => {
                const isSelected = isSameDay(day, selectedDate);
                const isToday = isSameDay(day, new Date());

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={`flex-shrink-0 px-6 py-4 rounded-2xl text-center transition-all duration-300 min-w-[110px] snap-center border ${isSelected
                      ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105 font-bold"
                      : "bg-white/5 text-white/60 border-transparent hover:bg-white/10 hover:text-white"
                      } ${isToday && !isSelected ? "border-white/20" : ""}`}
                  >
                    <div className="text-sm font-medium mb-1 opacity-80">
                      {day.toLocaleDateString("ar-SA", { weekday: 'short' })}
                    </div>
                    <div className="text-3xl font-display font-bold">
                      {day.toLocaleDateString("ar-SA", { day: 'numeric' })}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Sessions List */}
        <section className="py-12 min-h-[50vh]">
          <div className="container mx-auto px-4">
            <div className="grid gap-4 max-w-4xl mx-auto">
              {filteredSessions.length > 0 ? (
                filteredSessions.map((session, index) => {
                  const spotsLeft = session.capacity - session.bookingsCount;
                  const isFull = spotsLeft <= 0;

                  return (
                    <div
                      key={session.id}
                      className="group p-6 rounded-3xl bg-zinc-900/40 border border-white/5 hover:border-white/20 hover:bg-zinc-900/80 transition-all duration-300 flex flex-col md:flex-row md:items-center gap-6 animate-fade-in"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      {/* Time Block */}
                      <div className="flex-shrink-0 text-center p-5 rounded-2xl bg-white/5 border border-white/10 min-w-[110px] group-hover:bg-white/10 transition-colors">
                        <div className="text-3xl font-display font-bold text-white mb-1">
                          {formatTime(session.startTime).split(" ")[0]}
                        </div>
                        <div className="text-xs text-white/50 font-medium">
                          {formatTime(session.startTime).split(" ")[1] === 'PM' || formatTime(session.startTime).includes('م') ? 'مساءً' : 'صباحاً'}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-display font-bold text-2xl text-white mb-1 group-hover:text-white/90 transition-colors">
                            {session.sessionName || session.classTypeName}
                          </h3>
                        </div>

                        <p className="text-white/60 text-sm mb-5 flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                            <Users className="h-3 w-3 text-white" />
                          </div>
                          مدرب: <span className="text-white font-medium">{session.coachName}</span>
                        </p>

                        <div className="flex flex-wrap gap-3 text-sm">
                          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 text-white/70 border border-white/5">
                            <Clock className="h-4 w-4" />
                            {getDuration(session.startTime, session.endTime)}
                          </span>
                          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 text-white/70 border border-white/5">
                            <Users className="h-4 w-4" />
                            {session.bookingsCount}/{session.capacity} محجوز
                          </span>
                        </div>
                      </div>

                      {/* Action */}
                      <div className="flex items-center gap-4 border-t border-white/5 pt-5 md:pt-0 md:border-none md:flex-col md:items-end lg:items-center lg:flex-row">
                        {isFull ? (
                          <Badge variant="secondary" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 px-4 py-1.5">مكتمل العدد</Badge>
                        ) : (
                          <span className="text-sm text-green-400 font-medium whitespace-nowrap px-3 py-1 rounded-full bg-green-400/10 border border-green-400/20">
                            {spotsLeft} أماكن متاحة
                          </span>
                        )}
                        <Button
                          onClick={() => handleBookSession(session.id)}
                          disabled={isFull || bookingSessionId === session.id}
                          className="w-full md:w-auto bg-white text-black hover:bg-white/90 font-bold h-10 px-6 rounded-full"
                        >
                          {bookingSessionId === session.id ? 'جاري الحجز...' : (isAuthenticated ? (user?.role === 'Client' ? 'ترقية العضوية للحجز' : 'احجز مكانك') : 'سجل للحجز')}
                        </Button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-white/5 border-dashed">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <Clock className="h-10 w-10 text-white/20" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">لا توجد جلسات</h3>
                  <p className="text-white/50 max-w-md mx-auto">لا توجد جلسات مجدولة في هذا اليوم. <br /> حاول اختيار يوم آخر من الشريط الزمني أعلاه.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
