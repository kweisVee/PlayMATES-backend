import prisma from "../utils/db";

export const createSport = async (
    name: string, 
    createdBy: number,
    definition?: string
) => {
    console.log("sportService: createSport starting...");
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

export const getSport = async (sportId: number) => {
    console.log("sportService: getSport Starting...");

    return await prisma.sport.findUnique({
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