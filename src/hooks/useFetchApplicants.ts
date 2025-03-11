import axios from "axios";
import { API_URL } from "./usefetchjobs";

// Get the token from local storage
const getToken = () => localStorage.getItem("authToken");

interface ApplicantResponse {
  success: boolean;
  applications: Array<{
    _id: string;
    jobId: string;
    userId: {
      _id: string;
      name: string;
      email: string;
      phone: string;
    };
    resumeId: {
      _id: string;
      url: string;
    };
    coverLetter: string;
    status: string;
    appliedAt: string;
  }>;
  count: number;
}

export const fetchJobApplicants = async (jobId: string) => {
  try {
    const token = getToken();

    const response = await axios.get<ApplicantResponse>(
      `${API_URL}/jobs/${jobId}/applications`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching job applicants:", error);
    throw error;
  }
};
