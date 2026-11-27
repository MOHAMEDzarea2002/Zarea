import { NavLink } from 'react-router';
import { LayoutDashboard, Package, ShoppingBag, Tags, Users } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/categories', label: 'Categories', icon: Tags },
  { to: '/users', label: 'Users', icon: Users },
];

export default function Sidebar() {
  return (
    <aside className="bg-sidebar text-white md:min-h-screen md:w-60 md:shrink-0">
      <div className="flex h-16 items-center px-6 text-lg font-semibold tracking-wide">
        Zarea Admin
      </div>

      <nav
        aria-label="Main"
        className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:overflow-visible md:pb-0"
      >
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon size={18} strokeWidth={1.5} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
