import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export interface JobResponse {
  message: string;
  data: [];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export const fetchJobs = async (
  page = 1,
  limit = 10,
  searchTerm = "",
): Promise<JobResponse> => {
  try {
    const response = await axios.get(`${API_URL}/jobs`, {
      params: { page, limit, search: searchTerm },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};

export const fetchJobById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/jobs/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching job details:", error);
    throw error;
  }
};
