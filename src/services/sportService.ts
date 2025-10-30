import prisma from "../utils/db";

export const createSport = async (
    name: string, 
    createdBy: number,
    definition?: string, 
    imageUrl?: string,
    category?: string, 
    isActive: boolean = true
) => {
    console.log("sportService: createSport starting...");
    const sport = await prisma.sport.create({
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

export const getAllSports = async () => {
    console.log("sportService: getAllSports Starting...");

    return await prisma.sport.findMany({
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
}