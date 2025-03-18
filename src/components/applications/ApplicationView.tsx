import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Globe,
} from "lucide-react";
import { format } from "date-fns";
import { fetchJobById } from "../../hooks/usefetchjobs";
import { fetchJobApplicants } from "../../hooks/useFetchApplicants";
import { updateApplicationStatus } from "../../hooks/useUpdateApplicationStatus";
import ApplicationViewFilter from "./ApplicationViewFilter";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Applicant, Job, statusOptions } from "@/types/application";

const ApplicationView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});

  const statusFilter = searchParams.get("status") || "";
  const matchSortFilter = searchParams.get("matchSort") || "";

  useEffect(() => {
    // Add console logs to debug filters
    console.log("Current filters:", { statusFilter, matchSortFilter });

    const fetchJob = async () => {
      if (!id) {
        setError("Job ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetchJobById(id);

        if (response.data) {
          setJob(response.data);
          // Fetch applicants after job data is loaded
          fetchApplicantsData(id);
        } else {
          setError("Job not found");
        }
      } catch (err) {
        setError("Failed to load job details");
        console.error("Error fetching job:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, statusFilter, matchSortFilter]);

  const fetchApplicantsData = async (jobId: string) => {
    try {
      setApplicantsLoading(true);
      console.log("Fetching with filters:", {
        status: statusFilter,
        matchSort: matchSortFilter,
      });

      // Include filter parameters in the API call
      const applicantsResponse = await fetchJobApplicants(jobId, 1, 10, {
        status: statusFilter,
        matchSort: matchSortFilter,
      });

      console.log("API response:", applicantsResponse);

      if (applicantsResponse.data) {
        // Transform applicant data to match our interface
        const formattedApplicants: Applicant[] = applicantsResponse.data.map(
          (app) => ({
            _id: app.applicationId,
            name: app.user?.name || "Unknown",
            email: app.user?.email || "",
            phone: app.user?.phoneNumber || "",
            appliedAt: app.appliedDate,
            resumeUrl: app.hasResume ? `/api/resume/${app.user?.id}` : "", // You'll need to adjust this URL
            coverLetter: "", // Your JobDataModel doesn't have cover letter field
            status: app.applicationStatus as any,
            matchPercentage: app.matchPercentage || 0, // Add match percentage
          })
        );

        setApplicants(formattedApplicants);
      } else {
        setApplicants([]);
      }
    } catch (err) {
      console.error("Error fetching applicants:", err);
      setApplicants([]);
    } finally {
      setApplicantsLoading(false);
    }
  };

  const handleStatusChange = async (
    applicationId: string,
    newStatus: string
  ) => {
    try {
      setIsUpdating((prev) => ({ ...prev, [applicationId]: true }));
      await updateApplicationStatus(applicationId, newStatus);

      setApplicants((prevApplicants) =>
        prevApplicants.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus as any } : app
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsUpdating((prev) => ({ ...prev, [applicationId]: false }));
    }
  };

  // Handle filter application
  const handleApplyFilter = (filters: {
    status: string;
    matchSort: string;
  }) => {
    console.log("Applying filters:", filters);
    // Update URL search params
    const newParams = new URLSearchParams();
    if (filters.status) newParams.set("status", filters.status);
    if (filters.matchSort) newParams.set("matchSort", filters.matchSort);

    setSearchParams(newParams);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="bg-white shadow-sm overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/dashboard/applications")}
              className="mr-4 flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back to Applications
            </button>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="text-center py-10">
            <h3 className="text-lg font-medium text-gray-900">Error</h3>
            <p className="mt-1 text-sm text-gray-500">
              {error || "Job not found"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/dashboard/applications")}
              className="mr-4 flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back to Applications
            </button>
            <h2 className="text-lg leading-6 font-medium text-gray-900">
              {job.title}
            </h2>
          </div>
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
            {job.jobType}
          </span>
        </div>
      </div>

      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <Briefcase className="h-5 w-5 mr-2 text-gray-400" />
              Company
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {job.company}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-gray-400" />
              Location
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {job.location || "Location not specified"}
              {job.remote && (
                <span className="ml-2 text-green-600">(Remote Available)</span>
              )}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-gray-400" />
              Salary
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {job.salary || "Not specified"}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-gray-400" />
              Timeline
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              Posted: {format(new Date(job.createdAt), "MMM d, yyyy")}
              <br />
              {job.expiresAt && (
                <>Expires: {format(new Date(job.expiresAt), "MMM d, yyyy")}</>
              )}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <Globe className="h-5 w-5 mr-2 text-gray-400" />
              Tech Stack
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {job.techStack}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Description</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {job.description}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Responsibilities
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {job.responsibilites}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Requirements</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {job.requirements}
            </dd>
          </div>
          {job.about && (
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                About the Role
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {job.about}
              </dd>
            </div>
          )}
          {job.benefits && (
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Benefits</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {job.benefits}
              </dd>
            </div>
          )}
        </dl>
      </div>

      <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Applicants ({applicants.length})
          </h3>
        </div>
      </div>

      <div className="overflow-x-auto">
        {applicantsLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-500">Loading applicants...</span>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Applicant
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Applied On
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Match %
                </th>
                <th scope="col" className="relative px-6 py-3 text-right">
                  <ApplicationViewFilter
                    onApplyFilter={handleApplyFilter}
                    initialFilters={{
                      status: statusFilter,
                      matchSort: matchSortFilter,
                    }}
                  />
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applicants.length > 0 ? (
                applicants.map((applicant) => (
                  <tr key={applicant._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {applicant.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {applicant.email}
                          </div>
                          <div className="text-sm text-gray-500">
                            {applicant.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {format(new Date(applicant.appliedAt), "MMM d, yyyy")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          applicant.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : applicant.status === "reviewed"
                            ? "bg-blue-100 text-blue-800"
                            : applicant.status === "interviewed"
                            ? "bg-purple-100 text-purple-800"
                            : applicant.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {applicant.status.charAt(0).toUpperCase() +
                          applicant.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {applicant.matchPercentage}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-end">
                        <a
                          href={applicant.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-899 mr-4"
                        >
                          View Resume
                        </a>
                        <Select
                          disabled={isUpdating[applicant._id]}
                          defaultValue={applicant.status}
                          onValueChange={(value) =>
                            handleStatusChange(applicant._id, value)
                          }
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Update Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Status</SelectLabel>
                              {statusOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                  >
                    No applicants found for this job.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ApplicationView;
