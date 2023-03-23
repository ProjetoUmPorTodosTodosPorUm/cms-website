import type { AxiosInstance } from "axios";

export type CustomAxiosInstance = AxiosInstance & {
    setAuth: (token: string | null) => void
  }