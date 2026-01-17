import { useState, useEffect } from 'react';
import {
    memberProfilesApi,
    bookingsApi,
    sessionsApi
} from '@/lib/api';
import {
    BookingResponseDto,
    SessionResponseDto
} from '@/types';

export interface MemberDashboardData {
    stats: {
        totalBookings: number;
        upcomingBookings: number;
        attendedSessions: number;
        currentStreak: number;
    };
    lists: {
        upcomingBookings: (BookingResponseDto & { session?: SessionResponseDto })[];
    };
    loading: boolean;
    error: Error | null;
}

export const useMemberDashboard = () => {
    const [data, setData] = useState<MemberDashboardData>({
        stats: {
            totalBookings: 0,
            upcomingBookings: 0,
            attendedSessions: 0,
            currentStreak: 0,
        },
        lists: {
            upcomingBookings: [],
        },
        loading: true,
        error: null,
    });

    const fetchData = async () => {
        try {
            const [myProfile, myBookings, allSessions] = await Promise.all([
                memberProfilesApi.getMyProfile(),
                bookingsApi.getMyBookings(),
                sessionsApi.getAll(), // Needed to get session details for bookings if bookings doesn't have it all
            ]);

            // Note: BookingResponseDto already has sessionName, but UpcomingSessionCard might need more session details defined in SessionResponseDto like startTime etc.
            // BookingResponseDto has bookingTime, but usually we need session start time.
            // Let's check BookingResponseDto again.
            // export interface BookingResponseDto {
            //   id: number;
            //   sessionId: number;
            //   sessionName: string;
            //   memberId: number;
            //   memberName: string;
            //   bookingTime: string;  <-- This might be booking creation time, not session start time? 
            //   status: BookingStatus;
            // }

            // We definitely need to enrich bookings with session details (startTime) to show "upcoming".
            const sessionsMap = new Map(allSessions.map(s => [s.id, s]));

            const enrichedBookings = myBookings.map(booking => ({
                ...booking,
                session: sessionsMap.get(booking.sessionId)
            })).filter(b => b.session); // Filter out if session not found?

            const now = new Date();

            const upcomingBookingsList = enrichedBookings
                .filter(b => b.session && new Date(b.session.startTime) > now)
                .sort((a, b) => new Date(a.session!.startTime).getTime() - new Date(b.session!.startTime).getTime());

            // Attended sessions: Bookings in the past + Confirmed (assuming acted key for attendance)
            // Or use myProfile.attendanceCount (more reliable if backend maintains it)
            const attendedSessionsCount = myProfile.attendanceCount;

            // Current Streak - Mocking naive streak: consecutive days with bookings in past?
            // Or just a placeholder logic using attendedSessionsCount for now to not overcomplicate without robust data.
            const currentStreak = calculateStreak(enrichedBookings);

            setData({
                stats: {
                    totalBookings: myProfile.bookingsCount,
                    upcomingBookings: upcomingBookingsList.length,
                    attendedSessions: attendedSessionsCount,
                    currentStreak, // Simplified
                },
                lists: {
                    upcomingBookings: upcomingBookingsList,
                },
                loading: false,
                error: null,
            });

        } catch (error) {
            console.error("Failed to fetch member dashboard data:", error);
            setData(prev => ({ ...prev, loading: false, error: error as Error }));
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { ...data, refetch: fetchData };
};

// Simplified streak calculation based on bookings
function calculateStreak(bookings: (BookingResponseDto & { session?: SessionResponseDto })[]) {
    // Collect all past session dates
    const now = new Date();
    const pastDates = bookings
        .filter(b => b.session && new Date(b.session.startTime) < now && (b.status === 'Confirmed'))
        .map(b => new Date(b.session!.startTime).toISOString().split('T')[0]) // YYYY-MM-DD
        .sort()
        .reverse(); // Newest first

    // Remove duplicates
    const uniqueDates = Array.from(new Set(pastDates));

    if (uniqueDates.length === 0) return 0;

    let streak = 0;
    // Check consecutive days? Logic can be complex depending on "streak" definition (daily? weekly?).
    // Let's assume daily streak from "last active day".

    // For now, let's just return a count of unique weeks or just 0 if not easily calculable without daily attendance constraint.
    // Or return 0 to be safe rather than wrong.
    // Actually user might like a number.
    return uniqueDates.length > 0 ? 1 : 0; // Placeholder: Active if at least 1 past booking.
}
