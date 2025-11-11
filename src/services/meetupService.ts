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