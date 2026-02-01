import React, { useState, useEffect } from 'react';
import { getAllProducts } from '../../api/product';
import { checkAvailability } from '../../api/reservation';

export default function Availability() {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    getAllProducts().then(res => setProducts(res.data || [])).catch(console.error);
  }, []);

  const handleCheck = async () => {
    if (!productId || !startDate || !endDate) {
      alert('Please fill all fields');
      return;
    }
    try {
      const res = await checkAvailability(productId, startDate, endDate);
      setResult(res.available);
    } catch (err) {
      alert('Error checks availability');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white border rounded shadow mt-10">
      <h1 className="text-2xl font-bold mb-6">Check Product Availability</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Product</label>
          <select 
            className="w-full p-2 border rounded" 
            value={productId} 
            onChange={e => setProductId(e.target.value)}
          >
            <option value="">Select Product</option>
            {products.map(p => (
              <option key={p.id || p._id} value={p.id || p._id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input 
              type="date" 
              className="w-full p-2 border rounded"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input 
              type="date" 
              className="w-full p-2 border rounded"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <button 
          onClick={handleCheck}
          className="w-full bg-black text-white py-2 rounded font-bold"
        >
          Check Availability
        </button>

        {result !== null && (
          <div className={`p-4 rounded text-center font-bold ${result ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {result ? 'Available ✅' : 'Not Available ❌'}
          </div>
        )}
      </div>
    </div>
  );
}
