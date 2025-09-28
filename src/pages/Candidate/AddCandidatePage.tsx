import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { API_BASE } from "../../utils/api";
import {
  Save,
  RotateCcw,
  User,
  Mail,
  Phone,
  Briefcase,
  DollarSign,
  Calendar,
  Tag,
  Linkedin,
  Info,
  FileText,
  Upload,
  Download,
} from "lucide-react";

interface UserData {
  id?: number;
  departmentId: number;
  departmentName?: string;
  name: string;
  email?: string;
}

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
    notes: "",
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [bulkUploadLoading, setBulkUploadLoading] = useState(false);
  const [sampleDownloadLoading, setSampleDownloadLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  // Helper function to get user ID from token
  const getUserIdFromToken = (): number | null => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) return null;

      const cleanToken = token.replace('Bearer ', '');
      const payload = JSON.parse(atob(cleanToken.split('.')[1]));
      
      // Check different possible locations for user ID in the token
      if (payload.UserAuthDetails && payload.UserAuthDetails.id) {
        return payload.UserAuthDetails.id;
      }
      if (payload.id) {
        return payload.id;
      }
      if (payload.userId) {
        return payload.userId;
      }
      if (payload.sub) {
        return parseInt(payload.sub);
      }
      
      return null;
    } catch (error) {
      console.error("Error decoding token for user ID:", error);
      return null;
    }
  };

  // Helper function to get proper authorization token
  const getAuthToken = (): string | null => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.error("No token found in sessionStorage");
        return null;
      }

      // Ensure the token has the Bearer prefix
      if (token.startsWith('Bearer ')) {
        return token;
      } else {
        return `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error getting auth token:", error);
      return null;
    }
  };

  // Fetch current user data
  const fetchUserData = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("No authentication token found");
        return;
      }

      // Get user ID from token
      const userId = getUserIdFromToken();
      if (!userId) {
        toast.error("Unable to get user ID from token");
        return;
      }

      console.log("Fetching user data for ID:", userId); // Debug log

      // Fetch current user data using the extracted user ID
      const res = await axios.get(`${API_BASE}/auth/getById/${userId}`, {
        headers: { Authorization: token },
      });
      
      if (res.data.code === 1 && res.data.data) {
        const user = {
          id: res.data.data.id,
          departmentId: res.data.data.departmentId,
          departmentName: res.data.data.departmentName,
          name: res.data.data.name,
          email: res.data.data.email
        };
        
        console.log("User data fetched:", user); // Debug log
        setUserData(user);
        
        // Store user data in sessionStorage for future use
        sessionStorage.setItem("userData", JSON.stringify(user));
      } else {
        toast.error("Failed to fetch user data");
      }
    } catch (error: any) {
      console.error("Error fetching user data:", error);
      toast.error(error?.response?.data?.message || "Failed to fetch user data");
    }
  };

  // Get user data on component mount
  useEffect(() => {
    const initializeUserData = async () => {
      // Try to get user data from sessionStorage first
      const storedUserData = sessionStorage.getItem("userData");
      if (storedUserData) {
        try {
          const parsedUserData = JSON.parse(storedUserData);
          console.log("Using stored user data:", parsedUserData);
          setUserData(parsedUserData);
          return;
        } catch (error) {
          console.error("Error parsing stored user data:", error);
          // Remove corrupted data
          sessionStorage.removeItem("userData");
        }
      }

      // If no valid stored user data, fetch from API
      await fetchUserData();
    };

    initializeUserData();
  }, []);

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
      notes: "",
    });
    setResumeFile(null);
  };

  const handleAddCandidate = async () => {
    const {
      name,
      email,
      phone,
      experience,
      currentCTC,
      expectedCTC,
      noticePeriod,
      skills,
      linkedInProfile,
    } = formData;

    if (
      !name ||
      !email ||
      !phone ||
      !experience ||
      !currentCTC ||
      !expectedCTC ||
      !noticePeriod ||
      !skills ||
      !linkedInProfile
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication token not found");
        return;
      }

      // Step 1: Add candidate
      const res = await axios.post(`${API_BASE}/candidates/add`, formData, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
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
              headers: {
                Authorization: token,
                "Content-Type": "multipart/form-data",
              },
            }
          );
        }

        toast.success("Candidate added successfully!");
        resetForm();
      } else {
        toast.error(res.data.message || "Failed to add candidate");
      }
    } catch (error: any) {
      console.error("Error adding candidate:", error);
      toast.error(error?.response?.data?.message || "Failed to add candidate");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to parse CSV properly with better error handling
  const parseCSV = (text: string): string[][] => {
    const lines = text.trim().split('\n');
    const result: string[][] = [];
    
    for (let line of lines) {
      if (!line.trim()) continue; // Skip empty lines
      
      const values: string[] = [];
      let currentValue = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];
        
        if (char === '"') {
          if (inQuotes && nextChar === '"') {
            // Escaped quote
            currentValue += '"';
            i++; // Skip next quote
          } else {
            // Toggle quote state
            inQuotes = !inQuotes;
          }
        } else if (char === ',' && !inQuotes) {
          // End of value
          values.push(currentValue.trim());
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      
      // Add the last value
      values.push(currentValue.trim());
      result.push(values);
    }
    
    return result;
  };

  // Helper function to parse CSV and add candidates individually as fallback
  const processCsvIndividually = async (file: File) => {
    try {
      console.log("Processing CSV file individually...");
      
      const text = await file.text();
      const rows = parseCSV(text);
      
      if (rows.length < 2) {
        throw new Error("CSV file must have at least a header row and one data row");
      }

      const headers = rows[0].map(h => h.toLowerCase().trim());
      console.log("CSV Headers:", headers);

      // Create field mapping
      const getFieldIndex = (possibleNames: string[]) => {
        for (const name of possibleNames) {
          const index = headers.findIndex(h => h.includes(name.toLowerCase()));
          if (index !== -1) return index;
        }
        return -1;
      };

      const fieldIndices = {
        name: getFieldIndex(['name']),
        email: getFieldIndex(['email']),
        phone: getFieldIndex(['phone']),
        experience: getFieldIndex(['experience', 'exp']),
        currentCTC: getFieldIndex(['currentctc', 'current_ctc', 'current ctc', 'currentctc']),
        expectedCTC: getFieldIndex(['expectedctc', 'expected_ctc', 'expected ctc', 'expectedctc']),
        noticePeriod: getFieldIndex(['noticeperiod', 'notice_period', 'notice period', 'notice']),
        skills: getFieldIndex(['skills', 'skill']),
        linkedInProfile: getFieldIndex(['linkedin', 'linkedinprofile', 'linkedin_profile']),
        notes: getFieldIndex(['notes', 'note', 'comments'])
      };

      console.log("Field indices:", fieldIndices);

      // Validate required fields exist
      const requiredFields = ['name', 'email', 'phone', 'experience', 'currentCTC', 'expectedCTC', 'noticePeriod', 'skills', 'linkedInProfile'];
      const missingFields = requiredFields.filter(field => fieldIndices[field as keyof typeof fieldIndices] === -1);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required columns: ${missingFields.join(', ')}. Please ensure your CSV has all required columns.`);
      }

      let successCount = 0;
      let failCount = 0;
      const errors: string[] = [];

      // Get auth token once
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found");
      }

      // Process each data row
      for (let i = 1; i < rows.length; i++) {
        const values = rows[i];
        
        try {
          // Skip empty rows
          if (values.every(v => !v.trim())) continue;

          const candidateData = {
            name: values[fieldIndices.name]?.trim() || '',
            email: values[fieldIndices.email]?.trim() || '',
            phone: values[fieldIndices.phone]?.trim() || '',
            experience: values[fieldIndices.experience]?.trim() || '',
            currentCTC: values[fieldIndices.currentCTC]?.trim() || '',
            expectedCTC: values[fieldIndices.expectedCTC]?.trim() || '',
            noticePeriod: values[fieldIndices.noticePeriod]?.trim() || '',
            skills: values[fieldIndices.skills]?.trim() || '',
            linkedInProfile: values[fieldIndices.linkedInProfile]?.trim() || '',
            notes: fieldIndices.notes !== -1 ? (values[fieldIndices.notes]?.trim() || '') : ''
          };

          // Validate required fields
          const requiredFieldsData = [
            candidateData.name,
            candidateData.email,
            candidateData.phone,
            candidateData.experience,
            candidateData.currentCTC,
            candidateData.expectedCTC,
            candidateData.noticePeriod,
            candidateData.skills,
            candidateData.linkedInProfile
          ];

          if (requiredFieldsData.some(field => !field)) {
            errors.push(`Row ${i + 1}: Missing required data for candidate ${candidateData.name || 'unnamed'}`);
            failCount++;
            continue;
          }

          // Validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(candidateData.email)) {
            errors.push(`Row ${i + 1}: Invalid email format for ${candidateData.name}`);
            failCount++;
            continue;
          }

          console.log(`Adding candidate ${i}: ${candidateData.name}`);

          const response = await axios.post(`${API_BASE}/candidates/add`, candidateData, {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          });

          if (response.data.code === 1) {
            successCount++;
            console.log(`✓ Successfully added: ${candidateData.name}`);
          } else {
            const errorMsg = response.data.message || 'Unknown error';
            errors.push(`Row ${i + 1}: ${errorMsg} - ${candidateData.name}`);
            failCount++;
          }

        } catch (error: any) {
          console.error(`Error processing row ${i + 1}:`, error);
          const errorMsg = error.response?.data?.message || error.message;
          errors.push(`Row ${i + 1}: ${errorMsg}`);
          failCount++;
        }

        // Add delay to avoid overwhelming server
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Show results
      if (successCount > 0 && failCount === 0) {
        toast.success(`Successfully added all ${successCount} candidates!`);
      } else if (successCount > 0) {
        toast.success(`Added ${successCount} candidates successfully. ${failCount} failed.`);
        console.warn("Failed candidates:", errors);
      } else {
        toast.error(`Failed to add any candidates. ${failCount} errors occurred.`);
        console.error("All errors:", errors);
      }

      return { success: successCount > 0, successCount, failCount, errors };

    } catch (error: any) {
      console.error("Error processing CSV individually:", error);
      throw error;
    }
  };

  // Bulk upload handler with correct API endpoint
  const handleBulkUpload = async (file: File) => {
    // Validate file type
    if (!file.name.toLowerCase().endsWith('.csv') && !file.name.toLowerCase().endsWith('.xlsx')) {
      toast.error("Please upload a CSV or Excel (.xlsx) file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error("File size too large. Please upload a file smaller than 10MB.");
      return;
    }

    setBulkUploadLoading(true);
    
    try {
      const rawToken = sessionStorage.getItem("token");
      if (!rawToken) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      console.log("Starting bulk upload to correct endpoint...");
      console.log("File details:", { 
        name: file.name, 
        size: file.size, 
        type: file.type 
      });

      const formData = new FormData();
      formData.append("file", file);

      // Use the correct bulk upload endpoint
      const correctEndpoint = "http://13.127.232.90:8081/import/candidates";

      try {
        console.log("Uploading to:", correctEndpoint);
        
        // Try with raw token (as seen in your network request)
        const response = await axios.post(correctEndpoint, formData, {
          headers: {
            // Use raw token without Bearer prefix (as seen in your network logs)
            Authorization: rawToken.replace('Bearer ', '').trim(),
            // Let browser set Content-Type automatically for multipart/form-data
          },
          timeout: 60000, // 60 seconds timeout for large files
          maxContentLength: 50 * 1024 * 1024, // 50MB
          maxBodyLength: 50 * 1024 * 1024,
        });

        console.log("Bulk upload response:", response.data);

        // Check for success response
        if (response.data.code === 1 || response.status === 200 || response.data.success) {
          const message = response.data.message || "Bulk upload completed successfully!";
          const count = response.data.count || response.data.totalCount || "multiple";
          
          toast.success(`${message} ${count !== "multiple" ? `(${count} candidates added)` : ""}`);
          
          console.log("✅ Bulk upload successful!");
          return;
        } else {
          // If response doesn't indicate success, throw error
          throw new Error(response.data.message || "Upload failed - unknown error");
        }

      } catch (uploadError: any) {
        console.error("Bulk upload failed:", uploadError);
        
        // Handle specific error cases
        if (uploadError.response) {
          const status = uploadError.response.status;
          const errorMessage = uploadError.response.data?.message || uploadError.response.statusText;
          
          console.error("Upload error details:", {
            status,
            message: errorMessage,
            data: uploadError.response.data
          });

          switch (status) {
            case 400:
              toast.error("Invalid file format or data. Please check your CSV/Excel file format and ensure all required columns are present.");
              break;
            case 401:
              toast.error("Authentication failed. Please logout and login again.");
              break;
            case 403:
              toast.error("Access denied. You may not have permission to bulk upload candidates.");
              break;
            case 413:
              toast.error("File too large. Please use a smaller file (under 10MB).");
              break;
            case 415:
              toast.error("Unsupported file type. Please upload a CSV or Excel (.xlsx) file.");
              break;
            case 422:
              toast.error(`Data validation error: ${errorMessage}. Please check your file format and data.`);
              break;
            case 500:
              toast.error("Server error occurred. Please try again later or contact support.");
              break;
            default:
              toast.error(errorMessage || `Upload failed with error ${status}. Please try again.`);
          }
        } else if (uploadError.request) {
          toast.error("Network error. Please check your internet connection and try again.");
        } else {
          toast.error("Upload failed. Please check your file and try again.");
        }

        // For CSV files, offer fallback to individual processing
        if (file.name.toLowerCase().endsWith('.csv')) {
          console.log("Offering fallback to individual processing...");
          
          try {
            toast.loading("Processing candidates individually as fallback...", { duration: 2000 });
            await processCsvIndividually(file);
            return; // Success via fallback
          } catch (fallbackError) {
            console.error("Fallback processing also failed:", fallbackError);
            toast.error("Both bulk upload and individual processing failed. Please check your file format.");
          }
        }
      }

    } catch (error: any) {
      console.error("Bulk upload process failed:", error);
      toast.error("Upload process failed. Please try again.");
    } finally {
      setBulkUploadLoading(false);
    }
  };

  // Handle bulk upload button click
  const handleBulkUploadClick = () => {
    document.getElementById("bulkUploadInput")?.click();
  };

  // Download sample data format handler
  const handleSampleDownload = async () => {
    setSampleDownloadLoading(true);
    
    try {
      // Enhanced sample CSV data with exact format needed
      const sampleData = `NAME,EMAIL,PHONE,EXPERIENCE,CURRENTCTC,EXPECTEDCTC,NOTICEPERIOD,SKILLS,LINKEDIN,NOTES
John Doe,john.doe@email.com,9876543210,3 years,5 LPA,7 LPA,1 month,"React, Node.js, JavaScript",https://linkedin.com/in/johndoe,Excellent candidate with good technical skills
Jane Smith,jane.smith@email.com,8765432109,5 years,8 LPA,12 LPA,2 months,"Python, Django, PostgreSQL",https://linkedin.com/in/janesmith,Senior developer with leadership experience
Mike Johnson,mike.johnson@email.com,7654321098,2 years,3.5 LPA,5 LPA,Immediate,"HTML, CSS, JavaScript, Vue.js",https://linkedin.com/in/mikejohnson,Junior developer eager to learn
Sarah Wilson,sarah.wilson@email.com,6543210987,4 years,6 LPA,9 LPA,3 weeks,"Java, Spring Boot, MySQL",https://linkedin.com/in/sarahwilson,Full-stack developer with team lead experience
David Brown,david.brown@email.com,5432109876,1 year,2.5 LPA,4 LPA,2 weeks,"PHP, Laravel, MongoDB",https://linkedin.com/in/davidbrown,Fresh graduate with internship experience`;

      const blob = new Blob([sampleData], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'candidates_sample_format.csv';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("Sample format downloaded successfully!");
      
    } catch (error: any) {
      console.error("Sample download error:", error);
      toast.error("Failed to download sample format. Please try again.");
    } finally {
      setSampleDownloadLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header with Bulk Upload */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Add Candidate
            </h1>
            <p className="text-gray-500 mt-1">
              Fill out the form to add a new candidate and upload resume.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Sample Format Download */}
            <button
              type="button"
              onClick={handleSampleDownload}
              disabled={sampleDownloadLoading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              title="Download sample CSV format for bulk upload"
            >
              {sampleDownloadLoading ? (
                <>
                  <RotateCcw className="animate-spin w-4 h-4 mr-2" /> Downloading...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" /> Sample Format
                </>
              )}
            </button>

            {/* Bulk Upload */}
            <input
              id="bulkUploadInput"
              type="file"
              accept=".csv,.xlsx"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleBulkUpload(e.target.files[0]);
                  e.target.value = '';
                }
              }}
            />
            <button
              type="button"
              onClick={handleBulkUploadClick}
              disabled={bulkUploadLoading}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              title="Upload CSV or Excel file with multiple candidates - will be automatically added"
            >
              {bulkUploadLoading ? (
                <>
                  <RotateCcw className="animate-spin w-4 h-4 mr-2" /> Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" /> Bulk Upload
                </>
              )}
            </button>
          </div>
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
              label="Experience*"
              icon={<Briefcase className="w-4 h-4 mr-2 text-blue-600" />}
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              disabled={loading}
            />
            <InputField
              label="Current CTC*"
              icon={<DollarSign className="w-4 h-4 mr-2 text-blue-600" />}
              name="currentCTC"
              value={formData.currentCTC}
              onChange={handleInputChange}
              disabled={loading}
            />
            <InputField
              label="Expected CTC*"
              icon={<DollarSign className="w-4 h-4 mr-2 text-blue-600" />}
              name="expectedCTC"
              value={formData.expectedCTC}
              onChange={handleInputChange}
              disabled={loading}
            />
            <InputField
              label="Notice Period*"
              icon={<Calendar className="w-4 h-4 mr-2 text-blue-600" />}
              name="noticePeriod"
              value={formData.noticePeriod}
              onChange={handleInputChange}
              disabled={loading}
            />
            <InputField
              label="Skills*"
              icon={<Tag className="w-4 h-4 mr-2 text-blue-600" />}
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
              disabled={loading}
            />
            <InputField
              label="LinkedIn Profile*"
              icon={<Linkedin className="w-4 h-4 mr-2 text-blue-600" />}
              name="linkedInProfile"
              value={formData.linkedInProfile}
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
            <div>
              <label className="flex flex-col text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById("resumeInput")?.click()
                    }
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
                onChange={(e) =>
                  setResumeFile(e.target.files ? e.target.files[0] : null)
                }
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
      rows={3}
    />
  </div>
);

export default AddCandidatePage;