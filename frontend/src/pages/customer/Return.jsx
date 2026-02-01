import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createReturn, getReturn } from '../../api/return';
import { getSingleRentalOrder } from '../../api/rentalOrder';

export default function ReturnPage() {
  const { rentalOrderId } = useParams();
  const navigate = useNavigate();
  
  const [returnDetails, setReturnDetails] = useState(null);
  const [order, setOrder] = useState(null);
  const [lateFee, setLateFee] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [rentalOrderId]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Try to get existing return
      try {
        const ret = await getReturn(rentalOrderId);
        setReturnDetails(ret);
      } catch (e) {
        // No return found, normal
      }
      
      const ord = await getSingleRentalOrder(rentalOrderId);
      setOrder(ord);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async () => {
    if (!window.confirm('Confirm return items?')) return;
    try {
      await createReturn(rentalOrderId, { lateFee: Number(lateFee) });
      alert('Return processed!');
      loadData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to process return');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button onClick={() => navigate(`/rental-orders/${rentalOrderId}`)} className="mb-4 text-blue-600 underline">Back to Order</button>
      
      <div className="bg-white p-8 rounded shadow border">
         <h1 className="text-2xl font-bold mb-4">Return Items</h1>
         {order && (
           <div className="mb-6 p-4 bg-gray-50 rounded">
             <p><strong>Order ID:</strong> {order.id || order._id}</p>
             <p><strong>Items:</strong> {order.items?.length || 0}</p>
           </div>
         )}
         
         {returnDetails ? (
           <div className="bg-green-50 p-6 rounded border border-green-200 text-center">
             <h2 className="text-xl font-bold text-green-800 mb-2">Return Completed</h2>
             <p>Date: {new Date(returnDetails.returnDate).toLocaleString()}</p>
             <p>Late Fee Paid: <strong>${returnDetails.lateFee}</strong></p>
           </div>
         ) : (
           <div>
             <div className="mb-4">
               <label className="block text-sm font-medium mb-1">Late Fee (if any)</label>
               <input 
                 type="number" 
                 min="0"
                 className="w-full p-2 border rounded"
                 value={lateFee}
                 onChange={e => setLateFee(e.target.value)}
                 placeholder="0.00"
               />
               <p className="text-xs text-gray-500 mt-1">Authorized staff usually enters this.</p>
             </div>
             
             <button 
               onClick={handleReturn}
               className="w-full bg-red-600 text-white py-3 rounded font-bold hover:bg-red-700"
             >
               Confirm Return
             </button>
           </div>
         )}
      </div>
    </div>
  );
}
