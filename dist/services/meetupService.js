"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveMeetup = exports.joinMeetup = exports.updateMeetup = exports.getMeetup = exports.getUserJoinedMeetups = exports.getUserHostedMeetups = exports.getAllMeetups = exports.createMeetup = void 0;
const db_1 = __importDefault(require("../utils/db"));
const createMeetup = async (title, maxParticipants, sportId, createdBy, scheduledAt, updatedBy, description, location, city, state, sportIcon, sportColor, skillLevel) => {
    console.log("meetupService.ts: createMeetup starting...");
    const meetup = await db_1.default.meetup.create({
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
};
exports.createMeetup = createMeetup;
const getAllMeetups = async () => {
    console.log("meetupService.ts: getAllMeetups starting...");
    const now = new Date();
    // we want to get all meetups that are scheduled to start 15 mins before the current time
    // and onwards
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);
    return await db_1.default.meetup.findMany({
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
    });
};
exports.getAllMeetups = getAllMeetups;
const getUserHostedMeetups = async (userId) => {
    console.log("meetupService.ts: getUserHostedMeetups starting...");
    return await db_1.default.meetup.findMany({
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
    });
};
exports.getUserHostedMeetups = getUserHostedMeetups;
const getUserJoinedMeetups = async (userId) => {
    console.log("meetupService.ts: getUserJoinedMeetups starting...");
    return await db_1.default.meetupParticipant.findMany({
        where: {
            userId,
            meetup: {
                createdBy: {
                    not: userId
                }
            }
        },
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
    });
};
exports.getUserJoinedMeetups = getUserJoinedMeetups;
const getMeetup = async (meetupId) => {
    console.log("meetupService.ts: getMeetup starting...");
    return await db_1.default.meetup.findUnique({
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
};
exports.getMeetup = getMeetup;
const updateMeetup = async (meetupId, updatedBy, title, description, maxParticipants, sportId, scheduledAt, location, city, state, sportIcon, sportColor, skillLevel) => {
    console.log("meetupService.ts: updateMeetup starting...");
    // Build update data object with proper typing
    const updateData = {
        updatedBy, // Always required
    };
    // Conditionally add fields if they're provided
    if (title !== undefined)
        updateData.title = title;
    if (description !== undefined)
        updateData.description = description;
    if (maxParticipants !== undefined)
        updateData.maxParticipants = maxParticipants;
    if (sportId !== undefined)
        updateData.sportId = sportId;
    if (scheduledAt !== undefined)
        updateData.scheduledAt = scheduledAt;
    if (location !== undefined)
        updateData.location = location;
    if (city !== undefined)
        updateData.city = city;
    if (state !== undefined)
        updateData.state = state;
    if (sportIcon !== undefined)
        updateData.sportIcon = sportIcon;
    if (sportColor !== undefined)
        updateData.sportColor = sportColor;
    if (skillLevel !== undefined)
        updateData.skillLevel = skillLevel;
    return await db_1.default.meetup.update({
        where: { id: meetupId },
        data: updateData,
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
};
exports.updateMeetup = updateMeetup;
const joinMeetup = async (meetupId, userId) => {
    console.log("meetupService.ts: joinMeetup starting...");
    // Check if meetup exists
    const meetup = await (0, exports.getMeetup)(meetupId);
    if (!meetup) {
        throw new Error("Meetup not found");
    }
    // Check if user is already a participant
    const existingParticipant = await db_1.default.meetupParticipant.findUnique({
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
    const participantCount = await db_1.default.meetupParticipant.count({
        where: { meetupId }
    });
    if (participantCount >= meetup.maxParticipants) {
        throw new Error("Meetup is full");
    }
    // Add user as participant
    await db_1.default.meetupParticipant.create({
        data: {
            userId,
            meetupId
        }
    });
    // Return updated meetup with participants
    return await db_1.default.meetup.findUnique({
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
};
exports.joinMeetup = joinMeetup;
const leaveMeetup = async (meetupId, userId) => {
    console.log("meetupService.ts: leaveMeetup starting...");
    // Check if meetup exists
    const meetup = await (0, exports.getMeetup)(meetupId);
    if (!meetup) {
        throw new Error("Meetup not found");
    }
    // Check if user is the creator (creators shouldn't leave, they should cancel)
    if (meetup.createdBy === userId) {
        throw new Error("Meetup creators cannot leave their own meetup. Please cancel the meetup instead.");
    }
    // Check if user is a participant
    const participant = await db_1.default.meetupParticipant.findUnique({
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
    await db_1.default.meetupParticipant.delete({
        where: {
            userId_meetupId: {
                userId,
                meetupId
            }
        }
    });
    // Return updated meetup with participants
    return await db_1.default.meetup.findUnique({
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
};
exports.leaveMeetup = leaveMeetup;
