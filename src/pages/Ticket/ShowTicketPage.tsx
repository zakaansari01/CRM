import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { API_BASE } from "../../utils/api";
import { X } from "lucide-react";

const ShowTicketPage = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [viewModal, setViewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const [logHistory, setLogHistory] = useState<any[]>([]);
  const [editForm, setEditForm] = useState({
    id: 0,
    ticketId: 0,
    remarks: "",
    status: "",
    nextFollowUpDate: "",
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/ticket/get-all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.code === 1) setTickets(res.data.data);
      else toast.error(res.data.message || "Failed to fetch tickets");
    } catch {
      toast.error("Error fetching tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedTicket) return;
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.delete(`${API_BASE}/ticket/delete/${selectedTicket.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.code === 1) {
        toast.success("Ticket deleted successfully");
        setDeleteModal(false);
        fetchTickets();
      } else toast.error(res.data.message || "Failed to delete ticket");
    } catch {
      toast.error("Error deleting ticket");
    }
  };

  const handleView = async (ticket: any) => {
    setSelectedTicket(ticket);
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/log-history/get-by-ticket-id?ticketId=${ticket.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.code === 1) {
        setLogHistory(res.data.data || []);
        setViewModal(true);
      } else toast.error(res.data.message || "Failed to fetch log history");
    } catch {
      toast.error("Error fetching log history");
    }
  };

  const handleEdit = (ticket: any) => {
    setEditForm({
      id: 0,
      ticketId: ticket.id,
      remarks: "",
      status: ticket.status,
      nextFollowUpDate: ticket.nextFollowUpDate,
    });
    setEditModal(true);
  };

  const handleAddLogHistory = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.post(`${API_BASE}/log-history/add`, editForm, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (res.data.code === 1) {
        toast.success("Log history added successfully");
        setEditModal(false);
        fetchTickets();
      } else toast.error(res.data.message || "Failed to add log history");
    } catch {
      toast.error("Error adding log history");
    }
  };

  const filteredTickets = tickets.filter(
    (t) =>
      t.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      t.assignedTo.toLowerCase().includes(search.toLowerCase()) ||
      t.ticketId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Tickets</h1>

      {/* Search + Refresh */}
      <div className="flex items-center mb-4 space-x-2">
        <input
          type="text"
          placeholder="Search tickets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={fetchTickets}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          <i className="fas fa-sync"></i>
        </button>
      </div>

      {/* Tickets Table */}
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr className="text-center">
              <th className="p-2 border">Ticket ID</th>
              <th className="p-2 border">Candidate</th>
              <th className="p-2 border">Assigned To</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Next Follow Up</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.length ? (
              filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="text-center hover:bg-gray-50">
                  <td className="p-2 border">{ticket.ticketId}</td>
                  <td className="p-2 border">{ticket.candidateName}</td>
                  <td className="p-2 border">{ticket.assignedTo}</td>
                  <td className="p-2 border">{ticket.status}</td>
                  <td className="p-2 border">{ticket.nextFollowUpDate}</td>
                  <td className="p-2 border space-x-3">
                    <button onClick={() => handleView(ticket)} className="text-blue-600 hover:text-blue-800">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button onClick={() => handleEdit(ticket)} className="text-green-600 hover:text-green-800">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => { setSelectedTicket(ticket); setDeleteModal(true); }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan={6}>
                  {loading ? "Loading..." : "No tickets found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- View Modal --- */}
      {viewModal && selectedTicket && (
        <Modal title="Ticket Details & Log History" onClose={() => setViewModal(false)}>
          <p><strong>Ticket ID:</strong> {selectedTicket.ticketId}</p>
          <p><strong>Candidate:</strong> {selectedTicket.candidateName}</p>
          <p><strong>Assigned To:</strong> {selectedTicket.assignedTo}</p>
          <p><strong>Status:</strong> {selectedTicket.status}</p>
          <p><strong>Remarks:</strong> {selectedTicket.remarks}</p>
          <p><strong>Next Follow Up:</strong> {selectedTicket.nextFollowUpDate}</p>

          <h3 className="mt-4 font-semibold">Log History</h3>
          {logHistory.length ? (
            <div className="space-y-3 mt-2">
              {logHistory.map((log, idx) => (
                <div key={idx} className="p-3 border-l-4 border-blue-600 bg-blue-50 rounded-r shadow-sm">
                  <p className="text-sm text-gray-700"><strong>{log.status}</strong></p>
                  <p className="text-gray-800">{log.remarks}</p>
                  <p className="text-sm text-gray-500">Next Follow Up: {log.nextFollowUpDate}</p>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-500 mt-2">No log history found.</p>}
        </Modal>
      )}

      {editModal && (
        <Modal title="Add Log History" onClose={() => setEditModal(false)}>
          <div className="space-y-3">
            <select
              value={editForm.status}
              onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
              className="w-full border p-2 rounded"
            >
              <option value="">Select Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="On Hold">On Hold</option>
              <option value="Closed">Closed</option>
            </select>

            <textarea
              value={editForm.remarks}
              onChange={(e) => setEditForm({ ...editForm, remarks: e.target.value })}
              placeholder="Remarks"
              className="w-full border p-2 rounded"
            />

            <input
              type="date"
              value={editForm.nextFollowUpDate}
              onChange={(e) => setEditForm({ ...editForm, nextFollowUpDate: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="mt-4 flex justify-end space-x-2">
            <button onClick={() => setEditModal(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
            <button onClick={handleAddLogHistory} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
          </div>
        </Modal>
      )}

      {deleteModal && selectedTicket && (
        <Modal title="Confirm Delete" onClose={() => setDeleteModal(false)}>
          <p>Are you sure you want to delete ticket <b>{selectedTicket.ticketId}</b>?</p>
          <div className="mt-4 flex justify-around">
            <button onClick={() => setDeleteModal(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
            <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// Reusable Modal Component with background blur
const Modal = ({ title, children, onClose }: any) => (
  <div className="fixed inset-0 flex items-center justify-center p-4 backdrop-blur-sm z-50">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto p-6 relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">{title}</h2>
        <button onClick={onClose}><X className="w-5 h-5 text-gray-600 hover:text-gray-800" /></button>
      </div>
      {children}
    </div>
  </div>
);

export default ShowTicketPage;
