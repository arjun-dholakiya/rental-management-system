import { useEffect, useState } from 'react';
import { getAllProducts, deleteProduct, getProductById } from '../../api/product';

export default function VendorProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    load();
  }, []);
  
  const load = async () => {
    try {
      const res = await getAllProducts(); // Backend: returns basic list without pricing
      const basicProducts = res.data;
      
      // Hydrate with full details (including pricing) in parallel
      const detailedProducts = await Promise.all(
        basicProducts.map(async (p) => {
           try {
             // Backend: getProductById returns full details with pricing
             const detailRes = await getProductById(p.id || p._id);
             return detailRes.data;
           } catch (err) {
             console.error(`Failed to load details for ${p.id}`, err);
             return p; // Fallback to basic info
           }
        })
      );
      
      setProducts(detailedProducts);
    } catch (err) {
      console.error("Failed to load products", err);
    }
  };

  const remove = async (id) => {
    await deleteProduct(id);
    load();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">My Products</h1>
        <a href="/vendor/create-product" className="btn-primary flex items-center gap-2">
          + Add New
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p.id} className="card group hover:shadow-md transition-shadow">
            <div className="h-40 bg-slate-100 flex items-center justify-center text-slate-400">
               {/* Placeholder for Product Image */}
               <span className="text-4xl">📦</span>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-slate-900">{p.name}</h3>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${p.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {p.status}
                </span>
              </div>
              <p className="text-slate-600 text-sm line-clamp-2 mb-4">{p.description || "No description provided."}</p>
              
              <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-2">
                 <span className="font-bold text-indigo-600">
                    {p.pricing ? `$${p.pricing.pricePerDay}/day` : 'Price not set'}
                 </span>
                 <button 
                  className="text-red-500 hover:text-red-700 text-sm font-medium hover:underline" 
                  onClick={() => remove(p.id)}
                 >
                   Delete
                 </button>
              </div>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="col-span-full text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <h3 className="text-xl font-medium text-slate-600">No products found</h3>
            <p className="text-slate-500 mt-2">Start by adding your first product to the inventory.</p>
          </div>
        )}
      </div>
    </div>
  );
}
