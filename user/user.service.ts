import type { Role } from "./role.service.ts"
import {v4 as uid} from 'uuid'

interface User{
    id: string
    name : string
    roleId: string
    role: Role
}



const users: User[] = [
    {
        id: uid(),
        name: "Mad Max"
    }
]