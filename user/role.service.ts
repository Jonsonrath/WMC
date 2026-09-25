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
    return roles
}
const getRole = (id: number) => {

    const role = roles.find((r)=> r.id == id)

    return role
}

export {getAllRoles, getRole}