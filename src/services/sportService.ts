import prisma from "../utils/db";
import bcrypt from 'bcrypt';

export const createSport = async (
    name: string, 
    createdBy: number,
    definition?: string
) => {
    console.log("sportService.ts: createSport starting...");
    const sport = await prisma.sport.create({
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
}