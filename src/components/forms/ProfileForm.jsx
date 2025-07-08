"use client";

import React from "react";

export default function ProfileForm({
  formData,
  setFormData,
  handleSubmit,
  loading = false,
  editable = true,
  showImagePreview = true,
}) {
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 space-y-6"
    >
      {/* Photo URL */}
      <div>
        <label className="block text-sm mb-2">Cloudinary Photo URL</label>
        <input
          type="text"
          name="photo"
          value={formData.photo}
          onChange={handleChange}
          className="bg-slate-700 text-white p-2 w-full rounded"
          placeholder="Paste Cloudinary image URL here"
          required
          disabled={!editable}
        />
        {formData.photo && showImagePreview && (
          <img
            src={formData.photo}
            alt="Profile Preview"
            className="w-20 h-20 rounded-full mt-2"
          />
        )}
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm mb-2">Bio</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={3}
          className="bg-slate-700 text-white p-2 w-full rounded"
          placeholder="Tell us something about yourself..."
          required
          disabled={!editable}
        />
      </div>

      {/* GitHub Username */}
      <div>
        <label className="block text-sm mb-2">GitHub Username</label>
        <input
          type="text"
          name="github"
          value={formData.github}
          onChange={handleChange}
          className="bg-slate-700 text-white p-2 w-full rounded"
          placeholder="e.g. johndoe"
          disabled={!editable}
        />
      </div>

      {/* LeetCode Username */}
      <div>
        <label className="block text-sm mb-2">LeetCode Username</label>
        <input
          type="text"
          name="leetcode"
          value={formData.leetcode}
          onChange={handleChange}
          className="bg-slate-700 text-white p-2 w-full rounded"
          placeholder="e.g. johndoe123"
          disabled={!editable}
        />
      </div>

      {editable && (
        <button
          type="submit"
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded w-full"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      )}
    </form>
  );
}
