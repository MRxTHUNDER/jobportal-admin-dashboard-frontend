import React from 'react';
import { NavLink } from 'react-router-dom';
import { Building2, Briefcase, Users } from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <div className="hidden md:flex md:shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-gray-800">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center shrink-0 px-4">
              <Building2 className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-white text-lg font-semibold">Job Portal</span>
            </div>
            <nav className="mt-8 flex-1 px-2 space-y-1">
              <NavLink
                to="/dashboard/add-job"
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                <Briefcase
                  className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300"
                  aria-hidden="true"
                />
                Add Job
              </NavLink>
              <NavLink
                to="/dashboard/applications"
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                <Users
                  className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300"
                  aria-hidden="true"
                />
                Applications
              </NavLink>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;