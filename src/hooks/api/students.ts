import { useQuery,useMutation } from '@tanstack/react-query';


const getStudents = async () => {
  const response = await fetch('/api/students');
  if (!response.ok) {
    throw new Error('Failed to fetch students data');
  }
  const data = await response.json();
  return data;
};

export const useStudents = () => {
  return useQuery(['students'], getStudents);
};