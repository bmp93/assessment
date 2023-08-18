export interface User {
    id?: number;
    firstName: string;
    lastName: string;
    gender: string;
    status?: string;
}

export interface UserListResponse extends User {
    users: User[];
    totalUsers: number
}


