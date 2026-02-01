import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMyInvoices, getSingleInvoice } from '../../api/invoice';

export default function Invoices() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchInvoice();
    } else {
      fetchInvoices();
    }
  }, [id]);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const data = await getMyInvoices();
      setInvoices(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoice = async () => {
    setLoading(true);
    try {
      const data = await getSingleInvoice(id);
      setInvoice(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  // Detail View
  if (id && invoice) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <button onClick={() => navigate('/invoices')} className="mb-4 text-blue-600 underline">Back</button>
        <div className="border p-6 rounded shadow bg-white">
          <h1 className="text-2xl font-bold mb-4">Invoice #{invoice.invoiceNumber || invoice.id || invoice._id}</h1>
          <div className="grid grid-cols-2 gap-4 mb-6">
             <div>
               <p className="text-gray-600">Status</p>
               <p className="font-bold uppercase">{invoice.status}</p>
             </div>
             <div>
               <p className="text-gray-600">Total Amount</p>
               <p className="font-bold text-xl">${invoice.totalAmount}</p>
             </div>
             <div>
               <p className="text-gray-600">Paid Amount</p>
               <p className="font-bold text-green-600">${invoice.paidAmount || 0}</p>
             </div>
             <div>
               <p className="text-gray-600">Rental Order ID</p>
               <p>{invoice.rentalOrderId}</p>
             </div>
          </div>
          
          {invoice.status !== 'paid' && (
            <button 
              onClick={() => navigate(`/payments/${invoice.id || invoice._id}`)}
              className="w-full bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700"
            >
              Pay Now
            </button>
          )}
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Invoices</h1>
      <div className="space-y-3">
        {invoices.map(inv => (
          <div key={inv.id || inv._id} className="p-4 border rounded flex justify-between items-center hover:bg-gray-50">
             <div>
               <p className="font-bold">#{inv.invoiceNumber}</p>
               <p className="text-sm">Total: ${inv.totalAmount} | Paid: ${inv.paidAmount || 0}</p>
             </div>
             <div>
               <span className={`px-2 py-1 rounded text-xs font-bold uppercase mr-4 ${inv.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                 {inv.status}
               </span>
               <button onClick={() => navigate(`/invoices/${inv.id || inv._id}`)} className="text-blue-600 underline">View</button>
             </div>
          </div>
        ))}
        {invoices.length === 0 && <p>No invoices found.</p>}
      </div>
    </div>
  );
}
