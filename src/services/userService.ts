import prisma from '../utils/db';
import bcrypt from 'bcrypt';

export const createUser = async (
    firstName: string, 
    lastName: string,
    username: string, 
    email: string, 
    password: string, 
    city: string, 
    state: string,
    country: string,
    role: string
) => {
    console.log("userService: createUser starting...");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            firstName,
            lastName,
            username,
            email,
            role: role === 'ADMIN' ? 'ADMIN' : 'USER',
            password: hashedPassword,
            city,
            state,
            country
        }
    });
    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        city: user.city,
        state: user.state,
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

export const getUserProfile = async (userId: number) => {

    console.log("userService: getUserProfile Starting...");

    return await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            city: true,
            state: true,
            country: true,
            createdAt: true,
        },
    });
};

export const signInUser = async (email: string, password: string) => {
    
    console.log("userService: signInUser starting...");
    
    const user = await prisma.user.findUnique({
        where: { email }
    });
    if (!user) {
        return 'Invalid Credentials';
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return 'Invalid Credentials';
    } else {
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            city: user.city,
            state: user.state,
            country: user.country,
            createdAt: user.createdAt,
        };
    }
};