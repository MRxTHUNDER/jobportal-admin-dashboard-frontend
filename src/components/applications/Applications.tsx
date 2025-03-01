import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  jobType: string;
  remote: boolean;
  applicationsCount: number;
  createdAt: Date;
  expiresAt: Date;
}

const Applications: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  // Mock data for jobs
  const mockJobs: Job[] = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: 'TechCorp',
      location: 'New York, NY',
      salary: '$120,000 - $150,000',
      jobType: 'Full-time',
      remote: true,
      applicationsCount: 24,
      createdAt: new Date(2025, 0, 15),
      expiresAt: new Date(2025, 3, 15),
    },
    {
      id: '2',
      title: 'Backend Engineer',
      company: 'DataSystems',
      location: 'San Francisco, CA',
      salary: '$130,000 - $160,000',
      jobType: 'Full-time',
      remote: false,
      applicationsCount: 18,
      createdAt: new Date(2025, 0, 20),
      expiresAt: new Date(2025, 3, 20),
    },
    {
      id: '3',
      title: 'UX/UI Designer',
      company: 'CreativeMinds',
      location: 'Austin, TX',
      salary: '$90,000 - $110,000',
      jobType: 'Full-time',
      remote: true,
      applicationsCount: 32,
      createdAt: new Date(2025, 1, 5),
      expiresAt: new Date(2025, 4, 5),
    },
    {
      id: '4',
      title: 'DevOps Engineer',
      company: 'CloudTech',
      location: 'Seattle, WA',
      salary: '$125,000 - $145,000',
      jobType: 'Contract',
      remote: true,
      applicationsCount: 12,
      createdAt: new Date(2025, 1, 10),
      expiresAt: new Date(2025, 4, 10),
    },
    {
      id: '5',
      title: 'Mobile Developer (iOS)',
      company: 'AppWorks',
      location: 'Chicago, IL',
      salary: '$100,000 - $130,000',
      jobType: 'Full-time',
      remote: false,
      applicationsCount: 15,
      createdAt: new Date(2025, 1, 15),
      expiresAt: new Date(2025, 4, 15),
    },
  ];

  // Filter jobs based on search term
  const filteredJobs = mockJobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewJob = (id: string) => {
    navigate(`/dashboard/applications/${id}`);
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h2 className="text-lg leading-6 font-medium text-gray-900">Job Applications</h2>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          View and manage all job listings and their applications.
        </p>
      </div>
      
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <div className="relative rounded-md shadow-sm max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            name="search"
            id="search"
            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
            placeholder="Search jobs by title, company, or location"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
                Job Details
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Location
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Type
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Applications
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
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <tr key={job.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{job.title}</div>
                        <div className="text-sm text-gray-500">{job.company}</div>
                        <div className="text-sm text-gray-500">{job.salary}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{job.location}</div>
                    <div className="text-sm text-gray-500">
                      {job.remote ? 'Remote Available' : 'On-site Only'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {job.jobType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {job.applicationsCount} applications
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      Posted: {format(job.createdAt, 'MMM d, yyyy')}
                    </div>
                    <div className="text-sm text-gray-500">
                      Expires: {format(job.expiresAt, 'MMM d, yyyy')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleViewJob(job.id)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      View
                    </button>
                    <button className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  No jobs found matching your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Applications;