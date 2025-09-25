import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { API_BASE } from "../../utils/api";
import { Save, RotateCcw, User, Mail, Phone, Briefcase, DollarSign, Calendar, Tag, Linkedin, Info, FileText } from "lucide-react";

const AddCandidatePage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    currentCTC: "",
    expectedCTC: "",
    noticePeriod: "",
    skills: "",
    linkedInProfile: "",
    status: "",
    notes: "",
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      experience: "",
      currentCTC: "",
      expectedCTC: "",
      noticePeriod: "",
      skills: "",
      linkedInProfile: "",
      status: "",
      notes: "",
    });
    setResumeFile(null);
  };

  const handleAddCandidate = async () => {
    const { name, email, phone } = formData;
    if (!name || !email || !phone) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");

      // Step 1: Add candidate
      const res = await axios.post(`${API_BASE}/candidates/add`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      if (res.data.code === 1) {
        const candidateId = res.data.data.id;

        // Step 2: Upload resume if selected
        if (resumeFile) {
          const form = new FormData();
          form.append("file", resumeFile);
          await axios.post(
            `${API_BASE}/candidates/upload-single?candidateId=${candidateId}`,
            form,
            {
              headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
            }
          );
        }

        toast.success("Candidate added successfully!");
        resetForm();
      } else {
        toast.error(res.data.message || "Failed to add candidate");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to add candidate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Add Candidate</h1>
          <p className="text-gray-500 mt-1">
            Fill out the form to add a new candidate and optionally upload resume.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white shadow-md rounded-xl p-8 space-y-6">
          {/* Inputs */}
          <div className="space-y-4">
            <InputField
              label="Name*"
              icon={<User className="w-4 h-4 mr-2 text-blue-600" />}
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={loading}
            />
            <InputField
              label="Email*"
              icon={<Mail className="w-4 h-4 mr-2 text-blue-600" />}
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              type="email"
              disabled={loading}
            />
            <InputField
              label="Phone*"
              icon={<Phone className="w-4 h-4 mr-2 text-blue-600" />}
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={loading}
            />
            <InputField
              label="Experience"
              icon={<Briefcase className="w-4 h-4 mr-2 text-blue-600" />}
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              disabled={loading}
            />
            <InputField
              label="Current CTC"
              icon={<DollarSign className="w-4 h-4 mr-2 text-blue-600" />}
              name="currentCTC"
              value={formData.currentCTC}
              onChange={handleInputChange}
              disabled={loading}
            />
            <InputField
              label="Expected CTC"
              icon={<DollarSign className="w-4 h-4 mr-2 text-blue-600" />}
              name="expectedCTC"
              value={formData.expectedCTC}
              onChange={handleInputChange}
              disabled={loading}
            />
            <InputField
              label="Notice Period"
              icon={<Calendar className="w-4 h-4 mr-2 text-blue-600" />}
              name="noticePeriod"
              value={formData.noticePeriod}
              onChange={handleInputChange}
              disabled={loading}
            />
            <InputField
              label="Skills"
              icon={<Tag className="w-4 h-4 mr-2 text-blue-600" />}
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
              disabled={loading}
            />
            <InputField
              label="LinkedIn Profile"
              icon={<Linkedin className="w-4 h-4 mr-2 text-blue-600" />}
              name="linkedInProfile"
              value={formData.linkedInProfile}
              onChange={handleInputChange}
              disabled={loading}
            />
            <InputField
              label="Status"
              icon={<Info className="w-4 h-4 mr-2 text-blue-600" />}
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              disabled={loading}
            />
            <TextAreaField
              label="Notes"
              icon={<Info className="w-4 h-4 mr-2 text-blue-600" />}
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              disabled={loading}
            />

            {/* Resume */}
            {/* Resume Upload */}
<div>
  <label className="flex flex-col text-sm font-medium text-gray-700 mb-2">
    
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => document.getElementById("resumeInput")?.click()}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        disabled={loading}
      >
        <FileText className="w-4 h-4 mr-2" /> Upload Resume
      </button>
      {resumeFile && (
        <span className="text-gray-600 text-sm truncate max-w-xs">
          {resumeFile.name}
        </span>
      )}
    </div>
  </label>
  <input
    id="resumeInput"
    type="file"
    accept="application/pdf"
    onChange={(e) => setResumeFile(e.target.files ? e.target.files[0] : null)}
    className="hidden"
    disabled={loading}
  />
</div>

          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={resetForm}
              disabled={loading}
              className="flex items-center px-6 py-3 border rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4 mr-2" /> Reset
            </button>
            <button
              type="button"
              onClick={handleAddCandidate}
              disabled={loading}
              className="flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center">
                  <RotateCcw className="animate-spin w-4 h-4 mr-2" /> Adding...
                </span>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" /> Add Candidate
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Input Component
const InputField = ({
  label,
  icon,
  name,
  value,
  onChange,
  type = "text",
  disabled = false,
}: any) => (
  <div>
    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
      {icon} {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
    />
  </div>
);

// Reusable TextArea Component
const TextAreaField = ({
  label,
  icon,
  name,
  value,
  onChange,
  disabled = false,
}: any) => (
  <div>
    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
      {icon} {label}
    </label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
    />
  </div>
);

export default AddCandidatePage;
