import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000/api';

const instance: AxiosInstance = axios.create({
	baseURL: API_BASE_URL,
	withCredentials: true,
});

let isRefreshing = false;

instance.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
        if (error.response?.status === 401 && !originalRequest._retry && !isRefreshing) {
            isRefreshing = true;
            try {
                await instance.post('/auth/token/refresh');
                isRefreshing = false;
                originalRequest._retry = true;
                return instance(originalRequest);
            } catch {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);




interface BaseUserResponse {
    id: string;
    username: string;
    email: string;
    profile_picture_url: string | null;
    contact_details: string | null;
    role: string;
    balance: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    listings: any[];
    purchased_products: any[];
    reports: any[];
}

export interface RegisterResponse extends BaseUserResponse {}
export interface ProfileResponse extends BaseUserResponse {}

interface LoginResponse {
    detail: string;
    access_token: string;
    refresh_token: string;
    user: RegisterResponse;
}

interface LoginDataTypes{
    email: string;
    password: string;
}
export interface RegisterDataTypes {
    username?: string;
    email: string;
    password: string;
    profile_picture_url?: string;
    contact_details?: string;
    role?: string;
}

const apiClient = {
    auth: {
        register: async (data:RegisterDataTypes): Promise<AxiosResponse<RegisterResponse>> => {
            return await instance.post('/auth/register', data);
        },
        login: async (data: LoginDataTypes): Promise<AxiosResponse<LoginResponse>> => {
            return await instance.post('/auth/login', data);
        },
        logout: async (): Promise<AxiosResponse> => {
            return await instance.post('/auth/logout');
        },
        refreshToken: async (): Promise<AxiosResponse> => {
            return await instance.post('/auth/token/refresh');
        },
        passwordReset: async (data: {email:string} ): Promise<AxiosResponse< {detail: string} >> => {
            return await instance.post('/auth/password-reset', data);
        },
        profile: async (): Promise<AxiosResponse<ProfileResponse>> => {
            return await instance.get('/auth/profile');
        },
    },
    products: {
        list: async (params?: any): Promise<AxiosResponse> => {
            return await instance.get('/products', { params });
        },
        detail: async (id: string | number): Promise<AxiosResponse> => {
            return await instance.get(`/products/${id}`);
        },
        create: async (data: any): Promise<AxiosResponse> => {
            return await instance.post('/products', data);
        },
        update: async (id: string | number, data: any): Promise<AxiosResponse> => {
            return await instance.put(`/products/${id}`, data);
        },
        delete: async (id: string | number): Promise<AxiosResponse> => {
            return await instance.delete(`/products/${id}`);
        },
    },
    categories: {
        list: async (): Promise<AxiosResponse> => {
            return await instance.get('/categories');
        },
        create: async (data: any): Promise<AxiosResponse> => {
            return await instance.post('/categories', data);
        },
        update: async (id: string | number, data: any): Promise<AxiosResponse> => {
            return await instance.put(`/categories/${id}`, data);
        },
        delete: async (id: string | number): Promise<AxiosResponse> => {
            return await instance.delete(`/categories/${id}`);
        },
    },
    transactions: {
        list: async (): Promise<AxiosResponse> => {
            return await instance.get('/transactions');
        },
        create: async (data: any): Promise<AxiosResponse> => {
            return await instance.post('/transactions', data);
        },
    },
    reports: {
        list: async (): Promise<AxiosResponse> => {
            return await instance.get('/reports');
        },
        create: async (data: any): Promise<AxiosResponse> => {
            return await instance.post('/reports', data);
        },
        update: async (id: string | number, data: any): Promise<AxiosResponse> => {
            return await instance.put(`/reports/${id}`, data);
        },
    },
    conversations: {
        list: async (): Promise<AxiosResponse> => {
            return await instance.get('/conversations');
        },
        create: async (data: any): Promise<AxiosResponse> => {
            return await instance.post('/conversations', data);
        },
    },
    messages: {
        list: async (conversationId: number): Promise<AxiosResponse> => {
            return await instance.get(`/conversations/${conversationId}/messages`);
        },
        create: async (conversationId: number, data: any): Promise<AxiosResponse> => {
            return await instance.post(`/conversations/${conversationId}/messages`, data);
        },
    },
    cart: {
        items: {
            list: async (): Promise<AxiosResponse> => {
                return await instance.get('/cart/items');
            },
            add: async (data: any): Promise<AxiosResponse> => {
                return await instance.post('/cart/items', data);
            },
            remove: async (itemId: number): Promise<AxiosResponse> => {
                return await instance.delete(`/cart/items/${itemId}`);
            },
        },
        empty: async (): Promise<AxiosResponse> => {
            return await instance.delete('/cart/empty');
        },
    },
    orders: {
        list: async (): Promise<AxiosResponse> => {
            return await instance.get('/orders');
        },
        detail: async (id: string | number): Promise<AxiosResponse> => {
            return await instance.get(`/orders/${id}`);
        },
        update: async (id: string | number, data: any): Promise<AxiosResponse> => {
            return await instance.put(`/orders/${id}`, data);
        },
        delete: async (id: string | number): Promise<AxiosResponse> => {
            return await instance.delete(`/orders/${id}`);
        },
    },
    checkout: {
        process: async (data: any): Promise<AxiosResponse> => {
            return await instance.post('/checkout', data);
        },
    },
    admin: {
        users: {
            list: async (): Promise<AxiosResponse> => {
                return await instance.get('/admin/users');
            },
            create: async (data: any): Promise<AxiosResponse> => {
                return await instance.post('/admin/users', data);
            },
            update: async (id: string | number, data: any): Promise<AxiosResponse> => {
                return await instance.put(`/admin/users/${id}`, data);
            },
            delete: async (id: string | number): Promise<AxiosResponse> => {
                return await instance.delete(`/admin/users/${id}`);
            },
        },
        products: {
            list: async (): Promise<AxiosResponse> => {
                return await instance.get('/admin/products');
            },
            update: async (id: string | number, data: any): Promise<AxiosResponse> => {
                return await instance.put(`/admin/products/${id}`, data);
            },
            delete: async (id: string | number): Promise<AxiosResponse> => {
                return await instance.delete(`/admin/products/${id}`);
            },
        },
        reports: {
            list: async (): Promise<AxiosResponse> => {
                return await instance.get('/admin/reports');
            },
            update: async (id: string | number, data: any): Promise<AxiosResponse> => {
                return await instance.put(`/admin/reports/${id}`, data);
            },
        },
    },
    // ...add additional endpoint groups if needed...
};

export default apiClient;
