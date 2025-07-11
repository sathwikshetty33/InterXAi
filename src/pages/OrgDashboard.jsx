"use client";

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/ui/header";
import Footer from "../components/ui/footer";
import { getAuthToken } from "../utils/handleToken";
import { Loader2, Pencil } from "lucide-react";

export default function OrgDashboard() {
  const [orgData, setOrgData] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [viewerType, setViewerType] = useState("guest");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const token = getAuthToken();

    // Fetch org data (public)
    fetch(`http://localhost:8000/api/organization/org/${id}/`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch organization data");
        return res.json();
      })
      .then((data) => {
        setOrgData(data);
        setFormData(data);
        setTimeout(() => setVisible(true), 200);
      })
      .catch(() => alert("Could not load organization details."))
      .finally(() => setLoading(false));

    // Check viewer type only if token is present
    if (token) {
      fetch(`http://localhost:8000/api/organization/check-org/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then((data) => {
          setViewerType(data.is_organization ? "owner" : "guest");
        })
        .catch(() => setViewerType("guest"));
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async (field) => {
    const token = getAuthToken();
    if (viewerType !== "owner") return; // Prevent update if not owner

    try {
      const res = await fetch("http://localhost:8000/api/organization/update/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ [field]: formData[field] }),
      });

      const data = await res.json();
      if (res.ok) {
        setOrgData((prev) => ({ ...prev, [field]: formData[field] }));
        setEditingField(null);
      } else {
        alert("Update failed: " + JSON.stringify(data));
      }
    } catch {
      alert("Server error while updating.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-slate-900">
        <Loader2 className="w-6 h-6 mr-2 animate-spin" /> Loading organization data...
      </div>
    );
  }

  if (!orgData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-300 bg-slate-900">
        Organization not found.
      </div>
    );
  }

  const { email, orgname, address, photo, Description } = orgData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      <Header viewerType={viewerType} />

      <div className="flex flex-col items-center justify-center py-16 px-4 relative z-10">
        <div className={`max-w-5xl w-full transform transition-all duration-1000 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-slate-800/40 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-slate-700/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent animate-shimmer"></div>

            <div className="flex flex-col items-center space-y-6">
              {viewerType === "owner" && editingField === "photo" ? (
                <div className="flex flex-col items-center">
                  <input
                    type="text"
                    name="photo"
                    value={formData.photo}
                    onChange={handleChange}
                    className="bg-slate-700 text-white p-2 rounded mb-2"
                  />
                  <button onClick={() => handleSave("photo")} className="text-sm bg-purple-600 px-3 py-1 rounded">Save</button>
                </div>
              ) : (
                <img
                  src={photo}
                  alt="Organization Logo"
                  className={`w-28 h-28 rounded-full border-2 border-purple-500 shadow-lg ${viewerType === "owner" ? "cursor-pointer" : ""}`}
                  onClick={() => viewerType === "owner" && setEditingField("photo")}
                />
              )}

              <h1 className="text-3xl font-bold flex items-center gap-2">
                {viewerType === "owner" && editingField === "orgname" ? (
                  <>
                    <input
                      type="text"
                      name="orgname"
                      value={formData.orgname}
                      onChange={handleChange}
                      className="bg-slate-700 text-white p-2 rounded"
                    />
                    <button onClick={() => handleSave("orgname")} className="text-sm bg-purple-600 px-3 py-1 rounded">Save</button>
                  </>
                ) : (
                  <>
                    {orgname}
                    {viewerType === "owner" && (
                      <Pencil className="w-4 h-4 cursor-pointer" onClick={() => setEditingField("orgname")} />
                    )}
                  </>
                )}
              </h1>

              <div className="text-center space-y-2">
                <p className="text-sm text-slate-400 flex items-center gap-2">
                  <span className="text-purple-300 font-semibold">Email:</span> {email}
                </p>

                <p className="text-sm text-slate-400 flex items-center gap-2">
                  <span className="text-purple-300 font-semibold">Address:</span>
                  {viewerType === "owner" && editingField === "address" ? (
                    <>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="bg-slate-700 text-white p-1 rounded ml-2"
                      />
                      <button onClick={() => handleSave("address")} className="text-xs bg-purple-600 px-2 py-1 rounded ml-2">Save</button>
                    </>
                  ) : (
                    <>
                      <span>{address}</span>
                      {viewerType === "owner" && <Pencil className="w-4 h-4 cursor-pointer" onClick={() => setEditingField("address")} />}
                    </>
                  )}
                </p>

                <p className="text-sm text-slate-400 flex items-start gap-2">
                  <span className="text-purple-300 font-semibold">Description:</span>
                  {viewerType === "owner" && editingField === "Description" ? (
                    <div className="flex flex-col w-full">
                      <textarea
                        name="Description"
                        value={formData.Description}
                        onChange={handleChange}
                        rows={3}
                        className="bg-slate-700 text-white p-2 rounded w-full mt-1"
                      />
                      <button onClick={() => handleSave("Description")} className="text-sm bg-purple-600 px-3 py-1 rounded mt-2 self-end">Save</button>
                    </div>
                  ) : (
                    <span className="flex-1">
                      {Description || "No description provided."}
                      {viewerType === "owner" && <Pencil className="w-4 h-4 cursor-pointer ml-2" onClick={() => setEditingField("Description")} />}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
      `}</style>
    </div>
  );
}
