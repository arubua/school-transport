import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getEnv } from '../utils/env.server';
import { toast } from 'sonner';
import { getAccessToken } from '../utils/storage';

const envVars = getEnv();
const BASE_URL = envVars.VITE_BASE_URL;

const axiosWithBearer = (token: string | null) => {
  const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  });

  return instance;
};

const axiosInstance = async <T>(
  config: AxiosRequestConfig
): Promise<{ res: AxiosResponse<any>; status: number }> => {
  try {
    const accessToken = await getAccessToken();

    const instance = axiosWithBearer(accessToken);
    const res = await instance.request(config);

    return { res, status: res.status };
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        toast.error(error.response.data.message);
        throw new Error(error.response.data.message);
      } else if (error.request) {
        toast.error('Check your Network and try again');
        throw new Error('Network error');
      } else {
        toast.error('An error occurred');
        throw new Error('An error occurred');
      }
    } else {
      // Handle non-Axios errors here
      toast.error('An error occurred');
      throw error;
    }
  }
};

export default axiosInstance;
