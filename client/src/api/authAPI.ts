import axios from "axios";

import { envConfig } from "@/config/env";

axios.defaults.withCredentials = true;

export async function loginRequest(email: string, password: string) {
  const requestBody = {
    email,
    password,
  };

  try {
    const response = await axios.post(
      `${envConfig.apiUrl}/auth/login`,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Login failed");
    }
    throw error;
  }
}

export async function registerRequest(email: string, password: string) {
  const requestBody = {
    email,
    password,
  };

  try {
    const response = await axios.post(
      `${envConfig.apiUrl}/auth/register`,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Register failed");
    }
    throw error;
  }
}
export async function logoutRequest() {
  try {
    const response = await axios.post(`${envConfig.apiUrl}/auth/logout`, {});

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Logout failed");
    }
    throw error;
  }
}
