import React from 'react'
import { getAllUsers, getUser } from '~/appwrite/auth'
import { getTripsByTravelStyle, getUserGrowthPerDay, getUsersAndTripsStats } from '~/appwrite/dashboard'
import { getAllTrips } from '~/appwrite/trips'
import { parseTripData } from '~/lib/utils'
import type { Route } from './+types/dashboard'
import Header from 'components/Header'

export const clientLoader = async () => {
    const [
        user,
        dashboardStats,
        trips,
        userGrowth,
        tripsByTravelStyle,
        allUsers,
    ] = await Promise.all([
        await getUser(),
        await getUsersAndTripsStats(),
        await getAllTrips(4, 0),
        await getUserGrowthPerDay(),
        await getTripsByTravelStyle(),
        await getAllUsers(4, 0),
    ])

    const allTrips = trips.allTrips.map(({ $id, tripDetails, imageUrls }) => ({
        id: $id,
        ...parseTripData(tripDetails),
        imageUrls: imageUrls ?? []
    }))

    const mappedUsers: UsersItineraryCount[] = allUsers.users.map((user) => ({
        imageUrl: user.imageUrl,
        name: user.name,
        count: user.itineraryCount ?? Math.floor(Math.random() * 10),
    }))
}

const dashboard = ({loaderData}: Route.ComponentProps) => {
    const user = loaderData?.user as User | null;
    const { dashboardStats, allTrips, userGrowth, tripsByTravelStyle, allUsers } = loaderData;

    const trips = allTrips.map((trip) => ({
        imageUrl: trip.imageUrls[0],
        name: trip.name,
        interest: trip.interests,
    }))

    const usersAndTrips = [
        {
            title: 'Latest user signups',
            dataSource: allUsers,
            field: 'count',
            headerText: 'Trips created'
        },
        {
            title: 'Trips based on interests',
            dataSource: trips,
            field: 'interest',
            headerText: 'Interests'
        }
    ]
  return (
    <main className='dashboard wrapper'>
        <Header
            title={`Welcome ${user?.name ?? 'Guest'} 👋`}
            description="Track activity, trends and popular destinations in real time"
        />
    </main>
  )
}

export default dashboard;