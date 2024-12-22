import React, { useState, useEffect } from "react";
import axios from "axios";
import Papa from "papaparse";
const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ source: "" });
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", source: "" });
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page
  const [error, setError] = useState("");
  const uri = process.env.REACT_APP_SERVER_URI;

  // Fetch leads from the backend
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get(`${uri}/api/leads`);
        setLeads(response.data);
        setFilteredLeads(response.data);
      } catch (err) {
        console.error("Error fetching leads:", err.message);
      }
    };
    fetchLeads();
  }, []);

  // handle csv upload.
  const handleCSVUpload =  async(e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fData=new FormData();
    fData.append('file',file);
    console.log(fData,'fData');
    try{
      const response = await axios.post(`${uri}/api/leads/upload`, fData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response.data,'response Data');
    }
    catch(err){
      console.log(err);
    }
   
   
  };

  // Handle search and filters
  useEffect(() => {
    let filtered = leads;

    // Apply search
    if (search) {
      filtered = filtered.filter(
        (lead) =>
          lead.name.toLowerCase().includes(search.toLowerCase()) ||
          lead.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply filters
    if (filters.source) {
      filtered = filtered.filter((lead) => lead.source === filters.source);
    }

    setFilteredLeads(filtered);
    setCurrentPage(1); // Reset to page 1 when filters or search change
  }, [search, filters, leads]);

  // Calculate paginated leads
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstItem, indexOfLastItem);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // Update lead
        const response = await axios.put(`${uri}/api/leads/${editId}`, formData);
        setLeads((prev) => prev.map((lead) => (lead._id === editId ? response.data : lead)));
        setEditId(null);
      } else {
        const response = await axios.post(`${uri}/api/leads`, formData);
        setLeads((prev) => [...prev, response.data]);
      }
      setFormData({ name: "", email: "", phone: "", source: "" });
    } catch (err) {
      setError("Error adding/updating lead.");
      console.error(err.message);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${uri}/api/leads/${id}`);
      setLeads((prev) => prev.filter((lead) => lead._id !== id));
      setSelectedLeads((prev) => prev.filter((leadId) => leadId !== id)); // Remove from selected leads
    } catch (err) {
      setError("Error deleting lead.");
      console.error(err.message);
    }
  };

  // Handle edit
  const handleEdit = (lead) => {
    setFormData({ name: lead.name, email: lead.email, phone: lead.phone, source: lead.source });
    setEditId(lead._id);
  };

  // Handle select all leads
  const handleSelectAll = () => {
    if (selectedLeads.length === currentLeads.length) {
      setSelectedLeads([]); // Deselect all
    } else {
      setSelectedLeads(currentLeads.map((lead) => lead._id)); // Select all
    }
  };

  // Handle individual lead selection
  const handleSelectLead = (id) => {
    if (selectedLeads.includes(id)) {
      setSelectedLeads((prev) => prev.filter((leadId) => leadId !== id)); // Remove from selected
    } else {
      setSelectedLeads((prev) => [...prev, id]); // Add to selected
    }
  };

  // Handle delete selected leads
  const handleDeleteSelected = async () => {
    try {
      for (const id of selectedLeads) {
        await axios.delete(`${uri}/api/leads/${id}`);
      }
      setLeads((prev) => prev.filter((lead) => !selectedLeads.includes(lead._id))); // Remove from UI
      setSelectedLeads([]); // Clear selected leads
    } catch (err) {
      setError("Error deleting selected leads.");
      console.error(err.message);
    }
  };

  // Handle page change
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Leads Management</h2>

      {/* CSV Upload */}
      <div className="mb-6">
        <input
          type="file"
          accept=".csv"
          onChange={handleCSVUpload}
          className="p-2 border rounded"
        />
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {/* Search and Filters */}
      <div className="flex mb-4 gap-4">
        <input
          type="text"
          placeholder="Search leads..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 border rounded w-full"
        />
        <select
          value={filters.source}
          onChange={(e) => setFilters({ ...filters, source: e.target.value })}
          className="p-3 border rounded"
        >
          <option value="">All Sources</option>
          <option value="facebook">Facebook</option>
          <option value="google">Google</option>
          <option value="manual">Manual</option>
        </select>
      </div>

      {/* Bulk Actions */}
      {selectedLeads.length > 0 && (
        <div className="mb-4">
          <button
            onClick={handleDeleteSelected}
            className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete Selected ({selectedLeads.length})
          </button>
        </div>
      )}

      {/* Add/Edit Lead Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="p-3 border rounded w-full"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="p-3 border rounded w-full"
          required
        />
        <input
          type="text"
          placeholder="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="p-3 border rounded w-full"
          required
        />
        <select
          value={formData.source}
          onChange={(e) => setFormData({ ...formData, source: e.target.value })}
          className="p-3 border rounded w-full"
          required
        >
          <option value="">Select Source</option>
          <option value="facebook">Facebook</option>
          <option value="google">Google</option>
          <option value="manual">Manual</option>
        </select>
        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {editId ? "Update Lead" : "Add Lead"}
        </button>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      {/* Leads Table */}
      <table className="w-full bg-white rounded shadow-md">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3">
              <input
                type="checkbox"
                checked={selectedLeads.length === currentLeads.length && selectedLeads.length > 0}
                onChange={handleSelectAll}
              />
            </th>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Phone</th>
            <th className="p-3">Source</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentLeads.map((lead) => (
            <tr key={lead._id} className="border-t">
              <td className="p-3">
                <input
                  type="checkbox"
                  checked={selectedLeads.includes(lead._id)}
                  onChange={() => handleSelectLead(lead._id)}
                />
              </td>
              <td className="p-3">{lead.name}</td>
              <td className="p-3">{lead.email}</td>
              <td className="p-3">{lead.phone}</td>
              <td className="p-3">{lead.source}</td>
              <td className="p-3 flex gap-2">
                <button
                  onClick={() => handleEdit(lead)}
                  className="py-1 px-3 bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(lead._id)}
                  className="py-1 px-3 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={`px-4 py-2 mx-1 rounded ${
              currentPage === i + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Leads;
