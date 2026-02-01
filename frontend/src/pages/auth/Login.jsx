import { useState } from 'react';
import { loginUser } from '../../api/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({ email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      const role = res.data.user.role;
      if (role === 'vendor') {
        window.location.href = '/vendor/products';
      } else {
        window.location.href = '/products';
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-slate-100">
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-900">Welcome Back</h2>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium">{error}</div>}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input
              className="input-field w-full p-3 border rounded-lg"
              placeholder="you@example.com"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              className="input-field w-full p-3 border rounded-lg"
              type="password"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="btn-primary w-full py-3 text-lg mt-6">
            Sign In
          </button>
        </form>
        
        <p className="mt-6 text-center text-slate-600">
          Don't have an account? <a href="/register" className="text-indigo-600 font-semibold hover:underline">Register</a>
        </p>
      </div>
    </div>
  );
}
