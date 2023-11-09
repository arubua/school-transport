import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

const axiosWithBearer = (token: string) => {
  const instance = axios.create({
    baseURL: process.env.VITE_BASE_URL, 
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json', 
    },
  });

  return instance;
};

const api = axiosWithBearer('your_bearer_token_here');

const useAxios = async <T>(
  config: AxiosRequestConfig
): Promise<{ res: AxiosResponse<T>; status: number }> => {
  try {
    const res = await api(config);
    return { res, status: res.status };
  } catch (error:any) {
    if (error.response) {
      throw new Error(error.response.data);
    } else if (error.request) {
      throw new Error('Network error');
    } else {
      throw new Error('An error occurred');
    }
  }
};

export default useAxios