import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingBag, Calculator } from 'lucide-react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/materials', icon: Package, label: 'Material' },
  { to: '/products', icon: ShoppingBag, label: 'Produk' },
  { to: '/price-simulation', icon: Calculator, label: 'Simulasi' },
]

const SidebarNav = () => {
  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 z-40 flex flex-col">
      <div className="px-6 py-5 border-b border-slate-800">
        <span className="text-lg font-bold text-white tracking-tight">ReKal</span>
        <p className="text-xs text-slate-500 mt-0.5">Kalkulator HPP</p>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-primary-400 bg-slate-800'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`
            }
          >
            <item.icon className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default SidebarNav
