import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000/api';

const instance: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
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

export interface RegisterResponse extends BaseUserResponse { }
export interface ProfileResponse extends BaseUserResponse { }

interface LoginResponse {
    detail: string;
    access_token: string;
    refresh_token: string;
    user: RegisterResponse;
}

export interface LoginDataTypes {
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
export interface CreateProduct {
    seller: string;
    title: string;
    description: string;
    price: number;
    condition: "New" | "Used";
    location?: string | null;
}
export interface ProductImage {
    id: string;
    product: string;
    image_url: string;
    caption: string;
    order: number;
    created_at: string;
}

export interface CreateCategory {
    name: string;
    description: string;
}
export interface Category extends CreateCategory {
    id: string;
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
}


export interface Product {
    id: string;
    seller: string;
    title: string;
    description: string;
    price: number;
    condition: "New" | "Used";
    location?: string | null;
    category_name: string;
    is_active?: boolean;
    is_sold?: boolean;
    bought_by?: string | null;
    created_at?: string;
    updated_at?: string;
    images: ProductImage[];
}

export interface DbCartItem {
    id: string;
    product: Product;
    created_at: string;
}



const apiClient = {
    auth: {
        register: async (data: RegisterDataTypes): Promise<AxiosResponse<RegisterResponse>> => {
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
        passwordReset: async (data: { email: string }): Promise<AxiosResponse<{ detail: string }>> => {
            return await instance.post('/auth/password-reset', data);
        },
        isAuthenticated: async (): Promise<AxiosResponse<{ success: boolean }>> => {
            return await instance.get('/auth/is-authenticated');
        },
        profile: async (): Promise<AxiosResponse<ProfileResponse>> => {
            return await instance.get('/auth/profile');
        },
    },
    products: {
        list: async (): Promise<Product[]> => {
            const response = await instance.get('/products/');
            return response.data
        },
        detail: async (id: string): Promise<AxiosResponse<Product>> => {
            return await instance.get(`/products/${id}`);
        },
        create: async (data: CreateProduct): Promise<AxiosResponse<Product>> => {
            return await instance.post('/products', data);
        },
        update: async (id: string, data: any): Promise<AxiosResponse<Product>> => {
            return await instance.put(`/products/${id}`, data);
        },
        delete: async (id: string): Promise<AxiosResponse> => {
            return await instance.delete(`/products/${id}`);
        },
    },
    categories: {
        list: async (): Promise<Category[]> => {
            const response = await instance.get('/categories');
            return response.data;
        },
        create: async (data: CreateCategory): Promise<Category> => {
            const response = await instance.post('/categories/', data);
            return response.data;
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
        create: async (data: { product_id: string }): Promise<AxiosResponse> => {
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
        list: async (conversationId?: string | number): Promise<AxiosResponse> => {
            const params = conversationId ? { conversation: conversationId } : {};
            return await instance.get('/messages/', { params });
        },
        create: async (data: { conversation: string | number, content: string }): Promise<AxiosResponse> => {
            return await instance.post('/messages/', data);
        },
        update: async (id: string | number, data: any): Promise<AxiosResponse> => {
            return await instance.put(`/messages/${id}`, data);
        },
        delete: async (id: string | number): Promise<AxiosResponse> => {
            return await instance.delete(`/messages/${id}`);
        },
    },
    cart: {
        items: {
            list: async (): Promise<AxiosResponse<DbCartItem[]>> => {
                return await instance.get('/cart-items/');
            },
            add: async (data: { product_id: string }): Promise<AxiosResponse<DbCartItem>> => {
                const response = await instance.post('/cart-items/', data);
                return response.data;
            },
            remove: async (product_id: string): Promise<AxiosResponse> => {
                return await instance.delete(`/cart-items/${product_id}/`);
            },
        },
        empty: async (): Promise<AxiosResponse<{ detail: string }>> => {
            return await instance.delete('/auth/cart/empty');
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
        process: async (): Promise<AxiosResponse> => {
            return await instance.post('/auth/checkout');
        },
    },
    productImages: {
        list: async (params?: any): Promise<AxiosResponse> => {
            return await instance.get('/product-images/', { params });
        },
        create: async (data: any): Promise<AxiosResponse> => {
            return await instance.post('/product-images/', data);
        },
        detail: async (id: string | number): Promise<AxiosResponse> => {
            return await instance.get(`/product-images/${id}`);
        },
        update: async (id: string | number, data: any): Promise<AxiosResponse> => {
            return await instance.put(`/product-images/${id}`, data);
        },
        delete: async (id: string | number): Promise<AxiosResponse> => {
            return await instance.delete(`/product-images/${id}`);
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
