import { Link, useLocation } from 'react-router-dom';
import { isAuthenticated, logout, getUserRole } from '../utils/auth';
import { Menu, X, LogOut, ShoppingBag, CreditCard, FileText, Package, Plus } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const role = getUserRole();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;
  
  const NavLink = ({ to, children, icon: Icon }) => (
    <Link 
      to={to} 
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
        isActive(to) 
          ? 'bg-indigo-50 text-indigo-600 font-semibold' 
          : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
      }`}
    >
      {Icon && <Icon size={18} />}
      {children}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600">
            <Package size={24} />
            RentalSys
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {!isAuthenticated() ? (
              <>
                <NavLink to="/login">Login</NavLink>
                <Link to="/register" className="btn-primary ml-2">Register</Link>
              </>
            ) : (
              <>
                {role === 'customer' && (
                  <>
                    <NavLink to="/products" icon={ShoppingBag}>Products</NavLink>
                    <NavLink to="/quotations" icon={FileText}>Quotations</NavLink>
                    <NavLink to="/rental-orders" icon={Package}>Orders</NavLink>
                    <NavLink to="/invoices" icon={FileText}>Invoices</NavLink>
                    <NavLink to="/payments" icon={CreditCard}>Payments</NavLink>
                  </>
                )}

                {role === 'vendor' && (
                  <>
                    <NavLink to="/vendor/products" icon={Package}>My Products</NavLink>
                    <NavLink to="/vendor/create-product" icon={Plus}>Add Product</NavLink>
                  </>
                )}

                <button 
                  onClick={logout} 
                  className="ml-4 flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600 hover:text-indigo-600"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2 shadow-lg">
          {!isAuthenticated() ? (
            <>
              <Link to="/login" className="block py-2 text-slate-600">Login</Link>
              <Link to="/register" className="block py-2 text-indigo-600 font-semibold">Register</Link>
            </>
          ) : (
            <>
              {role === 'customer' && (
                <>
                  <Link to="/products" className="block py-2 text-slate-600">Products</Link>
                  <Link to="/quotations" className="block py-2 text-slate-600">Quotations</Link>
                  <Link to="/rental-orders" className="block py-2 text-slate-600">Orders</Link>
                  <Link to="/invoices" className="block py-2 text-slate-600">Invoices</Link>
                  <Link to="/payments" className="block py-2 text-slate-600">Payments</Link>
                </>
              )}
               {role === 'vendor' && (
                  <>
                    <Link to="/vendor/products" className="block py-2 text-slate-600">My Products</Link>
                    <Link to="/vendor/create-product" className="block py-2 text-slate-600">Add Product</Link>
                  </>
                )}
              <button onClick={logout} className="block w-full text-left py-2 text-red-600">
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
