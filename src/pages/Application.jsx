"use client";

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuthToken } from "../utils/handleToken";
import { Loader2, ArrowLeft, FileText, Eye, User, Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Star, Calendar, ChevronDown, ChevronUp, Building, Code, Trophy, Link } from "lucide-react";
import { toast} from 'react-toastify';


export default function Application() {
  const { id } = useParams(); // interview ID
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState(null); // { type: 'resume' | 'extracted', app: {} }
  const [expandedSections, setExpandedSections] = useState({
    summary: true,
    experience: true,
    education: true,
    skills: true,
    projects: true,
    achievements: true,
    certifications: true
  });
  const [feedbackModal, setFeedbackModal] = useState(null);
  

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`http://localhost:8000/api/interview/get-applications/${id}/`, {
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch applications");
        return res.json();
      })
      .then((data) => setApplications(data))
      .catch(() => toast.error("Could not load applications."))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && feedbackModal) {
        setFeedbackModal(null);
      }
    };
  
    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [feedbackModal]);

  const handleProfileClick = (userId) => {
    if (!userId) return;
    // Navigate to the public profile view
    window.open(`/profile/${userId}`, "_blank"); 
  };
  

  const getScoreColor = (score) => {
    if (score >= 7) return "text-green-400";
    if (score >= 4) return "text-yellow-400";
    return "text-red-400";
  };
  
  const getScoreBackgroundColor = (score) => {
    if (score >= 7) return "bg-green-600/20 border-green-500/30";
    if (score >= 4) return "bg-yellow-600/20 border-yellow-500/30";
    return "bg-red-600/20 border-red-500/30";
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const parseExtractedResume = (resumeText) => {
    if (!resumeText) return null;
  
    const sections = {
      personalInfo: {},
      summary: "",
      skills: [],
      experience: [],
      education: [],
      projects: [],
      achievements: [],
      certifications: [],
    };
  
    const lines = resumeText.split('\n').map(line => line.trim()).filter(Boolean);
    let currentSection = null;
    let currentExperienceItem = null;
  
    // Helper function to finalize current experience item
    const finalizeExperienceItem = () => {
      if (currentExperienceItem && currentSection === "experience") {
        sections.experience.push(currentExperienceItem);
        currentExperienceItem = null;
      }
    };
  
    lines.forEach((line, index) => {
      if (line.startsWith("###")) {
        // Finalize current experience item before switching sections
        finalizeExperienceItem();
        
        const sectionTitle = line.replace("###", "").trim().toLowerCase();
        if (sectionTitle.includes("personal")) currentSection = "personalInfo";
        else if (sectionTitle.includes("summary")) currentSection = "summary";
        else if (sectionTitle.includes("skills")) currentSection = "skills";
        else if (sectionTitle.includes("experience")) currentSection = "experience";
        else if (sectionTitle.includes("education")) currentSection = "education";
        else if (sectionTitle.includes("certifications")) currentSection = "certifications";
        else if (sectionTitle.includes("projects")) currentSection = "projects";
        else if (sectionTitle.includes("achievements")) currentSection = "achievements";
        
        // Reset current experience item when switching sections
        currentExperienceItem = null;
      } else if (currentSection) {
        if (currentSection === "personalInfo") {
          if (line.includes("Name:")) sections.personalInfo.name = line.replace("Name:", "").trim();
          else if (line.includes("Email:")) sections.personalInfo.email = line.replace("Email:", "").trim();
          else if (line.includes("Phone:")) sections.personalInfo.phone = line.replace("Phone:", "").trim();
          else if (line.includes("Location:")) sections.personalInfo.location = line.replace("Location:", "").trim();
          else if (line.includes("LinkedIn:")) sections.personalInfo.linkedin = line.replace("LinkedIn:", "").trim();
          else if (line.includes("GitHub:")) sections.personalInfo.github = line.replace("GitHub:", "").trim();
        } else if (currentSection === "summary") {
          if (!line.startsWith("-")) {
            sections.summary += line + " ";
          }
        } else if (currentSection === "experience") {
          if (line.startsWith("-")) {
            const cleanLine = line.replace("-", "").trim();
            
            // Check if this looks like a company/position line (contains company name patterns)
            if (isCompanyPositionLine(cleanLine)) {
              // If we have a previous experience item, push it to the array
              if (currentExperienceItem) {
                sections.experience.push(currentExperienceItem);
              }
              
              // Create new experience item
              currentExperienceItem = parseStructuredItem(cleanLine);
              currentExperienceItem.details = [];
            } else {
              // This is a description line, add it to the current experience item
              if (currentExperienceItem) {
                currentExperienceItem.details.push(cleanLine);
              } else {
                // If no current item, create a simple one
                currentExperienceItem = {
                  title: cleanLine,
                  organization: "",
                  location: "",
                  period: "",
                  details: [],
                  raw: cleanLine
                };
              }
            }
          }
        } else if (line.startsWith("-")) {
          const cleanLine = line.replace("-", "").trim();
          
          if (currentSection === "education") {
            const item = parseStructuredItem(cleanLine);
            sections[currentSection].push(item);
          } else {
            sections[currentSection].push(cleanLine);
          }
        }
      }
    });
  
    // Don't forget to push the last experience item if it exists
    finalizeExperienceItem();
  
    return sections;
  };
  
  // Helper function to detect if a line is a company/position line
  const isCompanyPositionLine = (line) => {
    // More comprehensive patterns that indicate this is a company/position line
    const companyPatterns = [
      // Job titles
      /\b(intern|associate|developer|engineer|manager|analyst|coordinator|specialist|assistant|director|lead|senior|junior|consultant|administrator|executive|supervisor|technician|designer|architect|programmer|scientist|researcher|officer|representative|agent|advisor|instructor|trainer|mentor)\b/i,
      
      // Company indicators
      /\b(at|@)\s+[A-Z]/,  // "at Company" or "@ Company"
      /\b(inc|llc|ltd|corp|corporation|company|co\.|pvt|private|limited|group|international|solutions|systems|software|services|technologies|tech|consulting|consultancy)\b/i,
      
      // Date patterns
      /\(\s*\d{4}\s*[-–]\s*(\d{4}|present|current)\s*\)/i,  // Date patterns in parentheses
      /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{4}/i,
      /\d{4}\s*[-–]\s*(\d{4}|present|current)/i,
      
      // Position with company pattern
      /^[A-Z][a-z\s]+\s+[-–]\s+[A-Z]/,  // "Software Engineer - Google"
      /^[A-Z][a-z\s]+\s+at\s+[A-Z]/,    // "Software Engineer at Google"
      
      // Common company types
      /\b(startup|enterprise|firm|agency|organization|institution|foundation|university|college|school|hospital|clinic|bank|financial|retail|manufacturing|pharmaceutical|biotechnology|telecommunications|aerospace|automotive|energy|utilities|government|nonprofit|ngo)\b/i
    ];
    
    return companyPatterns.some(pattern => pattern.test(line));
  };
  
  const parseStructuredItem = (text) => {
    const item = {
      title: "",
      organization: "",
      location: "",
      period: "",
      gpa: "",
      details: [],
      raw: text
    };
  
    // Enhanced parsing patterns
    const patterns = {
      // Experience patterns - handle multiple formats
      positionAt: /^(.+?)\s+(?:at|@)\s+(.+?)(?:\s+\((.+?)\))?(?:\s+[-–]\s+(.+?))?$/i,
      companyPosition: /^(.+?)\s+[-–]\s+(.+?)(?:\s+\((.+?)\))?(?:\s+[-–]\s+(.+?))?$/i,
      
      // Education patterns
      degree: /(.+?)\s+(?:at|from)\s+(.+?)(?:\s+\((.+?)\))?(?:\s+[-–]\s+(.+?))?/i,
      
      // Common patterns
      gpa: /GPA:\s*(\d+\.?\d*)/i,
      period: /(\d{4})\s*[-–]\s*(\d{4}|present|current)/i,
      location: /,\s*([^,]+(?:,\s*[A-Z]{2})?)\s*$/i,
      dateInParens: /\(\s*(.+?)\s*\)/,
    };
  
    // Try to parse position/company format
    let match = text.match(patterns.positionAt);
    if (match) {
      item.title = match[1]?.trim() || "";
      item.organization = match[2]?.trim() || "";
      item.location = match[3]?.trim() || "";
      item.period = match[4]?.trim() || "";
    } else {
      // Try company-position format
      match = text.match(patterns.companyPosition);
      if (match) {
        item.organization = match[1]?.trim() || "";
        item.title = match[2]?.trim() || "";
        item.location = match[3]?.trim() || "";
        item.period = match[4]?.trim() || "";
      } else {
        // Try education format
        match = text.match(patterns.degree);
        if (match) {
          item.title = match[1]?.trim() || "";
          item.organization = match[2]?.trim() || "";
          item.location = match[3]?.trim() || "";
          item.period = match[4]?.trim() || "";
        }
      }
    }
  
    // Extract dates from parentheses if not found above
    if (!item.period) {
      const dateMatch = text.match(patterns.dateInParens);
      if (dateMatch) {
        const dateContent = dateMatch[1];
        if (patterns.period.test(dateContent)) {
          item.period = dateContent;
        }
      }
    }
  
    // Extract GPA
    const gpaMatch = text.match(patterns.gpa);
    if (gpaMatch) {
      item.gpa = gpaMatch[1];
    }
  
    // Extract location if not found above
    if (!item.location) {
      const locationMatch = text.match(patterns.location);
      if (locationMatch) {
        item.location = locationMatch[1];
      }
    }
  
    // If no structured data found, use the raw text as title
    if (!item.title && !item.organization) {
      item.title = text;
    }
  
    return item;
  };

  const renderPersonalInfo = (info) => (
    <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-8 rounded-2xl border border-slate-700/50 mb-8 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-purple-600/20 p-3 rounded-xl">
          <User size={24} className="text-purple-400" />
        </div>
        <h3 className="text-2xl font-bold text-white">Personal Information</h3>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {info.name && (
          <div className="flex items-center gap-3 bg-slate-900/50 p-4 rounded-xl border border-slate-700/30">
            <div className="bg-blue-600/20 p-2 rounded-lg">
              <User size={18} className="text-blue-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Full Name</p>
              <p className="text-white font-semibold">{info.name}</p>
            </div>
          </div>
        )}
        
        {info.email && (
          <div className="flex items-center gap-3 bg-slate-900/50 p-4 rounded-xl border border-slate-700/30">
            <div className="bg-green-600/20 p-2 rounded-lg">
              <Mail size={18} className="text-green-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Email</p>
              <p className="text-white font-semibold">{info.email}</p>
            </div>
          </div>
        )}
        
        {info.phone && (
          <div className="flex items-center gap-3 bg-slate-900/50 p-4 rounded-xl border border-slate-700/30">
            <div className="bg-yellow-600/20 p-2 rounded-lg">
              <Phone size={18} className="text-yellow-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Phone</p>
              <p className="text-white font-semibold">{info.phone}</p>
            </div>
          </div>
        )}
        
        {info.location && (
          <div className="flex items-center gap-3 bg-slate-900/50 p-4 rounded-xl border border-slate-700/30">
            <div className="bg-red-600/20 p-2 rounded-lg">
              <MapPin size={18} className="text-red-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Location</p>
              <p className="text-white font-semibold">{info.location}</p>
            </div>
          </div>
        )}
        
        {info.linkedin && (
          <div className="flex items-center gap-3 bg-slate-900/50 p-4 rounded-xl border border-slate-700/30">
            <div className="bg-blue-600/20 p-2 rounded-lg">
              <Link size={18} className="text-blue-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">LinkedIn</p>
              <p className="text-white font-semibold truncate">{info.linkedin}</p>
            </div>
          </div>
        )}
        
        {info.github && (
          <div className="flex items-center gap-3 bg-slate-900/50 p-4 rounded-xl border border-slate-700/30">
            <div className="bg-purple-600/20 p-2 rounded-lg">
              <Code size={18} className="text-purple-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">GitHub</p>
              <p className="text-white font-semibold truncate">{info.github}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderCollapsibleSection = (title, icon, content, sectionKey, itemCount = 0) => (
    <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-8 rounded-2xl border border-slate-700/50 mb-8 shadow-xl">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between group hover:bg-slate-800/50 p-4 rounded-xl transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          <div className="bg-purple-600/20 p-3 rounded-xl group-hover:bg-purple-600/30 transition-colors">
            {icon}
          </div>
          <div className="text-left">
            <h3 className="text-2xl font-bold text-white group-hover:text-purple-200 transition-colors">
              {title}
            </h3>
            {itemCount > 0 && (
              <p className="text-slate-400 text-sm">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
            )}
          </div>
        </div>
        <div className="bg-slate-700/50 p-2 rounded-lg group-hover:bg-slate-600/50 transition-colors">
          {expandedSections[sectionKey] ? 
            <ChevronUp size={20} className="text-purple-400" /> : 
            <ChevronDown size={20} className="text-purple-400" />
          }
        </div>
      </button>
      
      {expandedSections[sectionKey] && (
        <div className="mt-6 space-y-4">
          {content}
        </div>
      )}
    </div>
  );

  const renderSkills = (skills) => (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, index) => (
        <span
          key={index}
          className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full text-sm border border-purple-500/30"
        >
          {skill}
        </span>
      ))}
    </div>
  );

  const renderExperience = (experience) => (
    <div className="space-y-6">
      {experience.map((exp, index) => (
        <div key={index} className="bg-gradient-to-r from-slate-900/80 to-slate-800/80 p-6 rounded-xl border border-slate-700/40 hover:border-slate-600/60 transition-all duration-200 group">
          <div className="flex items-start gap-4">
            <div className="bg-blue-600/20 p-3 rounded-xl flex-shrink-0">
              <Briefcase size={20} className="text-blue-400" />
            </div>
            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-3">
                <h4 className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors">
                  {exp.title || exp.raw}
                </h4>
                {exp.period && (
                  <div className="flex items-center gap-2 text-slate-400 mt-1 lg:mt-0">
                    <Calendar size={16} />
                    <span className="text-sm">{exp.period}</span>
                  </div>
                )}
              </div>
              
              {exp.organization && (
                <div className="flex items-center gap-2 text-slate-300 mb-2">
                  <Building size={16} className="text-slate-400" />
                  <span className="font-medium">{exp.organization}</span>
                  {exp.location && (
                    <>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400">{exp.location}</span>
                    </>
                  )}
                </div>
              )}
              
              {exp.details && exp.details.length > 0 && (
                <div className="mt-3 space-y-2">
                  {exp.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="bg-blue-600/20 w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-slate-300 text-sm leading-relaxed">{detail}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderEducation = (education) => (
    <div className="space-y-6">
      {education.map((edu, index) => (
        <div key={index} className="bg-gradient-to-r from-slate-900/80 to-slate-800/80 p-6 rounded-xl border border-slate-700/40 hover:border-slate-600/60 transition-all duration-200 group">
          <div className="flex items-start gap-4">
            <div className="bg-green-600/20 p-3 rounded-xl flex-shrink-0">
              <GraduationCap size={20} className="text-green-400" />
            </div>
            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-3">
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-white group-hover:text-green-200 transition-colors mb-1">
                    {edu.title || edu.raw}
                  </h4>
                  {edu.organization && (
                    <div className="flex items-center gap-2 text-slate-300 mb-2">
                      <Building size={16} className="text-slate-400" />
                      <span className="font-medium">{edu.organization}</span>
                      {edu.location && (
                        <>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400">{edu.location}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col lg:items-end gap-2 mt-2 lg:mt-0">
                  {edu.period && (
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar size={16} />
                      <span className="text-sm">{edu.period}</span>
                    </div>
                  )}
                  {edu.gpa && (
                    <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 px-3 py-1.5 rounded-lg border border-yellow-500/30">
                      <div className="flex items-center gap-2">
                        <Trophy size={16} className="text-yellow-400" />
                        <span className="text-yellow-300 font-semibold text-sm">
                          GPA: {edu.gpa}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {edu.details && edu.details.length > 0 && (
                <div className="mt-3 space-y-2">
                  {edu.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="bg-green-600/20 w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-slate-300 text-sm leading-relaxed">{detail}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderProjects = (projects) => (
    <div className="space-y-6">
      {projects.map((project, index) => (
        <div key={index} className="bg-gradient-to-r from-slate-900/80 to-slate-800/80 p-6 rounded-xl border border-slate-700/40 hover:border-slate-600/60 transition-all duration-200 group">
          <div className="flex items-start gap-4">
            <div className="bg-purple-600/20 p-3 rounded-xl flex-shrink-0">
              <Code size={20} className="text-purple-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors mb-2">
                {project.title || project.raw || project}
              </h4>
              {project.organization && (
                <div className="flex items-center gap-2 text-slate-300 mb-2">
                  <Building size={16} className="text-slate-400" />
                  <span className="font-medium">{project.organization}</span>
                </div>
              )}
              {project.period && (
                <div className="flex items-center gap-2 text-slate-400 mb-3">
                  <Calendar size={16} />
                  <span className="text-sm">{project.period}</span>
                </div>
              )}
              {project.details && project.details.length > 0 && (
                <div className="space-y-2">
                  {project.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="bg-purple-600/20 w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-slate-300 text-sm leading-relaxed">{detail}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAchievements = (achievements) => (
    <div className="grid sm:grid-cols-2 gap-4">
      {achievements.map((achievement, index) => (
        <div key={index} className="bg-gradient-to-r from-yellow-600/10 to-orange-600/10 p-6 rounded-xl border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-200 group">
          <div className="flex items-start gap-3">
            <div className="bg-yellow-600/20 p-2 rounded-lg flex-shrink-0">
              <Trophy size={18} className="text-yellow-400" />
            </div>
            <p className="text-slate-200 leading-relaxed group-hover:text-yellow-100 transition-colors">
              {achievement}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCertifications = (certifications) => (
    <div className="grid sm:grid-cols-2 gap-4">
      {certifications.map((cert, index) => (
        <div key={index} className="bg-gradient-to-r from-emerald-600/10 to-teal-600/10 p-6 rounded-xl border border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-200 group">
          <div className="flex items-start gap-3">
            <div className="bg-emerald-600/20 p-2 rounded-lg flex-shrink-0">
              <Award size={18} className="text-emerald-400" />
            </div>
            <p className="text-slate-200 leading-relaxed group-hover:text-emerald-100 transition-colors">
              {cert}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="bg-slate-800/60 p-8 rounded-xl border border-slate-700/50 flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
          <span className="text-slate-300">Loading applications...</span>
        </div>
      </div>
    );
  }

  if (viewMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6 relative">
        <button
          onClick={() => setViewMode(null)}
          className="absolute top-6 left-6 bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl z-10"
        >
          <ArrowLeft size={18} /> Back to Applications
        </button>

        {viewMode.type === "resume" ? (
          <div className="flex flex-col items-center mt-20">
            <div className="bg-slate-800/60 p-6 rounded-xl border border-slate-700/50 mb-6 shadow-lg">
              <h2 className="text-2xl font-bold text-purple-300 text-center">
                Resume
              </h2>
            </div>
            <div className="w-full max-w-5xl bg-slate-800/40 p-6 rounded-xl border border-slate-700/50 shadow-lg">
              <iframe
                src={viewMode.app.resume}
                title="Resume"
                className="w-full h-[80vh] border-0 rounded-lg bg-white"
              ></iframe>
            </div>
          </div>
        ) : (
          <div className="mt-20 max-w-6xl mx-auto">
            <div className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 p-8 rounded-2xl border border-slate-700/50 mb-8 shadow-xl">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">
                  Extracted Resume
                </h2>
                <p className="text-slate-300">
                  Structured resume data for easy review and analysis
                </p>
              </div>
            </div>

            {(() => {
              const parsedResume = parseExtractedResume(viewMode.app.extratedResume);
              
              if (!parsedResume) {
                return (
                  <div className="bg-slate-800/60 p-6 rounded-xl border border-slate-700/50 shadow-lg">
                    <div className="bg-slate-900/50 p-6 rounded-lg border border-red-500/30">
                      <p className="text-red-400 text-center">No extracted data available or unable to parse resume content.</p>
                    </div>
                  </div>
                );
              }

              return (
                <div className="space-y-6">
                  {/* Personal Information */}
                  {parsedResume.personalInfo && Object.keys(parsedResume.personalInfo).length > 0 && 
                    renderPersonalInfo(parsedResume.personalInfo)
                  }

                  {/* Summary */}
                  {parsedResume.summary && parsedResume.summary.trim() && 
                    renderCollapsibleSection(
                      "Professional Summary",
                      <FileText size={24} className="text-purple-400" />,
                      <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700/30">
                        <p className="text-slate-200 leading-relaxed text-lg">{parsedResume.summary.trim()}</p>
                      </div>,
                      "summary"
                    )
                  }

                  {/* Experience */}
                  {parsedResume.experience && parsedResume.experience.length > 0 && 
                    renderCollapsibleSection(
                      "Work Experience",
                      <Briefcase size={24} className="text-purple-400" />,
                      renderExperience(parsedResume.experience),
                      "experience",
                      parsedResume.experience.length
                    )
                  }

                  {/* Education */}
                  {parsedResume.education && parsedResume.education.length > 0 && 
                    renderCollapsibleSection(
                      "Education",
                      <GraduationCap size={24} className="text-purple-400" />,
                      renderEducation(parsedResume.education),
                      "education",
                      parsedResume.education.length
                    )
                  }

                  {/* Skills */}
                  {parsedResume.skills && parsedResume.skills.length > 0 && 
                    renderCollapsibleSection(
                      "Skills",
                      <Star size={20} />,
                      renderSkills(parsedResume.skills),
                      "skills"
                    )
                  }

                  {/* Projects */}
                  {parsedResume.projects && parsedResume.projects.length > 0 && 
                    renderCollapsibleSection(
                      "Projects",
                      <Code size={24} className="text-purple-400" />,
                      renderProjects(parsedResume.projects),
                      "projects",
                      parsedResume.projects.length
                    )
                  }

                  {/* Achievements */}
                  {parsedResume.achievements && parsedResume.achievements.length > 0 && 
                    renderCollapsibleSection(
                      "Achievements",
                      <Trophy size={24} className="text-purple-400" />,
                      renderAchievements(parsedResume.achievements),
                      "achievements",
                      parsedResume.achievements.length
                    )
                  }

                  {/* Certifications */}
                  {parsedResume.certifications && parsedResume.certifications.length > 0 && 
                    renderCollapsibleSection(
                      "Certifications",
                      <Award size={24} className="text-purple-400" />,
                      renderCertifications(parsedResume.certifications),
                      "certifications",
                      parsedResume.certifications.length
                    )
                  }

                  {/* Raw Data Fallback */}
                  <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-8 rounded-2xl border border-slate-700/50 shadow-xl">
                    <button
                      onClick={() => toggleSection("rawData")}
                      className="w-full flex items-center justify-between group hover:bg-slate-800/50 p-4 rounded-xl transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-600/20 p-3 rounded-xl group-hover:bg-slate-600/30 transition-colors">
                          <FileText size={24} className="text-slate-400" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-2xl font-bold text-white group-hover:text-slate-200 transition-colors">
                            Raw Extracted Data
                          </h3>
                          <p className="text-slate-400 text-sm">Original extracted text for debugging</p>
                        </div>
                      </div>
                      <div className="bg-slate-700/50 p-2 rounded-lg group-hover:bg-slate-600/50 transition-colors">
                        {expandedSections.rawData ? 
                          <ChevronUp size={20} className="text-slate-400" /> : 
                          <ChevronDown size={20} className="text-slate-400" />
                        }
                      </div>
                    </button>
                    
                    {expandedSections.rawData && (
                      <div className="mt-6">
                        <div className="bg-slate-900/80 p-6 rounded-xl border border-slate-700/40">
                          <pre className="whitespace-pre-wrap text-slate-300 text-sm leading-relaxed max-h-96 overflow-y-auto font-mono">
                            {viewMode.app.extratedResume || "No raw data available"}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    );
  }

  const handleToggleApproved = async (appId) => {
    const token = getAuthToken();
    if (!token) {
      navigate("/login");
      return;
    }
  
    try {
      const res = await fetch(
        `http://localhost:8000/api/interview/update-application/${appId}/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
  
      if (!res.ok) {
        throw new Error("Failed to update approval status");
      }
  
      // Toggle locally
      setApplications((prev) =>
        prev.map((a) =>
          a.id === appId ? { ...a, approved: !a.approved } : a
        )
      );
    } catch (err) {
      console.error(err);
      toast.error("Could not update approval status. Try again.");
    }
  };

  // Sort applications by score (highest first)
const sortedApplications = [...applications].sort((a, b) => {
  const scoreA = a.score || 0;
  const scoreB = b.score || 0;
  return scoreB - scoreA;
});

// 2. Add the feedback modal component (add this before the main return statement)
const FeedbackModal = ({ feedback, candidateName, onClose }) => {
  if (!feedback) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 p-8 rounded-2xl border border-slate-700/50 shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-purple-600/20 p-3 rounded-xl">
              <FileText size={24} className="text-purple-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Candidate Feedback</h3>
              <p className="text-slate-400">{candidateName}</p>
            </div>
          </div>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="bg-slate-700/50 hover:bg-slate-600/50 p-2 rounded-lg transition-all duration-200 group"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="text-slate-400 group-hover:text-white transition-colors"
            >
              <path d="m18 6-12 12"/>
              <path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>

        {/* Feedback Content */}
        <div className="bg-slate-900/80 p-6 rounded-xl border border-slate-700/40">
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-200 leading-relaxed text-lg whitespace-pre-wrap">
              {feedback || "No feedback provided by the candidate."}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};


  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="p-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-purple-600 px-6 py-3 rounded-lg hover:bg-purple-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-slate-800/60 p-6 rounded-xl border border-slate-700/50 mb-8 shadow-lg">
        <h1 className="text-3xl font-bold text-purple-300 text-center">
            Applications 
          </h1>
          <p className="text-slate-300 text-center mt-2">
            Review and evaluate candidate applications
          </p>
        </div>

        {applications.length === 0 ? (
  <div className="bg-slate-800/60 p-12 rounded-xl border border-slate-700/50 shadow-lg text-center">
    <FileText size={48} className="mx-auto mb-4 text-slate-500" />
    <p className="text-slate-400 text-xl">No applications found for this interview.</p>
    <p className="text-slate-500 mt-2">Applications will appear here once candidates submit them.</p>
  </div>
) : (
  <div className="space-y-4">
    {/* Header */}
    <div className="grid grid-cols-12 gap-4 items-center text-slate-300 font-medium">
  <div className="col-span-1 text-center">#</div>
  <div className="col-span-2">Candidate</div>
  <div className="col-span-1 text-center">Score</div>
  <div className="col-span-2 text-center">Feedback</div>
  <div className="col-span-6 text-center">Actions</div>
</div>

    {/* Application List */}
    {sortedApplications.map((app, index) => (
      <div
        key={app.id}
        className="bg-slate-800/60 p-6 rounded-xl border border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-200 hover:border-purple-500/50"
      >
        <div className="grid grid-cols-12 gap-4 items-center">
          {/* Rank */}
          <div className="col-span-1 text-center">
            <div className="bg-purple-600/20 text-purple-300 w-8 h-8 rounded-full flex items-center justify-center font-bold">
              {index + 1}
            </div>
          </div>

          {/* Candidate Info */}
<div className="col-span-2">
  <div className="flex items-center gap-3">
    <div className="bg-purple-600/20 p-2 rounded-lg">
      <User size={20} className="text-purple-400" />
    </div>
    <div>
      <button
        onClick={() => handleProfileClick(app.user?.id)}
        
        className="text-lg font-semibold text-slate-200 hover:text-purple-300 transition-colors underline decoration-transparent hover:decoration-purple-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {app.user?.username || "Anonymous"}
      </button>
    </div>
  </div>
</div>

          {/* Score */}
          <div className="col-span-1 text-center">
            <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${getScoreBackgroundColor(app.score || 0)}`}>
              <Star size={16} className={getScoreColor(app.score || 0)} />
              <span className={`font-bold text-lg ${getScoreColor(app.score || 0)}`}>
                {app.score?.toFixed(1) || "0.0"}
              </span>
            </div>
          </div>

          {/* Feedback */}
          <div className="col-span-2 text-center">
  <button
    onClick={() => setFeedbackModal({
      feedback: app.feedback,
      candidateName: app.user?.username || "Anonymous"
    })}
    className="bg-indigo-600/80 hover:bg-indigo-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg mx-auto"
  >
    <FileText size={14} />
    Feedback
  </button>
</div>

          {/* Actions */}
          <div className="col-span-6">
  <div className="flex gap-2 justify-center">
              <button
                onClick={() => setViewMode({ type: "resume", app })}
                className="bg-blue-600 px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <Eye size={14} />
                Resume
              </button>

              <button
                onClick={() => setViewMode({ type: "extracted", app })}
                className="bg-green-600 px-3 py-2 rounded-lg text-sm hover:bg-green-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <FileText size={14} />
                Data
              </button>

              {app.approved ? (
                <button
                  onClick={() => handleToggleApproved(app.id)}
                  className="bg-red-600 px-3 py-2 rounded-lg text-sm hover:bg-red-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
                >
                  Disapprove
                </button>
              ) : (
                <button
                  onClick={() => handleToggleApproved(app.id)}
                  className="bg-emerald-600 px-3 py-2 rounded-lg text-sm hover:bg-emerald-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
                >
                  Approve
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
)}
      </div>
      {/* Feedback Modal */}
{feedbackModal && (
  <FeedbackModal
    feedback={feedbackModal.feedback}
    candidateName={feedbackModal.candidateName}
    onClose={() => setFeedbackModal(null)}
  />
)}
    </div>
  );
}