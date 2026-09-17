import { NavLink } from 'react-router-dom'
import { Home, ShoppingBag, Mail, ShoppingCart, User } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function MobileBottomBar() {
  const { cartCount, openDrawer } = useCart()

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/shop', label: 'Shop', icon: ShoppingBag },
    { to: '/contact', label: 'Contact', icon: Mail },
    { to: '/account', label: 'Account', icon: User },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 block sm:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-2xl py-2 px-3 safe-area-pb">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 relative px-2.5 py-1 rounded-2xl transition ${
                  isActive
                    ? 'text-red-600 font-black'
                    : 'text-slate-500 hover:text-slate-900 font-semibold'
                }`
              }
            >
              <Icon size={18} />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </NavLink>
          )
        })}

        {/* Floating Trigger for Cart Drawer */}
        <button
          type="button"
          onClick={openDrawer}
          className="flex flex-col items-center justify-center gap-1 relative px-2.5 py-1 text-slate-500 hover:text-slate-900 font-semibold cursor-pointer"
        >
          <div className="relative">
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-red-600 text-white text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px]">Cart</span>
        </button>
      </div>
    </nav>
  )
}
