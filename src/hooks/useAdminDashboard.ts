import { useState, useEffect } from 'react';
import {
    memberProfilesApi,
    coachProfilesApi,
    sessionsApi,
    bookingsApi
} from '@/lib/api';
import {
    MemberProfileResponseDto,
    CoachProfileResponseDto,
    SessionResponseDto,
    BookingResponseDto
} from '@/types';
import { startOfDay, endOfDay, isWithinInterval, subMonths, format, startOfWeek, addDays, getDay, parseISO } from 'date-fns';

export interface AdminDashboardData {
    stats: {
        totalMembers: number;
        totalCoaches: number;
        totalSessions: number;
        totalBookings: number;
        activeMembers: number; // Members with at least one booking
        upcomingSessions: number;
        todaySessionsCount: number;
    };
    charts: {
        memberGrowth: { month: string; members: number }[];
        bookingTrends: { day: string; bookings: number }[];
    };
    lists: {
        recentMembers: MemberProfileResponseDto[];
        todaySessions: SessionResponseDto[];
    };
    loading: boolean;
    error: Error | null;
}

export const useAdminDashboard = () => {
    const [data, setData] = useState<AdminDashboardData>({
        stats: {
            totalMembers: 0,
            totalCoaches: 0,
            totalSessions: 0,
            totalBookings: 0,
            activeMembers: 0,
            upcomingSessions: 0,
            todaySessionsCount: 0,
        },
        charts: {
            memberGrowth: [],
            bookingTrends: [],
        },
        lists: {
            recentMembers: [],
            todaySessions: [],
        },
        loading: true,
        error: null,
    });

    const fetchData = async () => {
        try {
            const [members, coaches, sessions, bookings] = await Promise.all([
                memberProfilesApi.getAll(),
                coachProfilesApi.getAll(),
                sessionsApi.getAll(),
                bookingsApi.getAll(),
            ]);

            // Calculate Stats
            const now = new Date();
            const todayStart = startOfDay(now);
            const todayEnd = endOfDay(now);

            const activeMembers = members.filter(m => m.bookingsCount > 0).length;

            const upcomingSessionsList = sessions.filter(s => new Date(s.startTime) > now);

            const todaySessionsList = sessions.filter(s =>
                isWithinInterval(new Date(s.startTime), { start: todayStart, end: todayEnd })
            );

            // Calculate Member Growth (Last 6 months)
            const memberGrowth = calculateMemberGrowth(members);

            // Calculate Booking Trends (This week)
            const bookingTrends = calculateBookingTrends(bookings);

            // Recent Members (Last 5)
            const recentMembers = [...members]
                .sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime())
                .slice(0, 5);

            setData({
                stats: {
                    totalMembers: members.length,
                    totalCoaches: coaches.length,
                    totalSessions: sessions.length,
                    totalBookings: bookings.length,
                    activeMembers,
                    upcomingSessions: upcomingSessionsList.length,
                    todaySessionsCount: todaySessionsList.length,
                },
                charts: {
                    memberGrowth,
                    bookingTrends,
                },
                lists: {
                    recentMembers,
                    todaySessions: todaySessionsList.slice(0, 5), // Limit to 5 for the dashboard view
                },
                loading: false,
                error: null,
            });

        } catch (error) {
            console.error("Failed to fetch admin dashboard data:", error);
            setData(prev => ({ ...prev, loading: false, error: error as Error }));
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { ...data, refetch: fetchData };
};

// Helpers
function calculateMemberGrowth(members: MemberProfileResponseDto[]) {
    const months: Record<string, number> = {};
    const today = new Date();

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
        const d = subMonths(today, i);
        const key = format(d, 'MMM');
        months[key] = 0;
    }

    // Count accumulated members
    // This is an accumulation chart, so we need to count all members joined BEFORE or DURING that month
    // Simplification: just grouping by join month for accumulation simulation

    // Better approach for growth chart:
    // Sort members by join date
    const sortedMembers = [...members].sort((a, b) => new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime());

    const growthData = [];
    for (let i = 5; i >= 0; i--) {
        const d = subMonths(today, i);
        const monthKey = format(d, 'MMM');
        // Count members joined on or before end of this month
        const endOfMonthDate = new Date(d.getFullYear(), d.getMonth() + 1, 0);

        const count = sortedMembers.filter(m => new Date(m.joinDate) <= endOfMonthDate).length;
        growthData.push({ month: monthKey, members: count });
    }

    return growthData;
}

function calculateBookingTrends(bookings: BookingResponseDto[]) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const startOfCurrentWeek = startOfWeek(today); // Sun

    const trendsResponse = [];

    for (let i = 0; i < 7; i++) {
        const dayDate = addDays(startOfCurrentWeek, i);
        const dayName = format(dayDate, 'EEE');

        const dayStart = startOfDay(dayDate);
        const dayEnd = endOfDay(dayDate);

        const count = bookings.filter(b => {
            // Assuming bookingTime is when the booking was made, or session time? 
            // Usually trends show activity. Let's use bookingTime (creation time) if available, 
            // or session time if bookingTime is not reliable for "activity" but here bookingTime is likely creation.
            // Types says `bookingTime: string`.
            return isWithinInterval(new Date(b.bookingTime), { start: dayStart, end: dayEnd });
        }).length;

        trendsResponse.push({ day: dayName, bookings: count });
    }

    return trendsResponse;
}
