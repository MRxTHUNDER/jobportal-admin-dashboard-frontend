export const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "reviewed", label: "Reviewed" },
  { value: "rejected", label: "Rejected" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "hired", label: "Hired" },
  { value: "Applied", label: "Applied" },
];

export interface Applicant {
  _id: string;
  name: string;
  email: string;
  phone: string;
  appliedAt: string;
  resumeUrl: string;
  coverLetter: string;
  status:
    | "pending"
    | "reviewed"
    | "interviewed"
    | "rejected"
    | "shortlisted"
    | "hired"
    | "applied";
  matchPercentage: number; // Added matchPercentage field
}

export interface Job {
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
