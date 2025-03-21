export const statusOptions = [
  { value: "applied", label: "Applied" },
  { value: "pending", label: "Pending" },
  { value: "reviewed", label: "Reviewed" },
  { value: "rejected", label: "Rejected" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "hired", label: "Hired" },
  { value: "applied", label: "Applied" },
  ];

export interface Applicant {
  _id: string;
  name: string;
  email: string;
  phone: string;
  appliedAt: string;
  resumeUrl: string;
  coverLetter: string;
  status: string;
  matchPercentage: number;
}

export interface Job {
  _id: string;
  title: string;
  company: string;
  location?: string;
  salary?: string;
  jobType: string;
  remote?: boolean;
  description: string;
  techStack: string;
  responsibilites: string; // Note: This matches the backend field name (with typo)
  requirements: string;
  about?: string;
  benefits?: string;
  applicationsCount?: number;
  createdAt: string;
  expiresAt?: string;
  applicants?: Applicant[];
}
