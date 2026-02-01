import { useState } from 'react';
import { registerUser } from '../../api/auth';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
    companyName: ''
  });

  const submit = async (e) => {
    e.preventDefault();
    await registerUser(form);
    alert('Registered successfully');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-10">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-slate-100">
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-900">Create Account</h2>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input
              className="input-field w-full p-3 border rounded-lg"
              placeholder="John Doe"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input
              className="input-field w-full p-3 border rounded-lg"
              placeholder="you@example.com"
              type="email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              className="input-field w-full p-3 border rounded-lg"
              placeholder="••••••••"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">I am a...</label>
            <select
              className="input-field w-full p-3 border rounded-lg bg-white"
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="customer">Customer (I want to rent)</option>
              <option value="vendor">Vendor (I want to list items)</option>
            </select>
          </div>

          {form.role === 'vendor' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
              <input
                className="input-field w-full p-3 border rounded-lg"
                placeholder="Acme Rentals Inc."
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              />
            </div>
          )}

          <button className="btn-primary w-full py-3 text-lg mt-6">
            Register
          </button>
        </form>
        
        <p className="mt-6 text-center text-slate-600">
          Already have an account? <a href="/login" className="text-indigo-600 font-semibold hover:underline">Sign In</a>
        </p>
      </div>
    </div>
  );
}
