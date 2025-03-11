import axios from "axios";

import { config } from "@/config/env";

export async function loginRequest(email: string, password: string) {
  const requestBody = {
    email,
    password,
  };

  try {
    const response = await axios.post(
      `${config.apiUrl}/auth/login`,
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
      `${config.apiUrl}/auth/register`,
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
