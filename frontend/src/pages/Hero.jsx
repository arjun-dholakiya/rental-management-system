import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col justify-center items-center p-6 text-center">
      <div className="max-w-3xl space-y-8 animate-fade-in-up">
        <h1 className="text-6xl font-extrabold text-slate-900 tracking-tight">
          Rental Management <span className="text-indigo-600">System</span>
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
          A seamless platform for managing rentals, quotations, orders, and
          payments. Streamline your workflow with our intuitive tools.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-2xl mx-auto mt-10">
          <FeatureCard
            title="Browse Products"
            desc="Explore our catalog of rentable items."
            onClick={() => navigate('/products')}
          />
          <FeatureCard
            title="Create Quotations"
            desc="Add items to cart and generate instant quotes."
            onClick={() => navigate('/quotations')}
          />
          <FeatureCard
            title="Track Orders"
            desc="Monitor rental status and returns."
            onClick={() => navigate('/rental-orders')}
          />
          <FeatureCard
            title="Manage Invoices"
            desc="View bills and process payments securely."
            onClick={() => navigate('/invoices')}
          />
        </div>

        <div className="flex gap-4 justify-center mt-12">
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-3 bg-indigo-600 text-white rounded-full font-bold shadow-lg hover:bg-indigo-700 hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-1"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate('/availability')}
            className="px-8 py-3 bg-white text-indigo-900 border border-indigo-100 rounded-full font-bold shadow hover:bg-indigo-50 transition-all"
          >
            Check Availability
          </button>
        </div>
      </div>

      <footer className="mt-20 text-slate-400 text-sm">
        © 2026 Arjun Dholakiya. All rights reserved.
      </footer>
    </div>
  );
}

function FeatureCard({ title, desc, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer group"
    >
      <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
        {title} &rarr;
      </h3>
      <p className="text-slate-500 mt-2 text-sm">{desc}</p>
    </div>
  );
}
