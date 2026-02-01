import { useEffect, useState } from 'react';
import { getAllProducts, getProductById } from '../../api/product';

export default function Products() {
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
             return detailRes.data; // This object will have the 'pricing' field
           } catch (err) {
             console.error(`Failed to load details for ${p.id}`, err);
             return p; 
           }
        })
      );
      
      setProducts(detailedProducts);
    } catch (err) {
      console.error("Failed to load products", err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Explore Rentals</h1>
        <p className="text-slate-500 mt-2">Find the perfect equipment for your next project.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((p) => (
          <div key={p.id} className="card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
            <div className="h-48 bg-slate-100 flex items-center justify-center text-slate-300">
               <span className="text-5xl">📷</span>
            </div>
            <div className="p-5">
               <div className="flex justify-between items-start mb-2">
                 <h2 className="font-bold text-lg text-slate-900 line-clamp-1">{p.name}</h2>
               </div>
              <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10">{p.description || "No description available."}</p>
              
              <div className="flex items-center justify-between mt-4">
                 <span className={`text-xs px-2 py-1 rounded-full ${p.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                   {p.status}
                 </span>
                 <span className="font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">
                    {p.pricing ? `$${p.pricing.pricePerDay}/day` : 'N/A'}
                 </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
