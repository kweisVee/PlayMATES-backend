import prisma from "../utils/db";

export const createMeetup = async (
    name: string, 
    maxParticipants: number,
    sportId: number, 
    createdBy: number,
    scheduledAt: Date,
    description?: string,
    location?: string
) => {
    console.log("meetupService.ts: createMeetup starting...");
    const meetup = await prisma.meetup.create({
        data: {
            name,
            description,
            maxParticipants,
            sportId,
            createdBy,
            location,
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
    return meetup;
}