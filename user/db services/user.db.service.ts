import type { Prisma } from "../generated/prisma/client.ts";
import db from "./db.ts";

type UserInput = {
    name: string;
    roleId: number;
};

const userWithRole = {
    role: true,
} satisfies Prisma.UserInclude;

const getAllUsers = () => {
    return db.user.findMany({
        include: userWithRole,
        orderBy: { id: "asc" },
    });
};

const getUser = (id: number) => {
    return db.user.findUnique({
        where: { id },
        include: userWithRole,
    });
};

const createUser = (user: UserInput) => {
    return db.user.create({
        data: {
            name: user.name,
            roleId: user.roleId,
        },
        include: userWithRole,
    });
};

const updateUser = (user: UserInput & { id: number }) => {

    return db.user.update({
        where: { id: user.id },
        data: {
            name: user.name,
            roleId: user.roleId,
        },
        include: userWithRole,
    });
};

const deleteUser = (id: number) => {
    return db.user.deleteMany({
        where: { id },
    });
};

export { getAllUsers, getUser, createUser, updateUser, deleteUser };
