import axios from "axios";

import { envConfig } from "@/config/env";

axios.defaults.withCredentials = true;

export async function fetchAllBookmarks() {
  try {
    const response = await axios.get(`${envConfig.apiUrl}/bookmarks`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw (
        error.response?.data || "An error occurred while fetching bookmarks"
      );
    }
    throw error;
  }
}

export async function addBookmarkRequest(title: string, url: string) {
  try {
    const requestBody = {
      title,
      url,
    };
    const response = await axios.post(
      `${envConfig.apiUrl}/bookmark`,
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
      throw (
        error.response?.data || "An error occurred while creating new bookmark"
      );
    }
    throw error;
  }
}

export async function deleteBookmarkRequest(id: string) {
  try {
    const response = await axios.delete(`${envConfig.apiUrl}/bookmark/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw (
        error.response?.data || "An error occurred while creating new bookmark"
      );
    }
    throw error;
  }
}

export async function getBookmarkRequest(id: string) {
  try {
    const response = await axios.get(`${envConfig.apiUrl}/bookmark/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || "An error occurred while fetching bookmark";
    }
    throw error;
  }
}
