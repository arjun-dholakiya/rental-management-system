import { useState } from 'react';
import { createProduct, setPricing } from '../../api/product';

export default function CreateProduct() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    quantity: 1,
    rentable: true,
    status: 'available'
  });

  const [price, setPrice] = useState({
    pricePerHour: '',
    pricePerDay: '',
    pricePerWeek: ''
  });

  const submit = async (e) => {
    e.preventDefault();

    const productData = {
      ...form,
      quantity: Number(form.quantity)
    };
    
    // Create product first
    const productRes = await createProduct(productData);
    const productId = productRes.data.id || productRes.data._id; // Handle both id formats

    // Then set pricing
    const priceData = {
      pricePerHour: Number(price.pricePerHour || 0),
      pricePerDay: Number(price.pricePerDay || 0),
      pricePerWeek: Number(price.pricePerWeek || 0)
    };
    await setPricing(productId, priceData);

    alert('Product created successfully');
    window.location.href = '/vendor/products'; // Redirect to list
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex justify-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Add New Product</h1>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <form onSubmit={submit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Product Name</label>
                <input
                  className="input-field w-full p-3 border rounded-lg"
                  placeholder="e.g. Sony A7III Camera"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  className="input-field w-full p-3 border rounded-lg h-32 resize-none"
                  placeholder="Describe the condition, features, etc."
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-2">Inventory Quantity</label>
                 <input
                  type="number"
                  className="input-field w-full p-3 border rounded-lg"
                  placeholder="1"
                  min="1"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                />
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                <select 
                  className="input-field w-full p-3 border rounded-lg bg-white"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="available">Available</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="md:col-span-2 flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                 <input 
                   type="checkbox"
                   id="rentable"
                   className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                   checked={form.rentable}
                   onChange={(e) => setForm({ ...form, rentable: e.target.checked })}
                 />
                 <div>
                   <label htmlFor="rentable" className="font-medium text-slate-900 cursor-pointer select-none">Make Rentable</label>
                   <p className="text-xs text-slate-500">Uncheck to hide this product from rental listings while keeping it in inventory.</p>
                 </div>
              </div>

              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Price Per Hour ($)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-slate-400">$</span>
                    <input
                      type="number"
                      className="input-field w-full p-3 pl-8 border rounded-lg"
                      placeholder="0.00"
                      onChange={(e) => setPrice({ ...price, pricePerHour: e.target.value })}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Price Per Day ($)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-slate-400">$</span>
                    <input
                      type="number"
                      className="input-field w-full p-3 pl-8 border rounded-lg"
                      placeholder="0.00"
                      onChange={(e) => setPrice({ ...price, pricePerDay: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Price Per Week ($)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-slate-400">$</span>
                    <input
                      type="number"
                      className="input-field w-full p-3 pl-8 border rounded-lg"
                      placeholder="0.00"
                      onChange={(e) => setPrice({ ...price, pricePerWeek: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
              <a href="/vendor/products" className="btn-secondary">Cancel</a>
              <button className="btn-primary px-8">Create Product</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
