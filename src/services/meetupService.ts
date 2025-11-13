import { SkillLevel } from "@prisma/client";
import prisma from "../utils/db";

export const createMeetup = async (
    title: string, 
    maxParticipants: number,
    sportId: number, 
    createdBy: number,
    scheduledAt: Date,
    description?: string,
    location?: string,
    city?: string,
    state?: string,
    sportIcon?: string,
    sportColor?: string,
    skillLevel?: SkillLevel
) => {
    console.log("meetupService.ts: createMeetup starting...");
    const meetup = await prisma.meetup.create({
        data: {
            title,
            description,
            maxParticipants,
            sportId,
            createdBy,
            location,
            city,
            state,
            sportIcon,
            sportColor,
            skillLevel,
            scheduledAt
        },
        include: {
            creator: {
                select: {
                    id: true,
                    username: true
                }
            },
            sport: {
                select: {
                    id: true, 
                    name: true
                }
            }
        }
    });
    console.log("meetupService.ts: meetup created:", meetup);
    return meetup;
}

export const getAllMeetups = async () => {
    console.log("meetupService.ts: getAllMeetups starting...");
    const now = new Date();
    // we want to get all meetups that are scheduled to start 15 mins before the current time
    // and onwards
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);
    
    return await prisma.meetup.findMany({
        where: {
            scheduledAt: {
                gte: fifteenMinutesAgo
            }
        }
    })
}

export const getUserMeetups = async (userId: number) => {
    console.log("meetupService.ts: getUserMeetups starting...");
    return await prisma.meetup.findMany({
        where: {
            createdBy: userId
        },
        include: {
            sport: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    })
}