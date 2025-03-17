import axios from "axios";
import { API_URL } from "./usefetchjobs";

interface UpdateStatusResponse {
  message: string;
  data: {
    _id: string;
    applicationStatus: string;
    statusUpdatedAt: string;
    // other fields that may be returned
  };
}

export const updateApplicationStatus = async (
  applicationId: string,
  status: string
): Promise<UpdateStatusResponse> => {
  const token = localStorage.getItem("authToken");

  try {
    const response = await axios.put(
      `${API_URL}/jobs/applications/${applicationId}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to update application status"
    );
  }
};
