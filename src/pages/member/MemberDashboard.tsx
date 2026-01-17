import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { UpcomingSessionCard } from '@/components/dashboard/UpcomingSessionCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Flame, Target, TrendingUp, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMemberDashboard } from '@/hooks/useMemberDashboard';

export default function MemberDashboard() {
  const { stats, lists, loading } = useMemberDashboard();

  if (loading) {
    return (
      <DashboardLayout role="Member">
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="Member">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back!</h1>
          <p className="text-muted-foreground mt-1">Here's your fitness overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Bookings"
            value={stats.totalBookings}
            icon={<Calendar className="h-6 w-6" />}
          />
          <StatsCard
            title="Upcoming Sessions"
            value={stats.upcomingBookings}
            icon={<Target className="h-6 w-6" />}
          />
          <StatsCard
            title="Sessions Attended"
            value={stats.attendedSessions}
            icon={<TrendingUp className="h-6 w-6" />}
          />
          <StatsCard
            title="Current Streak"
            value={`${stats.currentStreak} days`}
            icon={<Flame className="h-6 w-6" />}
          />
        </div>

        {/* Upcoming Sessions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming Sessions</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/member/bookings" className="flex items-center gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {lists.upcomingBookings.length > 0 ? (
              lists.upcomingBookings.map((booking) => (
                booking.session ? (
                  <UpcomingSessionCard
                    key={booking.id}
                    session={booking.session}
                    showCancelButton
                    onCancel={() => console.log('Cancel booking not implemented in dashboard view')}
                  />
                ) : null
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No upcoming sessions</p>
                <Button className="mt-4" asChild>
                  <Link to="/member/sessions">Browse Sessions</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <Link to="/member/sessions">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Book a Session</h3>
                  <p className="text-sm text-muted-foreground">Find and book your next class</p>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <Link to="/member/progress">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">View Progress</h3>
                  <p className="text-sm text-muted-foreground">Track your fitness journey</p>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <Link to="/coaches">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Our Coaches</h3>
                  <p className="text-sm text-muted-foreground">Meet our expert trainers</p>
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
