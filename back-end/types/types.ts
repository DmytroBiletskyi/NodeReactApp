import { Optional } from 'sequelize';

export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    position_id: number;
    photo: string;
}
    
export interface UserCreationAttributes extends Optional<User, 'id'> {}

export interface Position {
    id: number;
    name: string;
}