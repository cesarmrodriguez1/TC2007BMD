export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  createdAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  phone: string;
  age: number;
}