export interface User extends UserWithoutPassword {
  password: string;
}

export interface UserWithoutPassword {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number | null;
}
