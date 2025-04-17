import prisma from '../utils/db';
import bcrypt from 'bcrypt';

export const createUser = async (
    firstName: string, 
    lastName: string,
    username: string, 
    email: string, 
    password: string, 
    city: string, 
    country: string
) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword,
            city,
            country
        }
    });
    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        city: user.city,
        country: user.country,
        createdAt: user.createdAt,
    };
}

export const getUsers = async () => {
    return await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        city: true,
        country: true,
        createdAt: true,
      },
    });
  };