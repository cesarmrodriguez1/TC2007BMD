import {
  API_URL,
} from "../config/api";

import {
  CreateUserRequest,
  UpdateUserRequest,
  User,
} from "../types/User";


export async function getUsers(): Promise<User[]> {
  const response = await fetch(
    `${API_URL}/users`
  );

  if (!response.ok) {
    throw new Error(
      "No fue posible obtener los usuarios"
    );
  }

  return response.json();
}


export async function getUserById(
  id: string
): Promise<User> {
  const response = await fetch(
    `${API_URL}/users/${id}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ??
      "No fue posible obtener el usuario"
    );
  }

  return data;
}


export async function createUser(
  user: CreateUserRequest
): Promise<User> {
  const response = await fetch(
    `${API_URL}/users`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(user),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ??
      "No fue posible registrar el usuario"
    );
  }

  return data;
}


export async function updateUser(
  id: string,
  user: UpdateUserRequest
): Promise<User> {
  const response = await fetch(
    `${API_URL}/users/${id}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(user),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ??
      "No fue posible actualizar el usuario"
    );
  }

  return data;
}


export async function deleteUser(
  id: string
): Promise<void> {
  const response = await fetch(
    `${API_URL}/users/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    let message =
      "No fue posible eliminar el usuario";

    try {
      const data = await response.json();

      if (data.message) {
        message = data.message;
      }
    } catch {
      // La respuesta 204 no contiene JSON.
    }

    throw new Error(message);
  }
}