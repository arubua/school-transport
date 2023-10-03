// src/hooks/useLogin.ts
import { useMutation } from '@tanstack/react-query'

const login = async ({ username, password }: { username: string; password: string }) => {
  // Replace this with your actual login API request.
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error);
  }

  return response.json();
};

export const useLogin = () => {
  return useMutation(login);
};
