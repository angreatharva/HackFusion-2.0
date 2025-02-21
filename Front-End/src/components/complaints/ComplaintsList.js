// mern-frontend/src/components/complaints/ComplaintsList.js
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const ComplaintsList = ({ userRole }) => {
  // Declare state variables for complaints, loading, error, page, totalPages, and filter.
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all');

  const fetchComplaints = async () => {
    try {
      // Use relative URL so the proxy takes effect.
      const response = await fetch(
        `/api/complaints?page=${page}&status=${filter !== 'all' ? filter : ''}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch complaints');
      }

      setComplaints(data.data);
      setTotalPages(data.pagination.pages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [page, filter]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { className: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      approved: { className: 'bg-green-100 text-green-800', label: 'Approved' },
      rejected: { className: 'bg-red-100 text-red-800', label: 'Rejected' },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Complaints</h2>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-md flex items-center">
          <AlertCircle className="mr-2 h-5 w-5" />
          {error}
        </div>
      )}

      <div className="space-y-4">
        {complaints.map((complaint) => (
          <Card key={complaint._id} className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{complaint.title}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </p>
              </div>
              {getStatusBadge(complaint.status)}
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{complaint.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <Badge className="bg-blue-100 text-blue-800">{complaint.category}</Badge>
                {userRole === 'boardMember' && complaint.status === 'approved' && (
                  <button
                    onClick={() =>
                      (window.location.href = `/complaints/${complaint._id}/reveal`)
                    }
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Request Identity Reveal
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {complaints.length === 0 && (
        <div className="text-center py-8 text-gray-500">No complaints found.</div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ComplaintsList;
