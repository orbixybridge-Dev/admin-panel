'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { approvePaymentLocal, payPaymentLocal } from '@/store/slices/paymentsSlice';
import Table from '@/components/Table';
import { CheckCircle, DollarSign } from 'lucide-react';

export default function PaymentsPage() {
  const dispatch = useAppDispatch();
  const payments = useAppSelector((state) => state.payments.payments);

  const handleApprove = (paymentId) => {
    dispatch(approvePaymentLocal(paymentId));
  };

  const handlePay = (paymentId) => {
    dispatch(payPaymentLocal(paymentId));
  };

  const getStatusBadge = (status) => {
    const colors = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Approved: 'bg-blue-100 text-blue-800',
      Paid: 'bg-green-100 text-green-800',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[status]}`}>
        {status}
      </span>
    );
  };

  const columns = [
    {
      header: 'Request ID',
      accessor: (row) => (
        <span className="font-mono text-sm">{row.requestId}</span>
      ),
    },
    {
      header: 'Doctor Name',
      accessor: (row) => (
        <span className="font-medium">{row.doctorName}</span>
      ),
    },
    {
      header: 'Amount',
      accessor: (row) => (
        <span className="font-semibold text-primary-600">${row.amount.toLocaleString()}</span>
      ),
    },
    {
      header: 'Request Date',
      accessor: (row) => row.requestDate,
    },
    {
      header: 'Status',
      accessor: (row) => getStatusBadge(row.status),
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex space-x-2">
          {row.status === 'Pending' && (
            <button
              onClick={() => handleApprove(row.id)}
              className="flex items-center space-x-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Approve</span>
            </button>
          )}
          {row.status === 'Approved' && (
            <button
              onClick={() => handlePay(row.id)}
              className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-md transition-all text-sm font-medium"
            >
              <DollarSign className="w-4 h-4" />
              <span>Pay Now</span>
            </button>
          )}
          {row.status === 'Paid' && (
            <span className="text-sm text-gray-500">Completed</span>
          )}
        </div>
      ),
    },
  ];

  const totalPending = payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0);
  const totalApproved = payments.filter(p => p.status === 'Approved').reduce((sum, p) => sum + p.amount, 0);
  const totalPaid = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-600 mt-2">Manage payment requests from doctors</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl soft-shadow-lg p-6">
          <p className="text-sm font-medium text-gray-600">Pending Payments</p>
          <p className="text-2xl font-bold text-yellow-600 mt-2">${totalPending.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl soft-shadow-lg p-6">
          <p className="text-sm font-medium text-gray-600">Approved Payments</p>
          <p className="text-2xl font-bold text-blue-600 mt-2">${totalApproved.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl soft-shadow-lg p-6">
          <p className="text-sm font-medium text-gray-600">Paid Amount</p>
          <p className="text-2xl font-bold text-green-600 mt-2">${totalPaid.toLocaleString()}</p>
        </div>
      </div>

      <Table columns={columns} data={payments} />
    </div>
  );
}

