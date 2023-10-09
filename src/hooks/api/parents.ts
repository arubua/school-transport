import { useQuery } from '@tanstack/react-query';

const getParents = async () => {
  const response = await fetch('/api/parents');
  if (!response.ok) {
    throw new Error('Failed to fetch parents data');
  }
  const data = await response.json();
  return data;
};

export const useParents = () => {
  return useQuery(['parents'], getParents);
};


const getParentById = async (parentId : string) => {
  const response = await fetch(`/api/parents/${parentId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch parent data');
  }
  const data = await response.json();
  return data;
};

export const useParentById = (parentId : string) => {
  return useQuery(['parent', parentId], () => getParentById(parentId));
};

import { useMutation } from '@tanstack/react-query';

import { useMutation } from '@tanstack/react-query';

// Specify the types for parentId and updatedData
const updateParentById = async (
  parentId: string, // Assuming parentId is a string, adjust the type accordingly
  updatedData: Record<string, any> // Assuming updatedData is an object, adjust the type accordingly
) => {
  const response = await fetch(`/api/parents/${parentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error);
  }

  const data = await response.json();
  return data;
};

export const useUpdateParent = () => {
  return useMutation(updateParentById, {
    mutationKey: 'updateParent',
  });
};



const createParent = async (newData) => {
  const response = await fetch('/api/parents', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newData),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error);
  }

  const data = await response.json();
  return data;
};

export const useCreateParent = () => {
  return useMutation(createParent);
};




