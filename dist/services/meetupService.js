"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMeetup = void 0;
const db_1 = __importDefault(require("../utils/db"));
const createMeetup = async (name, maxParticipants, sportId, createdBy, scheduledAt, description, location) => {
    console.log("meetupService.ts: createMeetup starting...");
    const meetup = await db_1.default.meetup.create({
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
};
exports.createMeetup = createMeetup;
