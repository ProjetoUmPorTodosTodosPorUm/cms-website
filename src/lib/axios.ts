import axios from 'axios';
import { PUBLIC_API_URL } from '$env/static/public';
import { saveToLocalStorage, getFromLocalStorage } from '$lib/utils/functions';
import type { CustomAxiosInstance } from '$lib/types';

const axiosInstance = axios.create({
    baseURL: PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
}) as CustomAxiosInstance;

// If access token expires, try to refresh and redo request
axiosInstance.interceptors.response.use((res) => res,
    async (error) => {
        if (error instanceof axios.AxiosError) {
            if (error.response?.status === 401) {

                const refreshToken = getFromLocalStorage('refreshToken')
                if (!refreshToken) {
                    throw error;
                }

                try {
                    const response = await axiosInstance
                        .post('/auth/refresh', {}, {
                            headers: {
                                'Authorization': `Bearer ${refreshToken}`
                            }
                        });

                    const { user, accessToken: at, refreshToken: rt } = response.data.data;
                    saveToLocalStorage('accessToken', at)
                    saveToLocalStorage('refreshToken', rt)
                    saveToLocalStorage('tokenValidated', Date.now())
                    axiosInstance.setAuth(at);

                    const originalRequest = error.config;
                    if (originalRequest) {
                        await axiosInstance(originalRequest);
                    }
                } catch (error) {
                    if (error instanceof axios.AxiosError) {
                        saveToLocalStorage('accessToken', null)
                        saveToLocalStorage('refreshToken', null)
                        saveToLocalStorage('user', null)
                        saveToLocalStorage('tokenValidated', null)
                        axiosInstance.setAuth(null);
                        console.warn(error);
                    }
                }
            }
        } else {
            console.warn(error);
        }
        throw error;
    }
);

axiosInstance.setAuth = (token: string | null) => {
    if (token) {
        axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
    } else {
        delete axiosInstance.defaults.headers['Authorization'];
    }
}

export default axiosInstance;