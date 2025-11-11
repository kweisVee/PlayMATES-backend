"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMeetup = void 0;
const db_1 = __importDefault(require("../utils/db"));
const createMeetup = async (title, maxParticipants, sportId, createdBy, scheduledAt, description, location, city, state, sportIcon, sportColor, skillLevel) => {
    console.log("meetupService.ts: createMeetup starting...");
    const meetup = await db_1.default.meetup.create({
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
};
exports.createMeetup = createMeetup;
