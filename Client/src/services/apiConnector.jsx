// src/services/apiConnector.js
import axios from "axios";

export const axiosInstance = axios.create({
  withCredentials: true,
});

export const apiConnector = async (
  method,
  url,
  bodyData = null,
  headers = {},
  params = null
) => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await axiosInstance({
      method,
      url,
      data: bodyData,
      headers,
      params,
    });

    return response.data;
  } catch (error) {
    console.error("API ERROR:", error);
    throw error?.response?.data || error;
  }
};
