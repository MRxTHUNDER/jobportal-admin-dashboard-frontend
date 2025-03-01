import React, { useState } from 'react';
import { format } from 'date-fns';

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
  postedBy: string;
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
    postedBy: '',
    expiresAt: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    remote: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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

    try {
      // In a real app, this would be an API call to save the job
      console.log('Submitting job:', formData);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h2 className="text-lg leading-6 font-medium text-gray-900">Add New Job</h2>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Fill in the details to create a new job listing.
        </p>
      </div>

      {successMessage && (
        <div className="mx-4 mb-4 bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-gray-200">
        <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Job Title*
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                Company*
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="company"
                  id="company"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Job Description*
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="techstack" className="block text-sm font-medium text-gray-700">
                Tech Stack*
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="techstack"
                  id="techstack"
                  required
                  placeholder="e.g. React, Node.js, MongoDB"
                  value={formData.techstack}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="responsibilities" className="block text-sm font-medium text-gray-700">
                Responsibilities*
              </label>
              <div className="mt-1">
                <textarea
                  id="responsibilities"
                  name="responsibilities"
                  rows={3}
                  required
                  value={formData.responsibilities}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">
                Requirements*
              </label>
              <div className="mt-1">
                <textarea
                  id="requirements"
                  name="requirements"
                  rows={3}
                  required
                  value={formData.requirements}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                About the Role
              </label>
              <div className="mt-1">
                <textarea
                  id="about"
                  name="about"
                  rows={3}
                  value={formData.about}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="benefits" className="block text-sm font-medium text-gray-700">
                Benefits
              </label>
              <div className="mt-1">
                <textarea
                  id="benefits"
                  name="benefits"
                  rows={3}
                  value={formData.benefits}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location*
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="location"
                  id="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
                Salary*
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="salary"
                  id="salary"
                  required
                  placeholder="e.g. $80,000 - $100,000"
                  value={formData.salary}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="jobType" className="block text-sm font-medium text-gray-700">
                Job Type*
              </label>
              <div className="mt-1">
                <select
                  id="jobType"
                  name="jobType"
                  required
                  value={formData.jobType}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="postedBy" className="block text-sm font-medium text-gray-700">
                Posted By*
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="postedBy"
                  id="postedBy"
                  required
                  value={formData.postedBy}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700">
                Expires At*
              </label>
              <div className="mt-1">
                <input
                  type="date"
                  name="expiresAt"
                  id="expiresAt"
                  required
                  value={formData.expiresAt}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3 flex items-center">
              <div className="flex items-center h-5">
                <input
                  id="remote"
                  name="remote"
                  type="checkbox"
                  checked={formData.remote}
                  onChange={handleCheckboxChange}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="remote" className="font-medium text-gray-700">
                  Remote Job
                </label>
              </div>
            </div>
          </div>

          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
                    postedBy: '',
                    expiresAt: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
                    remote: false,
                  });
                }}
              >
                Clear
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Adding...' : 'Add Job'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJob;