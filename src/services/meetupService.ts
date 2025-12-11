import { Prisma, SkillLevel } from "@prisma/client";
import prisma from "../utils/db";

// Model for updating a meetup
export type UpdateMeetupData = {
    updatedBy: number; // Required - always set
    title?: string;
    description?: string;
    maxParticipants?: number;
    sportId?: number;
    scheduledAt?: Date;
    location?: string;
    city?: string;
    state?: string;
    sportIcon?: string;
    sportColor?: string;
    skillLevel?: SkillLevel;
}

export const createMeetup = async (
    title: string, 
    maxParticipants: number,
    sportId: number, 
    createdBy: number,
    scheduledAt: Date,
    updatedBy: number,
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
            updatedBy,
            location,
            city,
            state,
            sportIcon,
            sportColor,
            skillLevel,
            scheduledAt,
            // Automatically add the creator as a participant
            participants: {
                create: {
                    userId: createdBy
                }
            }
        },
        include: {
            creator: {
                select: {
                    id: true,
                    username: true,
                    firstName: true,
                    lastName: true
                }
            },
            sport: {
                select: {
                    id: true, 
                    name: true
                }
            },
            participants: {
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            firstName: true,
                            lastName: true
                        }
                    }
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
    })
}

export const getUserHostedMeetups = async (userId: number) => {
    console.log("meetupService.ts: getUserHostedMeetups starting...");
    return await prisma.meetup.findMany({
        where: {
            createdBy: userId
        },
        orderBy: {
            scheduledAt: 'desc' // Most recent scheduled date first
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
    })
}

export const getUserJoinedMeetups = async (userId: number) => {
    console.log("meetupService.ts: getUserJoinedMeetups starting...");
    return await prisma.meetupParticipant.findMany({
        where: { userId },
        include: {
            meetup: {
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
            }
        },
        orderBy: {
            meetup: {
                scheduledAt: 'desc'
            }
        }
    })
}

export const getMeetup = async (meetupId: number) => {
    console.log("meetupService.ts: getMeetup starting...");
    return await prisma.meetup.findUnique({
        where: { id: meetupId },
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
}

export const updateMeetup = async (
    meetupId: number,
    updatedBy: number,
    title?: string,
    description?: string,
    maxParticipants?: number,
    sportId?: number,
    scheduledAt?: Date,
    location?: string,
    city?: string,
    state?: string,
    sportIcon?: string,
    sportColor?: string,
    skillLevel?: SkillLevel
) => {
    console.log("meetupService.ts: updateMeetup starting...");
    
    // Build update data object with proper typing
    const updateData: UpdateMeetupData = {
        updatedBy, // Always required
    };

    // Conditionally add fields if they're provided
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (maxParticipants !== undefined) updateData.maxParticipants = maxParticipants;
    if (sportId !== undefined) updateData.sportId = sportId;
    if (scheduledAt !== undefined) updateData.scheduledAt = scheduledAt;
    if (location !== undefined) updateData.location = location;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (sportIcon !== undefined) updateData.sportIcon = sportIcon;
    if (sportColor !== undefined) updateData.sportColor = sportColor;
    if (skillLevel !== undefined) updateData.skillLevel = skillLevel;

    return await prisma.meetup.update({
        where: { id: meetupId },
        data: updateData as Prisma.MeetupUpdateInput,
        include: {
            creator: {
                select: {
                    id: true,
                    username: true,
                    firstName: true, 
                    lastName: true
                }
            },
            sport: {
                select: {
                    id: true,
                    name: true
                }
            },
            updater: {
                select: {
                    id: true,
                    username: true
                }
            }
        }
    });
}

export const joinMeetup = async (meetupId: number, userId: number) => {
    console.log("meetupService.ts: joinMeetup starting...");
    
    // Check if meetup exists
    const meetup = await getMeetup(meetupId);
    if (!meetup) {
        throw new Error("Meetup not found");
    }
    
    // Check if user is already a participant
    const existingParticipant = await prisma.meetupParticipant.findUnique({
        where: {
            userId_meetupId: {
                userId,
                meetupId
            }
        }
    });
    
    if (existingParticipant) {
        throw new Error("User is already a participant in this meetup");
    }
    
    // Check if meetup is full
    const participantCount = await prisma.meetupParticipant.count({
        where: { meetupId }
    });
    
    if (participantCount >= meetup.maxParticipants) {
        throw new Error("Meetup is full");
    }
    
    // Add user as participant
    await prisma.meetupParticipant.create({
        data: {
            userId,
            meetupId
        }
    });
    
    // Return updated meetup with participants
    return await prisma.meetup.findUnique({
        where: { id: meetupId },
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
            },
            participants: {
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            firstName: true,
                            lastName: true
                        }
                    }
                }
            }
        }
    });
}

export const leaveMeetup = async (meetupId: number, userId: number) => {
    console.log("meetupService.ts: leaveMeetup starting...");
    
    // Check if meetup exists
    const meetup = await getMeetup(meetupId);
    if (!meetup) {
        throw new Error("Meetup not found");
    }
    
    // Check if user is the creator (creators shouldn't leave, they should cancel)
    if (meetup.createdBy === userId) {
        throw new Error("Meetup creators cannot leave their own meetup. Please cancel the meetup instead.");
    }
    
    // Check if user is a participant
    const participant = await prisma.meetupParticipant.findUnique({
        where: {
            userId_meetupId: {
                userId,
                meetupId
            }
        }
    });
    
    if (!participant) {
        throw new Error("User is not a participant in this meetup");
    }
    
    // Remove user as participant
    await prisma.meetupParticipant.delete({
        where: {
            userId_meetupId: {
                userId,
                meetupId
            }
        }
    });
    
    // Return updated meetup with participants
    return await prisma.meetup.findUnique({
        where: { id: meetupId },
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
            },
            participants: {
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            firstName: true,
                            lastName: true
                        }
                    }
                }
            }
        }
    });
}