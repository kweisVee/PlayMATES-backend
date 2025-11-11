"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllSports = exports.getSportByName = exports.getSport = exports.createSport = void 0;
const db_1 = __importDefault(require("../utils/db"));
const createSport = async (name, createdBy, definition, imageUrl, category, isActive = true) => {
    console.log("sportService: createSport starting...");
    const sport = await db_1.default.sport.create({
        data: {
            name,
            definition,
            imageUrl,
            category,
            isActive,
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
const getSport = async (sportId) => {
    console.log("sportService: getSport Starting...");
    return await db_1.default.sport.findUnique({
        where: { id: sportId },
        include: {
            creator: {
                select: {
                    id: true,
                    username: true
                }
            }
        }
    });
};
exports.getSport = getSport;
const getSportByName = async (name) => {
    console.log("sportService: getSportByName Starting...");
    return await db_1.default.sport.findUnique({
        where: { name },
        include: {
            creator: {
                select: {
                    id: true,
                    username: true
                }
            }
        }
    });
};
exports.getSportByName = getSportByName;
const getAllSports = async () => {
    console.log("sportService: getAllSports Starting...");
    return await db_1.default.sport.findMany({
        where: { isActive: true },
        include: {
            creator: {
                select: {
                    id: true,
                    username: true
                }
            }
        },
        orderBy: {
            name: 'asc'
        }
    });
};
exports.getAllSports = getAllSports;
