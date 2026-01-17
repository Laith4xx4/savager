import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Dumbbell, Calendar, ClipboardList, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';

export default function AdminDashboard() {
  const { stats, lists, charts, loading } = useAdminDashboard();

  if (loading) {
    return (
      <DashboardLayout role="Admin">
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="Admin">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your fitness center</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Members"
            value={stats.totalMembers}
            icon={<Users className="h-6 w-6" />}
          />
          <StatsCard
            title="Active Coaches"
            value={stats.totalCoaches}
            icon={<Dumbbell className="h-6 w-6" />}
          />
          <StatsCard
            title="Today's Sessions"
            value={stats.todaySessionsCount}
            icon={<Calendar className="h-6 w-6" />}
          />
          <StatsCard
            title="Total Bookings"
            value={stats.totalBookings}
            icon={<ClipboardList className="h-6 w-6" />}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Member Growth */}
          <Card>
            <CardHeader>
              <CardTitle>Member Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={charts.memberGrowth}>
                    <defs>
                      <linearGradient id="memberGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="members"
                      stroke="hsl(var(--primary))"
                      fill="url(#memberGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Booking Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Booking Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={charts.bookingTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="bookings"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Sessions & Recent Members */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Sessions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Today's Sessions</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/sessions" className="flex items-center gap-1">
                  View All <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lists.todaySessions.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No sessions scheduled for today.</p>
                ) : (
                  lists.todaySessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-border hover:border-primary/30 transition-colors"
                    >
                      <div>
                        <h4 className="font-medium text-foreground">{session.sessionName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {session.coachName} • {format(new Date(session.startTime), 'hh:mm a')}
                        </p>
                      </div>
                      <Badge variant={session.bookingsCount >= session.capacity ? 'destructive' : 'secondary'}>
                        {session.bookingsCount}/{session.capacity}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Members */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Members</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/members" className="flex items-center gap-1">
                  View All <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lists.recentMembers.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No recent members found.</p>
                ) : (
                  lists.recentMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-border hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                          {(member.firstName?.[0] || member.userName[0]).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">
                            {member.firstName && member.lastName ? `${member.firstName} ${member.lastName}` : member.userName}
                          </h4>
                          {/* Since email is not directly on MemberProfileResponseDto (it's on UserDto), we fallback or omit if not joined. 
                                However, often backend returns flat structure. Checking Types: MemberProfileResponseDto has no email. 
                                It has userName. We'll use userName or ignore email.
                            */}
                          <p className="text-sm text-muted-foreground">Joined {format(new Date(member.joinDate), 'MMM d')}</p>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <Link to="/admin/members">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 mx-auto text-primary mb-2" />
                <h3 className="font-semibold text-foreground">Manage Members</h3>
              </CardContent>
            </Link>
          </Card>
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <Link to="/admin/coaches">
              <CardContent className="p-6 text-center">
                <Dumbbell className="h-8 w-8 mx-auto text-primary mb-2" />
                <h3 className="font-semibold text-foreground">Manage Coaches</h3>
              </CardContent>
            </Link>
          </Card>
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <Link to="/admin/sessions">
              <CardContent className="p-6 text-center">
                <Calendar className="h-8 w-8 mx-auto text-primary mb-2" />
                <h3 className="font-semibold text-foreground">Manage Sessions</h3>
              </CardContent>
            </Link>
          </Card>
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <Link to="/admin/bookings">
              <CardContent className="p-6 text-center">
                <ClipboardList className="h-8 w-8 mx-auto text-primary mb-2" />
                <h3 className="font-semibold text-foreground">View Bookings</h3>
              </CardContent>
            </Link>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
