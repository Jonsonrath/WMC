import db from "./db.ts";

const getAllRoles = () => {
    return db.role.findMany({
        orderBy: { id: "asc" },
    });
};

const getRole = (id: number) => {
    return db.role.findUnique({
        where: { id },
    });
};

export { getAllRoles, getRole };
