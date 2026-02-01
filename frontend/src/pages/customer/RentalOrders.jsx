import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMyRentalOrders, getSingleRentalOrder } from '../../api/rentalOrder';
import { createInvoice } from '../../api/invoice';

export default function RentalOrders() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchOrder();
    } else {
      fetchOrders();
    }
  }, [id]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getMyRentalOrders();
      setOrders(data || []);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const data = await getSingleRentalOrder(id);
      setOrder(data);
    } catch (err) {
      setError('Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateInvoice = async () => {
    if (!order) return;
    try {
      const invoice = await createInvoice(order.id || order._id);
      navigate(`/invoices/${invoice.id || invoice._id}`);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to generate invoice');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  // Detail View
  if (id && order) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <button onClick={() => navigate('/rental-orders')} className="mb-4 text-blue-600 underline">Back</button>
        <h1 className="text-2xl font-bold mb-4">Rental Order #{order.id || order._id}</h1>
        <div className="bg-white p-6 shadow rounded border">
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total Amount:</strong> ${order.totalAmount}</p>
          <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
          
          <div className="mt-4">
            <h3 className="font-bold">Items</h3>
            <ul className="list-disc pl-5">
              {order.items?.map((item, idx) => (
                <li key={idx}>
                   Item {idx + 1}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex gap-4">
             <button 
               onClick={handleGenerateInvoice}
               className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
             >
               Generate Invoice
             </button>
             <button 
               onClick={() => navigate(`/return/${order.id || order._id}`)}
               className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
             >
               Return Items
             </button>
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Rental Orders</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="space-y-4">
        {orders.map(o => (
          <div key={o.id || o._id} className="border p-4 rounded shadow hover:bg-gray-50 flex justify-between items-center">
            <div>
              <h3 className="font-bold">Order #{o.id || o._id}</h3>
              <p className="text-sm text-gray-600">Total: ${o.totalAmount} | Status: {o.status}</p>
            </div>
            <button onClick={() => navigate(`/rental-orders/${o.id || o._id}`)} className="text-blue-600">View</button>
          </div>
        ))}
        {orders.length === 0 && <p>No rental orders found.</p>}
      </div>
    </div>
  );
}
