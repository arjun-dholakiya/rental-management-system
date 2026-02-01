import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  createQuotation, 
  getMyQuotations, 
  getSingleQuotation, 
  addProductToQuotation 
} from '../../api/quotation';
import { getAllProducts } from '../../api/product';
import { confirmQuotation } from '../../api/rentalOrder';

export default function Quotation() {
  const { id } = useParams();
  const navigate = useNavigate();

  // State
  const [quotations, setQuotations] = useState([]);
  const [quotation, setQuotation] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Initial Load
  useEffect(() => {
    if (id) {
      fetchQuotationDetails();
      fetchProducts();
    } else {
      fetchMyQuotations();
    }
  }, [id]);

  // Data Fetching
  const fetchMyQuotations = async () => {
    setLoading(true);
    try {
      const data = await getMyQuotations();
      setQuotations(data);
    } catch (err) {
      setError('Failed to load quotations.');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuotationDetails = async () => {
    setLoading(true);
    try {
      const data = await getSingleQuotation(id);
      setQuotation(data);
    } catch (err) {
      setError('Failed to load quotation details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await getAllProducts();
      setProducts(res.data || []);
    } catch (err) {
      console.error('Failed to load products');
    }
  };

  // Actions
  const handleCreate = async () => {
    try {
      const newQuotation = await createQuotation();
      navigate(`/quotations/${newQuotation.id || newQuotation._id}`);
    } catch (err) {
      alert('Failed to create quotation');
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    setError('');

    if (!productId || !startDate || !endDate) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      await addProductToQuotation(id, {
        productId,
        quantity,
        startDate,
        endDate
      });
      
      // Reset form and reload
      setProductId('');
      setQuantity(1);
      setStartDate('');
      setEndDate('');
      fetchQuotationDetails();
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      setError(typeof msg === 'string' ? msg : 'Failed to add item');
    }
  };

  const handleConfirm = async () => {
    if (!window.confirm('Confirm this quotation? This will create a rental order.')) return;
    try {
      await confirmQuotation(id);
      navigate('/rental-orders');
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to confirm quotation';
      alert(msg);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  // --- DETAIL VIEW ---
  if (id && quotation) {
    const isDraft = quotation.status === 'draft';

    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start border-b pb-4">
          <div>
            <button 
              onClick={() => navigate('/quotations')}
              className="text-sm text-gray-500 hover:text-black mb-2 block"
            >
              &larr; Back to List
            </button>
            <h1 className="text-3xl font-bold">Quotation #{quotation.id || quotation._id}</h1>
            <p className="text-gray-500">
              Status: <span className={`font-semibold capitalize ${isDraft ? 'text-amber-600' : 'text-green-600'}`}>{quotation.status}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 uppercase tracking-wider">Total Amount</p>
            <p className="text-3xl font-bold text-indigo-600">
              ${Number(quotation.totalAmount || 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-medium text-gray-600">Product</th>
                <th className="p-4 font-medium text-gray-600">Dates</th>
                <th className="p-4 font-medium text-gray-600">Qty</th>
                <th className="p-4 font-medium text-gray-600 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {quotation.items?.map((item, idx) => {
                // Find product name if available in item or from product list
                 const prodName = item.product?.name || products.find(p => (p.id || p._id) === item.productId)?.name || 'Product';
                 return (
                  <tr key={idx}>
                    <td className="p-4">
                      <div className="font-medium">{prodName}</div>
                      <div className="text-xs text-gray-400">ID: {item.productId}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {new Date(item.startDate).toLocaleDateString()} &rarr; {new Date(item.endDate).toLocaleDateString()}
                    </td>
                    <td className="p-4">{item.quantity}</td>
                    <td className="p-4 text-right font-medium">
                      ${Number(item.price).toFixed(2)}
                    </td>
                  </tr>
                 );
              })}
              {(!quotation.items || quotation.items.length === 0) && (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-400">No items added yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add Item Form (Only if Draft) */}
        {isDraft ? (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-bold mb-4">Add Product</h3>
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
            
            <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Product</label>
                <select 
                  className="w-full p-2 border rounded bg-white"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                >
                  <option value="">Select a product...</option>
                  {products.map(p => (
                    <option key={p.id || p._id} value={p.id || p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <input 
                  type="number" 
                  min="1"
                  className="w-full p-2 border rounded"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              <div></div> {/* Spacer on larger screens */}

              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input 
                  type="date" 
                  className="w-full p-2 border rounded"
                  value={startDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <input 
                  type="date" 
                  className="w-full p-2 border rounded"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <div className="md:col-span-2 pt-2">
                <button 
                  type="submit"
                  className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition-colors font-medium"
                >
                  Add to Quotation
                </button>
              </div>
            </form>
          </div>
        ) : (
             <div className="bg-blue-50 text-blue-800 p-4 rounded text-center text-sm font-medium">
               This quotation is confirmed and cannot be modified.
             </div>
        )}

        {/* Confirm Button */}
        {isDraft && (quotation.items?.length > 0) && (
          <button 
            onClick={handleConfirm}
            className="w-full py-4 bg-green-600 text-white rounded-lg font-bold text-lg hover:bg-green-700 shadow-lg"
          >
            Confirm & Create Order
          </button>
        )}
      </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quotations</h1>
        <button 
          onClick={handleCreate}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors font-medium"
        >
          + New Quotation
        </button>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <div className="grid grid-cols-1 gap-4">
        {quotations.map(q => (
          <div 
            key={q.id || q._id}
            onClick={() => navigate(`/quotations/${q.id || q._id}`)}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md cursor-pointer transition-all flex justify-between items-center"
          >
            <div>
              <p className="font-bold text-lg">Quotation #{q.id || q._id}</p>
              <p className="text-sm text-gray-500">Status: <span className="capitalize">{q.status}</span></p>
              <p className="text-sm text-gray-500">{q.items?.length || 0} Items</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-indigo-600">${Number(q.totalAmount || 0).toFixed(2)}</p>
              <span className="text-xs text-gray-400">View Details &rarr;</span>
            </div>
          </div>
        ))}
        {quotations.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
            No quotations found. Create one to get started.
          </div>
        )}
      </div>
    </div>
  );
}
