import  { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { API_BASE } from "../../utils/api";
import { X } from "lucide-react";

interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  experience: string;
  currentCTC: string;
  expectedCTC: string;
  noticePeriod: string;
  skills: string;
  resumeLink: string | null;
  status: string;
  linkedInProfile: string;
  notes: string;
}

const ShowCandidatePage = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [viewModal, setViewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [sendModal, setSendModal] = useState(false);
  const [sendEmail, setSendEmail] = useState("");
  const [callModal, setCallModal] = useState(false);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/candidates/get-all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.code === 1) setCandidates(res.data.data || []);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to fetch candidates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const filteredCandidates = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  const handleView = async (id: number) => {
    const token = sessionStorage.getItem("token");
    const res = await axios.get(`${API_BASE}/candidates/get-by-id/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.data.code === 1) {
      setSelectedCandidate(res.data.data);
      setEditMode(false);
      setViewModal(true);
    }
  };

  const handleUpdate = async () => {
    if (!selectedCandidate) return;
    const token = sessionStorage.getItem("token");
    const res = await axios.put(`${API_BASE}/candidates/update`, selectedCandidate, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    if (res.data.code === 1) {
      toast.success("Candidate updated successfully!");
      setEditMode(false);
      fetchCandidates();
    } else toast.error(res.data.message || "Failed to update candidate");
  };

  const handleDelete = async () => {
    if (!selectedCandidate) return;
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.delete(`${API_BASE}/candidates/delete/${selectedCandidate.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.code === 1) {
        toast.success("Candidate deleted successfully");
        setDeleteModal(false);
        fetchCandidates();
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete candidate");
    }
  };

  const handleSendCandidateDetail = async (email: string, candidateId: number) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE}/ticket/send-candidate-detail?email=${encodeURIComponent(email)}&candidateId=${candidateId}`,
        { email, candidateId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.code === 1) toast.success(res.data.message);
      else toast.error(res.data.message || "Failed to send candidate details");
    } catch {
      toast.error("Something went wrong while sending candidate details");
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading candidates...</span>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Candidates</h1>

      {/* Search & Refresh */}
      <div className="flex items-center mb-4 space-x-2">
        <input
          type="text"
          placeholder="Search candidates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={fetchCandidates}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          <i className="fas fa-sync"></i>
        </button>
      </div>

      {/* Candidates Table */}
      <div className="overflow-x-auto shadow rounded-lg bg-white border border-gray-200">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr className="text-center">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.length ? (
              filteredCandidates.map((c, idx) => (
                <tr key={c.id} className="hover:bg-gray-50 text-center">
                  <td className="p-2 border">{idx + 1}</td>
                  <td className="p-2 border">{c.name}</td>
                  <td className="p-2 border">{c.email}</td>
                  <td className="p-2 border">{c.phone}</td>
                  <td className="p-2 border flex justify-center space-x-3">
                    <button
                      onClick={() => handleView(c.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCandidate(c);
                        setDeleteModal(true);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCandidate(c);
                        setSendEmail("");
                        setSendModal(true);
                      }}
                      className="text-purple-600 hover:text-purple-800"
                    >
                      <i className="fas fa-envelope"></i>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCandidate(c);
                        setCallModal(true);
                      }}
                      className="text-teal-600 hover:text-teal-800"
                    >
                      <i className="fas fa-phone"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No candidates found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Unified View/Edit Modal */}
      {viewModal && selectedCandidate && (
        <Modal title={editMode ? "Edit Candidate" : "Candidate Details"} onClose={() => setViewModal(false)}>
          <div className="space-y-2">
            {editMode ? (
              <>
                <input
                  type="text"
                  value={selectedCandidate.name}
                  onChange={(e) => setSelectedCandidate({ ...selectedCandidate, name: e.target.value })}
                  className="w-full border p-2 rounded"
                  placeholder="Name"
                />
                <input
                  type="email"
                  value={selectedCandidate.email}
                  onChange={(e) => setSelectedCandidate({ ...selectedCandidate, email: e.target.value })}
                  className="w-full border p-2 rounded"
                  placeholder="Email"
                />
                <input
                  type="text"
                  value={selectedCandidate.phone}
                  onChange={(e) => setSelectedCandidate({ ...selectedCandidate, phone: e.target.value })}
                  className="w-full border p-2 rounded"
                  placeholder="Phone"
                />
                <textarea
                  value={selectedCandidate.notes}
                  onChange={(e) => setSelectedCandidate({ ...selectedCandidate, notes: e.target.value })}
                  className="w-full border p-2 rounded"
                  placeholder="Notes"
                />
              </>
            ) : (
              <>
                <p><b>Name:</b> {selectedCandidate.name}</p>
                <p><b>Email:</b> {selectedCandidate.email}</p>
                <p><b>Phone:</b> {selectedCandidate.phone}</p>
                <p><b>Experience:</b> {selectedCandidate.experience}</p>
                <p><b>Current CTC:</b> {selectedCandidate.currentCTC}</p>
                <p><b>Expected CTC:</b> {selectedCandidate.expectedCTC}</p>
                <p><b>Notice Period:</b> {selectedCandidate.noticePeriod}</p>
                <p><b>Skills:</b> {selectedCandidate.skills}</p>
                <p><b>Status:</b> {selectedCandidate.status}</p>
                <p><b>LinkedIn:</b> <a href={selectedCandidate.linkedInProfile} target="_blank" className="text-blue-600 hover:underline">{selectedCandidate.linkedInProfile}</a></p>
                <p><b>Notes:</b> {selectedCandidate.notes}</p>
                {selectedCandidate.resumeLink && (
                  <p><b>Resume:</b> <a href={selectedCandidate.resumeLink} target="_blank" className="text-blue-600 hover:underline">View Resume</a></p>
                )}
              </>
            )}
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            {editMode ? (
              <>
                <button onClick={() => setEditMode(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                <button onClick={handleUpdate} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
              </>
            ) : (
              <>
                <button onClick={() => setEditMode(true)} className="px-4 py-2 bg-green-600 text-white rounded">Edit</button>
                <button onClick={() => setViewModal(false)} className="px-4 py-2 bg-gray-300 rounded">Close</button>
              </>
            )}
          </div>
        </Modal>
      )}

      {/* Delete Modal */}
      {deleteModal && selectedCandidate && (
        <Modal title="Delete Candidate" onClose={() => setDeleteModal(false)}>
          <p>Are you sure you want to delete <b>{selectedCandidate.name}</b>?</p>
          <div className="mt-4 flex justify-end space-x-2">
            <button onClick={() => setDeleteModal(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
            <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
          </div>
        </Modal>
      )}

      {/* Send Candidate Modal */}
      {sendModal && selectedCandidate && (
        <Modal title="Send Candidate Details" onClose={() => setSendModal(false)}>
          <p>Send details of <b>{selectedCandidate.name}</b></p>
          <input
            type="email"
            placeholder="Recipient email"
            value={sendEmail}
            onChange={(e) => setSendEmail(e.target.value)}
            className="w-full border p-2 rounded mt-2 mb-4"
          />
          <div className="flex justify-end space-x-2">
            <button onClick={() => setSendModal(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
            <button onClick={() => { handleSendCandidateDetail(sendEmail, selectedCandidate.id); setSendModal(false); }} className="px-4 py-2 bg-purple-600 text-white rounded">Send</button>
          </div>
        </Modal>
      )}

      {/* Call Modal */}
      {callModal && selectedCandidate && (
        <Modal title="Calling Candidate" onClose={() => setCallModal(false)}>
          <p>Calling <b>{selectedCandidate.name}</b> at <b>{selectedCandidate.phone}</b>...</p>
          <div className="mt-4 flex justify-end">
            <button onClick={() => setCallModal(false)} className="px-4 py-2 bg-teal-600 text-white rounded">End Call</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// Reusable Modal Component
const Modal = ({ title, children, onClose }: any) => (
  <div className="fixed inset-0 flex items-center justify-center p-4 backdrop-blur-sm bg-black/40 z-50">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">{title}</h2>
        <button onClick={onClose}><X className="w-5 h-5 text-gray-600 hover:text-gray-800" /></button>
      </div>
      {children}
    </div>
  </div>
);

export default ShowCandidatePage;
