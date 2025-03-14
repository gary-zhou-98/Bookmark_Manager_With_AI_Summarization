import axios from "axios";

import { envConfig } from "@/config/env";

axios.defaults.withCredentials = true;

export async function fetchAllBookmarks() {
  try {
    const response = await axios.get(`${envConfig.apiUrl}/bookmarks`);
    console.log(response.data);
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
