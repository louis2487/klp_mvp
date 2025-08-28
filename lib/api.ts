import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig
} from "axios";
import type { RootState } from "../store";
import { store } from "../store";
import { clearToken } from "../store/authSlice";
  
  export const API_URL = "https://api.smartgauge.co.kr";
  
  export const api: AxiosInstance = axios.create({
    baseURL: API_URL,     
    timeout: 10000,
  });
  
  api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = (store.getState() as RootState).auth.token;
  
    if (!config.headers) {
      config.headers = new AxiosHeaders();
    } else if (!(config.headers instanceof AxiosHeaders)) {
      config.headers = new AxiosHeaders(config.headers);
    }
  
    if (token) {
      (config.headers as AxiosHeaders).set("Authorization", `Bearer ${token}`);
    }
    return config;
  });
  
  api.interceptors.response.use(
    (res: AxiosResponse): AxiosResponse => res,
    (error: AxiosError): Promise<never> => {
      if (error?.response?.status === 401) {
        store.dispatch(clearToken());
      }
      return Promise.reject(error);
    }
  );
  
  export type AuthResponse = { user_id: number; token: string };
  
  export type Post = {
    id: number;
    author: { id: number; username: string; avatarUrl?: string };
    title: string;
    content: string;
    image_url?: string;
    created_at: string;
  };
  
  export const Auth = {
    logIn: async (username: string, password: string): Promise<AuthResponse> => {
      const { data } = await api.post<AuthResponse>("/community/login", { username, password });
      return data;
    },
    signUp: async (email: string, password: string, username: string) => {
      const { data } = await api.post("/community/signup", { email, password, username });
      return data;
    },
    logOut: async () => {
      store.dispatch(clearToken());
    },
  };
  
  export const Posts = {
    list: async (cursor?: string): Promise<{ items: Post[]; next_cursor?: string }> => {
      const { data } = await api.get("/community/posts", { params: { cursor } });
      return data;
    },
    get: async (id: number): Promise<Post> => {
      const { data } = await api.get(`/community/posts/${id}`);
      return data;
    },
    create: async (
      payload: { title: string; content: string; image_url?: string },
      token: string
    ): Promise<Post> => {
      const { data } = await api.post("/community/posts", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
  };
  