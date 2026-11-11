import type { Prisma } from "../generated/prisma/client.ts";
import db from "./db.ts";

type UserInput = {
    id?: number;
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

const updateUser = (user: UserInput) => {
    if (!user.id) {
        return Promise.reject(new Error("Cannot update a user without an id"));
    }

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
    return db.user.delete({
        where: { id },
    });
};

const exists = (user: UserInput | number): Promise<boolean> => {
    const id = typeof user === "number" ? user : user.id;

    if (!id) {
        return Promise.resolve(false);
    }

    return db.user.count({ where: { id } }).then(count => count > 0);
};

export { getAllUsers, getUser, createUser, updateUser, deleteUser, exists };
