import { useState, useEffect } from 'react';
import {
    memberProfilesApi,
    bookingsApi,
    sessionsApi
} from '@/lib/api';
import {
    BookingResponseDto,
    BookingStatus
} from '@/types';
import { subMonths, format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, startOfMonth, endOfMonth } from 'date-fns';

export interface Achievement {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    iconType: 'Zap' | 'Award' | 'Flame' | 'Target' | 'TrendingUp';
}

export interface MemberProgressData {
    stats: {
        totalSessions: number; // Total Booked
        attendedSessions: number; // Total Attended (Past + Confirmed)
        currentStreak: number;
        longestStreak: number;
        attendanceRate: number;
        totalBookings: number;
        attendedCount: number;
        cancelledCount: number;
        noShowCount: number;
    };
    charts: {
        monthlyActivity: { month: string; sessions: number }[];
        weeklyProgress: { week: string; sessions: number; goal: number }[];
        classBreakdown: { name: string; count: number; color: string }[];
    };
    achievements: Achievement[];
    loading: boolean;
    error: Error | null;
}

export const useMemberProgress = () => {
    const [data, setData] = useState<MemberProgressData>({
        stats: {
            totalSessions: 0,
            attendedSessions: 0,
            currentStreak: 0,
            longestStreak: 0,
            attendanceRate: 0,
            totalBookings: 0,
            attendedCount: 0,
            cancelledCount: 0,
            noShowCount: 0,
        },
        charts: {
            monthlyActivity: [],
            weeklyProgress: [],
            classBreakdown: [],
        },
        achievements: [],
        loading: true,
        error: null,
    });

    const fetchData = async () => {
        try {
            const [myProfile, myBookings, allSessions] = await Promise.all([
                memberProfilesApi.getMyProfile(),
                bookingsApi.getMyBookings(),
                sessionsApi.getAll(),
            ]);

            const sessionsMap = new Map(allSessions.map(s => [s.id, s]));

            // 1. Calculate Stats
            const totalBookings = myBookings.length;
            const cancelledCount = myBookings.filter(b => b.status === BookingStatus.Cancelled).length;

            // Assume "Attended" if Confirmed and in the past, or if we had an explicit AttendanceStatus. 
            // Using Confirmed + Past for now.
            const now = new Date();
            const attendedBookings = myBookings.filter(b => {
                const session = sessionsMap.get(b.sessionId);
                if (!session) return false;
                return b.status === BookingStatus.Confirmed && new Date(session.startTime) < now;
            });

            const attendedCount = attendedBookings.length;
            const totalSessions = totalBookings; // Or just attended? UI says "out of X booked"
            const noShowCount = totalBookings - attendedCount - cancelledCount; // Rough estimate
            const attendanceRate = totalBookings > 0 ? (attendedCount / totalBookings) * 100 : 0;

            // 2. Streaks
            const datesAttended = attendedBookings
                .map(b => sessionsMap.get(b.sessionId)?.startTime)
                .filter(d => d)
                .map(d => new Date(d!).toISOString().split('T')[0])
                .sort();

            const uniqueDates = Array.from(new Set(datesAttended));
            const { currentStreak, longestStreak } = calculateStreaks(uniqueDates);

            // 3. Charts
            // Monthly Activity (Last 6 months)
            const monthlyActivity = calculateMonthlyActivity(attendedBookings, sessionsMap);

            // Weekly Progress (Last 4 weeks)
            const weeklyProgress = calculateWeeklyProgress(attendedBookings, sessionsMap);

            // Class Breakdown
            const classBreakdown = calculateClassBreakdown(attendedBookings, sessionsMap);

            // 4. Achievements
            const achievements: Achievement[] = [
                {
                    id: 1,
                    title: 'First Session',
                    description: 'Complete your first session',
                    completed: attendedCount >= 1,
                    iconType: 'Zap'
                },
                {
                    id: 2,
                    title: '10 Sessions',
                    description: 'Complete 10 sessions',
                    completed: attendedCount >= 10,
                    iconType: 'Award'
                },
                {
                    id: 3,
                    title: 'Week Warrior',
                    description: '7-day streak',
                    completed: longestStreak >= 7,
                    iconType: 'Flame'
                },
                {
                    id: 4,
                    title: 'Month Master',
                    description: '30-day streak',
                    completed: longestStreak >= 30,
                    iconType: 'Target'
                },
                {
                    id: 5,
                    title: 'Century Club',
                    description: 'Complete 100 sessions',
                    completed: attendedCount >= 100,
                    iconType: 'TrendingUp'
                },
            ];

            setData({
                stats: {
                    totalSessions,
                    attendedSessions: attendedCount,
                    currentStreak,
                    longestStreak,
                    attendanceRate: parseFloat(attendanceRate.toFixed(1)),
                    totalBookings,
                    attendedCount,
                    cancelledCount,
                    noShowCount: Math.max(0, noShowCount),
                },
                charts: {
                    monthlyActivity,
                    weeklyProgress,
                    classBreakdown,
                },
                achievements,
                loading: false,
                error: null,
            });

        } catch (error) {
            console.error("Failed to fetch member progress data:", error);
            setData(prev => ({ ...prev, loading: false, error: error as Error }));
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { ...data, refetch: fetchData };
};

// Calculations Helpers

function calculateStreaks(sortedDates: string[]) {
    if (sortedDates.length === 0) return { currentStreak: 0, longestStreak: 0 };

    let current = 0;
    let longest = 0;
    let streak = 0;

    // Naive daily streak from dates
    // Need to check consecutiveness
    // dates are YYYY-MM-DD

    for (let i = 0; i < sortedDates.length; i++) {
        if (i === 0) {
            streak = 1;
        } else {
            const prev = new Date(sortedDates[i - 1]);
            const curr = new Date(sortedDates[i]);
            const diffTime = Math.abs(curr.getTime() - prev.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                streak++;
            } else {
                streak = 1;
            }
        }
        longest = Math.max(longest, streak);
    }

    // Current Streak logic: check if last date is today or yesterday
    const lastDate = new Date(sortedDates[sortedDates.length - 1]);
    const today = new Date();
    const diffToToday = Math.ceil(Math.abs(today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    // If last activity was today (0) or yesterday (1), current streak is valid. Else 0.
    // Note: diffDays calculation might be off by fraction, so standardizing to midnight is safer. But simple approach:
    // If > 2 days gap, streak broken.
    if (diffToToday <= 2) {
        current = streak;
    } else {
        current = 0;
    }

    return { currentStreak: current, longestStreak: longest };
}

function calculateMonthlyActivity(bookings: BookingResponseDto[], sessionsMap: Map<number, any>) {
    const monthsData: Record<string, number> = {};
    const today = new Date();

    // Init last 6 months
    for (let i = 5; i >= 0; i--) {
        const d = subMonths(today, i);
        const k = format(d, 'MMM');
        monthsData[k] = 0;
    }

    bookings.forEach(b => {
        const session = sessionsMap.get(b.sessionId);
        if (session) {
            const d = new Date(session.startTime);
            // Only count if within last 6 months window approx
            const k = format(d, 'MMM');
            if (monthsData[k] !== undefined) {
                monthsData[k]++;
            }
        }
    });

    return Object.keys(monthsData).map(k => ({ month: k, sessions: monthsData[k] }));
}

function calculateWeeklyProgress(bookings: BookingResponseDto[], sessionsMap: Map<number, any>) {
    // Last 4 weeks relative to now
    // This is a bit complex to visualize "Week 1", "Week 2". Usually users want specific dates.
    // We'll just bucket into 4 buckets.

    const today = new Date();
    const weeks = [];

    // Create 4 week buckets backwards
    for (let i = 3; i >= 0; i--) {
        // Logic: Start of current week minus i weeks
        // Actually typically "Week 1" is oldest or newest? Charts usually go left-to-right (Old -> New).
        // So let's make stats for [3 weeks ago, 2 weeks ago, 1 week ago, This week]
        const d = subMonths(today, 0); // Just dummy base
        // Real calculation:
        // We want strictly last 4 weeks.
        // Let's rely on simple date diffs
    }

    // Simplified: static labels for now to match UI, but real counts
    // Count sessions in [Today-28d, Today-21d), [Today-21d, Today-14d), ...
    const data = [];
    for (let i = 3; i >= 0; i--) {
        const start = new Date(today.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
        const end = new Date(today.getTime() - i * 7 * 24 * 60 * 60 * 1000);

        const count = bookings.filter(b => {
            const s = sessionsMap.get(b.sessionId);
            if (!s) return false;
            const t = new Date(s.startTime);
            return t >= start && t < end;
        }).length;

        data.push({ week: `Week ${4 - i}`, sessions: count, goal: 4 }); // Mock goal 4
    }
    return data;
}

function calculateClassBreakdown(bookings: BookingResponseDto[], sessionsMap: Map<number, any>) {
    const counts: Record<string, number> = {};
    bookings.forEach(b => {
        const s = sessionsMap.get(b.sessionId);
        if (s) {
            const name = s.classTypeName || s.sessionName;
            counts[name] = (counts[name] || 0) + 1;
        }
    });

    const colors = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

    return Object.keys(counts).map((name, idx) => ({
        name,
        count: counts[name],
        color: colors[idx % colors.length]
    })).sort((a, b) => b.count - a.count).slice(0, 5);
}
