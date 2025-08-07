export type User = {
    id: number;
    name: string;
    email: string;
    createdAt: string;
};

export interface UserCreate {
    name: string;
    email: string;
    password: string;
}