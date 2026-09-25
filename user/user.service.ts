import type { Role } from "./role.service.ts"
import {v4 as uid} from 'uuid'

import { getAllRoles, getRole} from './role.service.ts'

interface User{
    id?: string
    name : string
    roleId: number
    role?: Role
}



let users: User[] = [
    {
        id: uid(),
        name: "Mad Max",
        roleId: 1
    },
    {
        id: uid(),
        name: "Sane Seline",
        roleId: 1
    },
    {
        id: uid(),
        name: "Generic Gerald",
        roleId: 2
    },
    {
        id: uid(),
        name: "Admin Axl",
        roleId: 3
    },
]

const fetchRoles = () => {
    users.forEach(u => {
            u.role = getRole(u.roleId);
        });
}

const getAllUsers = () => {

    fetchRoles()

    return users
}

const getUser = (id: string) => {

    fetchRoles()

    const u = getAllUsers().find(u => u.id === id)

    if(u == undefined){
        return null
    }

    u.role = getRole(u.roleId)
    return u;
}

const createUser = (user: User) => {
    user.id = uid();
    users = [...users, user]
    fetchRoles()
    return getAllUsers()

}

const updateUser = (user: User) => {

    const index = getAllUsers().findIndex((u) => u.id === user.id)

    users[index] = user

    fetchRoles();
    return getAllUsers();
}

const deleteUser = (id: String) => {

    const index = users.findIndex(u => u.id === id)

    if(index < 0){
        return
    }

    users.splice(index, 1)
    
    fetchRoles();
    return getAllUsers();
}


export {getAllUsers, getUser, createUser, updateUser, deleteUser}