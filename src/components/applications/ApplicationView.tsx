import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

interface Applicant {
  _id: string;
  name: string;
  email: string;
  phone: string;
  appliedAt: string;
  resumeUrl: string;
  coverLetter: string;
  status: "pending" | "reviewed" | "interviewed" | "rejected" | "hired";
}

interface Job {
  _id: string;
  title: string;
  company: string;
  location?: string;
  salary?: string;
  jobType: string;
  remote: boolean;
  description: string;
  techStack: string;
  responsibilites: string; // Note: This matches the backend field name (with typo)
  requirements: string;
  about: string;
  benefits: string;
  applicationsCount?: number;
  createdAt: string;
  expiresAt?: string;
  applicants?: Applicant[];
}

const ApplicationView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);

  useEffect(() => {
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

          // If the API returns applicants with the job, store them
          // For now, use the mock applicants since your API might not include them yet
          setApplicants([
            {
              _id: "1",
              name: "John Smith",
              email: "john.smith@example.com",
              phone: "(555) 123-4567",
              appliedAt: new Date(2025, 1, 1).toISOString(),
              resumeUrl: "https://example.com/resume/john-smith",
              coverLetter:
                "I am excited to apply for this position as I believe my skills and experience make me a perfect fit for the role.",
              status: "reviewed",
            },
            {
              _id: "2",
              name: "Emily Johnson",
              email: "emily.johnson@example.com",
              phone: "(555) 987-6543",
              appliedAt: new Date(2025, 1, 3).toISOString(),
              resumeUrl: "https://example.com/resume/emily-johnson",
              coverLetter:
                "With my background in similar projects and passion for innovation, I am confident I can contribute significantly to your team.",
              status: "interviewed",
            },
            {
              _id: "3",
              name: "Michael Brown",
              email: "michael.brown@example.com",
              phone: "(555) 456-7890",
              appliedAt: new Date(2025, 1, 5).toISOString(),
              resumeUrl: "https://example.com/resume/michael-brown",
              coverLetter:
                "I have been following your company for years and would love the opportunity to bring my expertise to your team.",
              status: "pending",
            },
          ]);
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
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
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
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
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
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
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
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-4">
                      View Resume
                    </button>
                    <button className="text-blue-600 hover:text-blue-900">
                      Update Status
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                >
                  No applicants found for this job.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicationView;
