export interface Role {
    id: number
    title: string

}



const roles: Role[] = [
    {
        id: 1,
        title: "user"
    },
    {
        id: 2,
        title: "generic"
    },
    {
        id: 3,
        title: "admin"
    }
]



const getAllRoles = () => {

}
const getRole = (id: number) => {

}

export {getAllRoles, getRole}