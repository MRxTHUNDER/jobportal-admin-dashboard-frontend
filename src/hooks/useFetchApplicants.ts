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
  filters?: {
    matchSort: string | null;
    status: string | null;
  };
}

interface FilterOptions {
  status?: string;
  matchSort?: string;
}

export const fetchJobApplicants = async (
  jobId: string,
  page: number = 1,
  limit: number = 10,
  filters: FilterOptions = {}
) => {
  try {
    const token = getToken();

    // Log what we're sending to the API
    console.log("Sending filters to API:", filters);

    // Ensure we're sending exactly the right case for the "Applied" status
    const params: any = {
      page,
      limit,
      matchSort: filters.matchSort,
    };

    // Only add status if it's defined
    if (filters.status) {
      params.status = filters.status;
      console.log(`Using status filter: "${filters.status}"`);
    }

    const response = await axios.get<ApplicantResponse>(
      `${API_URL}/jobs/${jobId}/applicants`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      }
    );

    console.log("Full API response:", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching job applicants:", error);
    throw error;
  }
};
