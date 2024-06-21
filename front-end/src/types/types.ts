export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    position_id: number;
    photo: string;
}
  
export interface Position {
    id: number;
    name: string;
}

export interface UserListProps {
    users: User[];
    loadMoreUsers: () => void;
    hasMoreUsers: boolean;
    positions: Position[];
}

export interface UserFormProps {
    positions: Position[];
    addUser: (user: FormData) => void;
}