import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../hooks/usefetchjobs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, ExternalLink } from "lucide-react";
import { ResumeData, ViewResumeProps } from "@/types/resume";

const ViewResume: React.FC<ViewResumeProps> = ({ userId, isOpen, onClose }) => {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResumeData = async () => {
      if (!isOpen || !userId) return;

      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`${API_URL}/resume/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setResumeData(response.data.data);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          console.error("Error fetching resume:", err);
          setError(err.response?.data?.message || "Failed to load resume data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResumeData();
  }, [userId, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[95vw] md:max-w-[90vw] lg:max-w-[85vw] w-[85vw] min-h-[80vh] max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Applicant Resume</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-20 flex-grow">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2">Loading resume data...</span>
          </div>
        ) : error ? (
          <div className="text-center py-10 flex-grow">
            <p className="text-red-500">{error}</p>
            <Button variant="outline" className="mt-4" onClick={onClose}>
              Close
            </Button>
          </div>
        ) : resumeData ? (
          <div className="flex-grow flex flex-col h-full overflow-hidden">
            <Tabs defaultValue="basic" className="w-full h-full flex flex-col">
              <div className="border-b">
                <TabsList className="px-6 border-0 mb-0 bg-transparent">
                  <TabsTrigger
                    className="data-[state=active]:bg-white"
                    value="basic"
                  >
                    Basic Info
                  </TabsTrigger>
                  <TabsTrigger
                    className="data-[state=active]:bg-white"
                    value="experience"
                  >
                    Experience
                  </TabsTrigger>
                  <TabsTrigger
                    className="data-[state=active]:bg-white"
                    value="education"
                  >
                    Education
                  </TabsTrigger>
                  <TabsTrigger
                    className="data-[state=active]:bg-white"
                    value="skills"
                  >
                    Skills & Projects
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-grow overflow-y-auto">
                <TabsContent
                  value="basic"
                  className="w-full h-full m-0 p-6 data-[state=active]:block"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold">
                          Personal Details
                        </h3>
                        <div className="mt-2 space-y-2">
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-500">Name</span>
                            <span className="font-medium">
                              {resumeData.name}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-500">Email</span>
                            <span className="font-medium">
                              {resumeData.email}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-500">Phone</span>
                            <span className="font-medium">
                              {resumeData.phone}
                            </span>
                          </div>
                          {resumeData.address && (
                            <div className="flex flex-col">
                              <span className="text-sm text-gray-500">
                                Address
                              </span>
                              <span className="font-medium">
                                {resumeData.address}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {resumeData.languages &&
                        resumeData.languages.length > 0 && (
                          <div>
                            <h3 className="text-lg font-semibold">Languages</h3>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {resumeData.languages.map((language, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-gray-100 rounded-md text-sm"
                                >
                                  {language}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>

                    <div className="space-y-4">
                      {resumeData.summary && (
                        <div>
                          <h3 className="text-lg font-semibold">Summary</h3>
                          <p className="mt-2 text-gray-700">
                            {resumeData.summary}
                          </p>
                        </div>
                      )}

                      {resumeData.hobbies && resumeData.hobbies.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold">
                            Hobbies & Interests
                          </h3>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {resumeData.hobbies.map((hobby, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 rounded-md text-sm"
                              >
                                {hobby}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent
                  value="experience"
                  className="w-full h-full m-0 p-6 data-[state=active]:block"
                >
                  <div className="w-full">
                    <h3 className="text-xl font-semibold mb-4">
                      Work Experience
                    </h3>
                    {resumeData.workExperience &&
                    resumeData.workExperience.length > 0 ? (
                      <div className="space-y-6">
                        {resumeData.workExperience.map((exp, index) => (
                          <div
                            key={index}
                            className="border-l-2 border-blue-500 pl-4 py-1"
                          >
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                              <h4 className="font-medium text-lg">
                                {exp.position}
                              </h4>
                              <div className="text-sm text-gray-500">
                                {exp.startDate} - {exp.endDate || "Present"}
                              </div>
                            </div>
                            <div className="text-blue-700 font-medium">
                              {exp.company}
                            </div>
                            {exp.description && (
                              <p className="mt-2 text-gray-700">
                                {exp.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No work experience listed</p>
                    )}

                    <div className="mt-8">
                      <h3 className="text-xl font-semibold mb-4">
                        Certifications
                      </h3>
                      {resumeData.certifications &&
                      resumeData.certifications.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {resumeData.certifications.map((cert, index) => (
                            <div key={index} className="border p-3 rounded-md">
                              <h4 className="font-medium">{cert.name}</h4>
                              {cert.issuer && (
                                <div className="text-gray-600">
                                  {cert.issuer}
                                </div>
                              )}
                              {cert.date && (
                                <div className="text-sm text-gray-500">
                                  {cert.date}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">
                          No certifications listed
                        </p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent
                  value="education"
                  className="w-full h-full m-0 p-6 data-[state=active]:block"
                >
                  <div className="w-full">
                    <h3 className="text-xl font-semibold mb-4">Education</h3>
                    {resumeData.education && resumeData.education.length > 0 ? (
                      <div className="space-y-6">
                        {resumeData.education.map((edu, index) => (
                          <div
                            key={index}
                            className="border-l-2 border-green-500 pl-4 py-1"
                          >
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                              <h4 className="font-medium text-lg">
                                {edu.degree}
                              </h4>
                              <div className="text-sm text-gray-500">
                                {edu.startDate} - {edu.endDate || "Present"}
                              </div>
                            </div>
                            <div className="text-green-700 font-medium">
                              {edu.institution}
                            </div>
                            {edu.fieldOfStudy && (
                              <div className="text-gray-600">
                                Field: {edu.fieldOfStudy}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">
                        No education history listed
                      </p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent
                  value="skills"
                  className="w-full h-full m-0 p-6 data-[state=active]:block"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Skills</h3>
                      {resumeData.skills && resumeData.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {resumeData.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No skills listed</p>
                      )}
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-4">Projects</h3>
                      {resumeData.projects && resumeData.projects.length > 0 ? (
                        <div className="space-y-4">
                          {resumeData.projects.map((project, index) => (
                            <div key={index} className="border p-3 rounded-md">
                              <div className="flex justify-between">
                                <h4 className="font-medium">{project.title}</h4>
                                {project.link && (
                                  <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 flex items-center text-sm"
                                  >
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    View Project
                                  </a>
                                )}
                              </div>
                              {project.description && (
                                <p className="mt-2 text-sm text-gray-700">
                                  {project.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No projects listed</p>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        ) : (
          <div className="text-center py-10 flex-grow">
            <p className="text-gray-500">
              No resume data available for this applicant.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewResume;
