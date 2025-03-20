export interface ResumeData {
  name: string;
  email: string;
  phone: string;
  address?: string;
  summary?: string;
  education?: {
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    startDate?: string;
    endDate?: string;
  }[];
  workExperience?: {
    company: string;
    position: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }[];
  skills: string[];
  projects?: {
    title: string;
    description?: string;
    link?: string;
  }[];
  certifications?: {
    name: string;
    issuer?: string;
    date?: string;
  }[];
  languages?: string[];
  hobbies?: string[];
}

export interface ViewResumeProps {
  userId: string;
  applicationId: string;
  isOpen: boolean;
  onClose: () => void;
}
