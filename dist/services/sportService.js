"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSport = void 0;
const db_1 = __importDefault(require("../utils/db"));
const createSport = async (name, createdBy, definition) => {
    console.log("sportService.ts: createSport starting...");
    const sport = await db_1.default.sport.create({
        data: {
            name,
            definition,
            createdBy
        },
        include: {
            creator: {
                select: {
                    id: true,
                    username: true
                }
            }
        }
    });
    return sport;
};
exports.createSport = createSport;
