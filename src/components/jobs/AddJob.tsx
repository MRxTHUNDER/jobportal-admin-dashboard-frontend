import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { BACKEND_URL } from '../../lib/config';
import { Building2, MapPin, DollarSign, Clock, Briefcase, Server, Check, X } from 'lucide-react';

interface JobFormData {
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
  postedBy?: string;
  expiresAt: string;
  remote: boolean;
}

const AddJob: React.FC = () => {
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    description: '',
    techstack: '',
    responsibilities: '',
    requirements: '',
    about: '',
    benefits: '',
    company: '',
    location: '',
    salary: '',
    jobType: 'Full-time',
    expiresAt: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    remote: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (successMessage) {
      timer = setTimeout(() => {
        setSuccessMessage('');
      }, 6000); // 6 seconds
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [successMessage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      // Get the auth token
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // Format the data according to the API requirements
      const jobData = {
        title: formData.title,
        description: formData.description,
        techStack: formData.techstack, // API expects techStack (capital S)
        responsibilites: formData.responsibilities, // Note API spelling
        requirements: formData.requirements,
        about: formData.about,
        benefits: formData.benefits,
        company: formData.company,
        location: formData.location,
        salary: formData.salary,
        jobType: formData.jobType, // Keeping as selected in dropdown
        postedBy: formData.postedBy,
        expiresAt: formData.expiresAt, // Keeping date input as-is
        remote: formData.remote
      };
      
      console.log('Sending job data to API:', jobData);
      
      const response = await fetch(`${BACKEND_URL}/api/jobs/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(jobData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.msg || 'Failed to add job');
      }
      
      const data = await response.json();
      console.log('Job added successfully:', data);
      
      setSuccessMessage('Job added successfully!');
      setFormData({
        title: '',
        description: '',
        techstack: '',
        responsibilities: '',
        requirements: '',
        about: '',
        benefits: '',
        company: '',
        location: '',
        salary: '',
        jobType: 'Full-time',
        postedBy: '',
        expiresAt: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        remote: false,
      });
    } catch (error) {
      console.error('Error adding job:', error);
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
      <div className="px-6 py-8 bg-linear-to-r from-blue-50 to-indigo-50">
        <h2 className="text-2xl font-bold text-gray-800">
          Add New Job Opportunity
        </h2>
        <p className="mt-2 text-gray-600">
          Fill in the details below to create a new job listing for potential candidates.
        </p>
      </div>

      {successMessage && (
        <div className="mx-6 my-4 bg-green-50 border-l-4 border-green-400 p-4 rounded-md shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{successMessage}</p>
              </div>
            </div>
            <button 
              onClick={() => setSuccessMessage('')} 
              className="text-green-500 hover:text-green-700"
              aria-label="Close message"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      
      {errorMessage && (
        <div className="mx-6 my-4 bg-red-50 border-l-4 border-red-400 p-4 rounded-md shadow-xs">
          <div className="flex items-center">
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-gray-200">
        <form onSubmit={handleSubmit} className="px-6 py-8">
          <div className="grid grid-cols-1 gap-y-10 gap-x-8 sm:grid-cols-6">
            {/* Job Title */}
            <div className="sm:col-span-3">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Job Title*
              </label>
              <div className="relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="pl-10 block w-full rounded-lg border border-gray-300 bg-white py-3 shadow-sm 
                    hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
                    transition-all duration-200 text-gray-900 placeholder:text-gray-400 placeholder:text-sm"
                  placeholder="Senior Frontend Developer"
                />
              </div>
            </div>

            {/* Company */}
            <div className="sm:col-span-3">
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                Company*
              </label>
              <div className="relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="company"
                  id="company"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  className="pl-10 block w-full rounded-lg border border-gray-300 bg-white py-3 shadow-sm 
                    hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
                    transition-all duration-200 text-gray-900 placeholder:text-gray-400 placeholder:text-sm"
                  placeholder="Acme Inc."
                />
              </div>
            </div>

            {/* Description */}
            <div className="sm:col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Job Description*
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 bg-white py-3 px-4 shadow-sm 
                    hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
                    transition-all duration-200 text-gray-900 placeholder:text-gray-400 placeholder:text-sm"
                  placeholder="Provide a detailed overview of the job position..."
                />
              </div>
            </div>

            {/* Tech Stack */}
            <div className="sm:col-span-6">
              <label htmlFor="techstack" className="block text-sm font-medium text-gray-700 mb-2">
                Tech Stack*
              </label>
              <div className="relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Server className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="techstack"
                  id="techstack"
                  required
                  placeholder="React, Node.js, MongoDB, TypeScript"
                  value={formData.techstack}
                  onChange={handleChange}
                  className="pl-10 block w-full rounded-lg border border-gray-300 bg-white py-3 shadow-sm 
                    hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
                    transition-all duration-200 text-gray-900 placeholder:text-gray-400 placeholder:text-sm"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">Separate technologies with commas</p>
            </div>

            {/* Responsibilities */}
            <div className="sm:col-span-6">
              <label htmlFor="responsibilities" className="block text-sm font-medium text-gray-700 mb-2">
                Responsibilities*
              </label>
              <div className="mt-1">
                <textarea
                  id="responsibilities"
                  name="responsibilities"
                  rows={4}
                  required
                  value={formData.responsibilities}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 bg-white py-3 px-4 shadow-sm 
                    hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
                    transition-all duration-200 text-gray-900 placeholder:text-gray-400 placeholder:text-sm"
                  placeholder="List the key responsibilities for this position..."
                />
              </div>
            </div>

            {/* Requirements */}
            <div className="sm:col-span-6">
              <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
                Requirements*
              </label>
              <div className="mt-1">
                <textarea
                  id="requirements"
                  name="requirements"
                  rows={4}
                  required
                  value={formData.requirements}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 bg-white py-3 px-4 shadow-sm 
                    hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
                    transition-all duration-200 text-gray-900 placeholder:text-gray-400 placeholder:text-sm"
                  placeholder="List the qualifications and skills required..."
                />
              </div>
            </div>

            {/* About the Role */}
            <div className="sm:col-span-6">
              <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-2">
                About the Role
              </label>
              <div className="mt-1">
                <textarea
                  id="about"
                  name="about"
                  rows={4}
                  value={formData.about}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 bg-white py-3 px-4 shadow-sm 
                    hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
                    transition-all duration-200 text-gray-900 placeholder:text-gray-400 placeholder:text-sm"
                  placeholder="Provide additional context about the position..."
                />
              </div>
            </div>

            {/* Benefits */}
            <div className="sm:col-span-6">
              <label htmlFor="benefits" className="block text-sm font-medium text-gray-700 mb-2">
                Benefits
              </label>
              <div className="mt-1">
                <textarea
                  id="benefits"
                  name="benefits"
                  rows={3}
                  value={formData.benefits}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 bg-white py-3 px-4 shadow-sm 
                    hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
                    transition-all duration-200 text-gray-900 placeholder:text-gray-400 placeholder:text-sm"
                  placeholder="Health insurance, flexible hours, remote work options..."
                />
              </div>
            </div>

            {/* Location */}
            <div className="sm:col-span-3">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location*
              </label>
              <div className="relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="location"
                  id="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="pl-10 block w-full rounded-lg border border-gray-300 bg-white py-3 shadow-sm 
                    hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
                    transition-all duration-200 text-gray-900 placeholder:text-gray-400 placeholder:text-sm"
                  placeholder="San Francisco, CA"
                />
              </div>
            </div>

            {/* Salary */}
            <div className="sm:col-span-3">
              <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-2">
                Salary*
              </label>
              <div className="relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="salary"
                  id="salary"
                  required
                  placeholder="$80,000 - $100,000"
                  value={formData.salary}
                  onChange={handleChange}
                  className="pl-10 block w-full rounded-lg border border-gray-300 bg-white py-3 shadow-sm 
                    hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
                    transition-all duration-200 text-gray-900 placeholder:text-gray-400 placeholder:text-sm"
                />
              </div>
            </div>

            {/* Job Type */}
            <div className="sm:col-span-3">
              <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-2">
                Job Type*
              </label>
              <div className="relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="jobType"
                  name="jobType"
                  required
                  value={formData.jobType}
                  onChange={handleChange}
                  className="pl-10 block w-full rounded-lg border border-gray-300 bg-white py-3 shadow-sm 
                    hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
                    transition-all duration-200 text-gray-900"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
            </div>

            {/* Expires At */}
            <div className="sm:col-span-3">
              <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700 mb-2">
                Expires At*
              </label>
              <div className="relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  name="expiresAt"
                  id="expiresAt"
                  required
                  value={formData.expiresAt}
                  onChange={handleChange}
                  className="pl-10 block w-full rounded-lg border border-gray-300 bg-white py-3 shadow-sm 
                    hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
                    transition-all duration-200 text-gray-900"
                />
              </div>
            </div>

            {/* Remote Job */}
            <div className="sm:col-span-6">
              <div className="flex items-start mt-2">
                <div className="flex items-center h-6">
                  <input
                    id="remote"
                    name="remote"
                    type="checkbox"
                    checked={formData.remote}
                    onChange={handleCheckboxChange}
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 
                      focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="remote" className="font-medium text-gray-700 flex items-center text-base">
                    <span>Remote Job</span>
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                      Popular
                    </span>
                  </label>
                  <p className="text-gray-500 text-sm mt-1">Check this if the job can be performed remotely</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 mt-10">
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-white py-3 px-6 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 
                  hover:bg-gray-50 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                onClick={() => {
                  setFormData({
                    title: '',
                    description: '',
                    techstack: '',
                    responsibilities: '',
                    requirements: '',
                    about: '',
                    benefits: '',
                    company: '',
                    location: '',
                    salary: '',
                    jobType: 'Full-time',
                    expiresAt: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
                    remote: false,
                  });
                }}
              >
                Clear Form
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="ml-4 inline-flex justify-center py-3 px-8 border border-transparent shadow-sm text-sm font-medium 
                  rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 
                  focus:ring-blue-500 disabled:opacity-50 transition-all duration-200"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </span>
                ) : 'Add Job'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJob;