import { useMutation } from '@tanstack/react-query'
import { getEnv } from '../../utils/env.server'
import axios, { AxiosError } from 'axios'

const envVars = getEnv()
const BASE_URL = envVars.VITE_BASE_URL

const login = async ({
  username,
  password,
  remember_user,
}: {
  username: string;
  password: string;
  remember_user: boolean;
}) => {
  try {
    const response = await axios.post(
      `${BASE_URL}auth/login`,
      { username, password },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Check if the response status is in the range 200-299
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    // Access response data
    const data = response.data;

    return data;
  } catch (error:any) {
    // Handle errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response error:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up the request:', error.message);
    }

    throw error; // Rethrow the error to propagate it up the call stack
  }
};


export const useLogin = () => {
	return useMutation(login)
}

const signUp = async ({
	name,
	address,
	email,
	phone_number,
	contact_person,
	contact_person_phone,
}: {
	name: string
	address: string
	email: string
	phone_number: string
	contact_person: string
	contact_person_phone: string
}) => {
	try {
		const response = await axios.post(
		  `${BASE_URL}auth/school-signup`,
		  {
			name,
			address,
			email,
			phone_number,
			contact_person,
			contact_person_phone,
		},
		  {
			headers: {
			  'Content-Type': 'application/json',
			},
		  }
		);
	
		// Check if the response status is in the range 200-299
		if (response.status < 200 || response.status >= 300) {
		  throw new Error(`Request failed with status ${response.status}`);
		}
	
		// Access response data
		const data = response.data;
	
		return data;
	  } catch (error:any) {
		// Handle errors
		if (error.response) {
		  // The request was made and the server responded with a status code
		  // that falls out of the range of 2xx
		  console.error('Response error:', error.response.data);
		} else if (error.request) {
		  // The request was made but no response was received
		  console.error('No response received:', error.request);
		} else {
		  // Something happened in setting up the request that triggered an Error
		  console.error('Error setting up the request:', error.message);
		}
	
		throw error; // Rethrow the error to propagate it up the call stack
	  }
}

export const useSignUp = () => {
	return useMutation(signUp)
}
