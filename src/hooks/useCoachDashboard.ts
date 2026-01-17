import { useState, useEffect } from 'react';
import {
    coachProfilesApi,
    sessionsApi,
    bookingsApi,
    feedbackApi
} from '@/lib/api';
import {
    SessionResponseDto,
    FeedbackResponseDto,
    CoachProfileResponseDto
} from '@/types';
import { startOfDay, endOfDay, isWithinInterval } from 'date-fns';

export interface CoachDashboardData {
    stats: {
        totalSessions: number;
        upcomingSessions: number;
        totalStudents: number;
        averageRating: number;
    };
    lists: {
        todaySessions: SessionResponseDto[];
        recentReviews: FeedbackResponseDto[];
    };
    coachProfile: CoachProfileResponseDto | null;
    loading: boolean;
    error: Error | null;
}

export const useCoachDashboard = () => {
    const [data, setData] = useState<CoachDashboardData>({
        stats: {
            totalSessions: 0,
            upcomingSessions: 0,
            totalStudents: 0,
            averageRating: 0,
        },
        lists: {
            todaySessions: [],
            recentReviews: [],
        },
        coachProfile: null,
        loading: true,
        error: null,
    });

    const fetchData = async () => {
        try {
            // 1. Get My Coach Profile to know my ID
            const myProfile = await coachProfilesApi.getMyProfile();
            const coachId = myProfile.id;

            // 2. Fetch all related data
            // Optimization: In a real app, backend should filter. Here we filter client-side.
            const [allSessions, allBookings, allFeedbacks] = await Promise.all([
                sessionsApi.getAll(),
                bookingsApi.getAll(),
                feedbackApi.getAll(),
            ]);

            // Filter for this coach
            const mySessions = allSessions.filter(s => s.coachId === coachId);
            const myFeedbacks = allFeedbacks.filter(f => f.coachId === coachId);

            // Calculate Stats
            const now = new Date();
            const todayStart = startOfDay(now);
            const todayEnd = endOfDay(now);

            const upcomingSessionsList = mySessions.filter(s => new Date(s.startTime) > now);

            const todaySessionsList = mySessions.filter(s =>
                isWithinInterval(new Date(s.startTime), { start: todayStart, end: todayEnd })
            );

            // Total Students: unique members who booked sessions with this coach
            // We need to check bookings that belong to mySessions
            const mySessionIds = new Set(mySessions.map(s => s.id));
            const myBookings = allBookings.filter(b => mySessionIds.has(b.sessionId));
            const uniqueStudents = new Set(myBookings.map(b => b.memberId));

            // Average Rating
            const totalRating = myFeedbacks.reduce((sum, f) => sum + f.rating, 0);
            const averageRating = myFeedbacks.length > 0 ? totalRating / myFeedbacks.length : 0;

            // Recent Reviews
            const recentReviews = [...myFeedbacks]
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .slice(0, 5);

            setData({
                stats: {
                    totalSessions: mySessions.length,
                    upcomingSessions: upcomingSessionsList.length,
                    totalStudents: uniqueStudents.size,
                    averageRating: parseFloat(averageRating.toFixed(1)),
                },
                lists: {
                    todaySessions: todaySessionsList,
                    recentReviews,
                },
                coachProfile: myProfile,
                loading: false,
                error: null,
            });

        } catch (error) {
            console.error("Failed to fetch coach dashboard data:", error);
            setData(prev => ({ ...prev, loading: false, error: error as Error }));
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { ...data, refetch: fetchData };
};
