import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { UpcomingSessionCard } from '@/components/dashboard/UpcomingSessionCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Users, Star, ArrowRight, Clock, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useCoachDashboard } from '@/hooks/useCoachDashboard';

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`h-4 w-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
          }`}
      />
    ))}
  </div>
);

export default function CoachDashboard() {
  const { stats, lists, loading } = useCoachDashboard();

  if (loading) {
    return (
      <DashboardLayout role="Coach">
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="Coach">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Coach Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your sessions and track performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Sessions"
            value={stats.totalSessions}
            icon={<Calendar className="h-6 w-6" />}
          />
          <StatsCard
            title="Upcoming Sessions"
            value={stats.upcomingSessions}
            icon={<Clock className="h-6 w-6" />}
          />
          <StatsCard
            title="Total Students"
            value={stats.totalStudents}
            icon={<Users className="h-6 w-6" />}
          />
          <StatsCard
            title="Average Rating"
            value={stats.averageRating}
            icon={<Star className="h-6 w-6" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Sessions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Today's Sessions</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/coach/sessions" className="flex items-center gap-1">
                  View All <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {lists.todaySessions.length > 0 ? (
                lists.todaySessions.map((session) => (
                  <UpcomingSessionCard
                    key={session.id}
                    session={session}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No sessions scheduled for today</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Reviews */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Reviews</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/coach/reviews" className="flex items-center gap-1">
                  View All <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lists.recentReviews.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No recent reviews.</p>
                ) : (
                  lists.recentReviews.map((review) => (
                    <div
                      key={review.id}
                      className="p-4 rounded-xl border border-border hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          {/* Assuming review has member info if extended, but FeedbackResponseDto has memberName only. */}
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {review.memberName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-foreground">{review.memberName}</span>
                            <StarRating rating={review.rating} />
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{review.comments}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(review.timestamp), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <Link to="/coach/sessions">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">My Sessions</h3>
                  <p className="text-sm text-muted-foreground">View and manage your scheduled sessions</p>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <Link to="/coach/attendance">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Take Attendance</h3>
                  <p className="text-sm text-muted-foreground">Mark attendance for your sessions</p>
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
