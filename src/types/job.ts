export interface Job {
  id?: string;
  title: string;
  description: string;
  techstack: string;
  responsibilities: string;
  requirements: string;
  about: string;
  benefits: string;
  company: string;
  location: string;
  salary: string;
  jobType: string;
  postedBy: string;
  createdAt?: Date;
  expiresAt: string;
  remote: boolean;
  applicationsCount?: number;
}