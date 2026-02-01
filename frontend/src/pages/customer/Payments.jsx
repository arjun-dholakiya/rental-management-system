import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { payInvoice, getInvoicePayments } from '../../api/payment';
import { getSingleInvoice } from '../../api/invoice';

export default function Payments() {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  
  const [invoice, setInvoice] = useState(null);
  const [payments, setPayments] = useState([]);
  
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('Credit Card');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (invoiceId) {
      loadData();
    }
  }, [invoiceId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const inv = await getSingleInvoice(invoiceId);
      setInvoice(inv);
      
      const hist = await getInvoicePayments(invoiceId);
      setPayments(hist || []);

      // Pre-fill full amount
      const due = (inv.totalAmount || 0) - (inv.paidAmount || 0);
      if (due > 0) setAmount(due);
    } catch (err) {
      alert('Failed to load invoice info');
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (e) => {
    e.preventDefault();
    try {
      await payInvoice(invoiceId, {
        amount: Number(amount),
        paymentMethod: method
      });
      alert('Payment Successful');
      loadData(); // Refresh
    } catch (err) {
      alert(err.response?.data?.error || 'Payment failed');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!invoice) return <div className="p-6">Invoice not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button onClick={() => navigate(`/invoices/${invoiceId}`)} className="mb-4 text-blue-600 underline">Back to Invoice</button>
      
      <div className="bg-white p-6 border rounded shadow mb-6">
         <h1 className="text-xl font-bold mb-4">Pay Invoice #{invoice.invoiceNumber}</h1>
         <p className="mb-2">Total Amount: <strong>${invoice.totalAmount}</strong></p>
         <p className="mb-4">Already Paid: <strong className="text-green-600">${invoice.paidAmount || 0}</strong></p>
         
         {invoice.status !== 'paid' ? (
           <form onSubmit={handlePay} className="space-y-4 border-t pt-4">
              <div>
                <label className="block text-sm font-medium mb-1">Amount to Pay</label>
                <input 
                  type="number" 
                  step="0.01"
                  className="w-full p-2 border rounded"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Payment Method</label>
                <select className="w-full p-2 border rounded" value={method} onChange={e => setMethod(e.target.value)}>
                  <option>Credit Card</option>
                  <option>Debit Card</option>
                  <option>Cash</option>
                  <option>Bank Transfer</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">
                Submit Payment
              </button>
           </form>
         ) : (
           <div className="p-3 bg-green-100 text-green-800 rounded text-center font-bold">
             Invoice Fully Paid
           </div>
         )}
      </div>

      <div>
        <h3 className="font-bold mb-2">Payment History</h3>
        <ul className="border rounded divide-y bg-white">
          {payments.map((p, i) => (
            <li key={i} className="p-3 flex justify-between">
              <span>{p.paymentMethod}</span>
              <span className="font-bold">${p.amount}</span>
            </li>
          ))}
          {payments.length === 0 && <li className="p-3 text-gray-500">No payments yet.</li>}
        </ul>
      </div>
    </div>
  );
}
