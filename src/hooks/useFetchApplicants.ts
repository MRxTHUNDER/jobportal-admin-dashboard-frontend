import axios from "axios";
import { API_URL } from "./usefetchjobs";

// Get the token from local storage
const getToken = () => localStorage.getItem("authToken");

// This interface should match what your backend returns in jobController.ts
interface ApplicantResponse {
  message: string;
  data: Array<{
    applicationId: string;
    applicationStatus: string;
    matchPercentage: number;
    appliedDate: string;
    lastUpdated: string;
    notes?: string;
    interviewDate?: string;
    user: {
      id: string;
      name: string;
      email: string;
      phoneNumber: string;
    } | null;
    hasResume: boolean;
  }>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export const fetchJobApplicants = async (
  jobId: string,
  page: number = 1,
  limit: number = 10
) => {
  try {
    const token = getToken();

    const response = await axios.get<ApplicantResponse>(
      `${API_URL}/jobs/${jobId}/applicants`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { page, limit },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching job applicants:", error);
    throw error;
  }
};
