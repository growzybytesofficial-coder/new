import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  ChevronRight,
  Mail,
  Menu,
  PhoneCall,
  Search,
  ShoppingCart,
  X,
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import logo from '../assets/jain-logo.jpeg'

const navItems = [
  { name: 'Home', to: '/' },
  { name: 'Shop', to: '/shop' },
  { name: 'About', to: '/about' },
  { name: 'Contact', to: '/contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { cartCount } = useCart()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : 'auto'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [menuOpen])

  const navLinkClass = ({ isActive }) =>
    [
      'relative rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300',
      isActive
        ? 'bg-red-600 text-white shadow-md'
        : 'text-slate-700 hover:bg-red-50 hover:text-red-600',
    ].join(' ')

  const mobileNavLinkClass = ({ isActive }) =>
    [
      'flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300',
      isActive
        ? 'bg-red-600 text-white'
        : 'bg-slate-50 text-slate-700 hover:bg-red-50 hover:text-red-600',
    ].join(' ')

  return (
    <>
      <div className="hidden border-b border-slate-200 bg-slate-950 text-white lg:block">
        <div className="container-main flex items-center justify-between py-2 text-xs">
          <div className="flex items-center gap-6">
            <a
              href="tel:8006033345"
              className="inline-flex items-center gap-2 text-white/80 transition hover:text-white"
            >
              <PhoneCall size={14} />
              80060 33345
            </a>

            <a
              href="mailto:Support@itsaathi.com"
              className="inline-flex items-center gap-2 text-white/80 transition hover:text-white"
            >
              <Mail size={14} />
              Support@itsaathi.com
            </a>
          </div>

          <p className="text-white/70">Smart Tech, Trusted Service</p>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          isScrolled
            ? 'border-slate-200 bg-white/95 shadow-lg backdrop-blur-xl'
            : 'border-slate-200/80 bg-white/90 backdrop-blur-md'
        }`}
      >
        <div className="container-main flex h-20 items-center justify-between gap-4">
          <Link to="/" className="group flex items-center gap-3">
            <div className="relative">
              <img
                src={logo}
                alt="IT SAATHI logo"
                className="h-12 w-12 rounded-full object-cover ring-2 ring-red-100 transition duration-300 group-hover:scale-105 group-hover:ring-red-300"
              />
              <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
            </div>

            <div>
              <div className="text-base font-black tracking-wide text-red-700 sm:text-lg">
                IT SAATHI
              </div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-slate-500 sm:text-[11px]">
                Smart Tech, Trusted Service
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 lg:flex">
            {navItems.map((item) => (
              <NavLink key={item.name} to={item.to} className={navLinkClass}>
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-600 hover:text-red-600"
            >
              <Search size={16} />
              Search
            </Link>

            <a
              href="tel:8006033345"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-600 hover:text-red-600"
            >
              <PhoneCall size={16} />
              Call Now
            </a>

            <Link
              to="/shop"
              className="relative inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              <ShoppingCart size={17} />
              Cart
              <span className="inline-flex min-w-[24px] items-center justify-center rounded-full bg-white px-1.5 py-0.5 text-xs font-bold text-red-600">
                {cartCount}
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <Link
              to="/shop"
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700"
              aria-label="Go to shop"
            >
              <ShoppingCart size={18} />
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:border-red-600 hover:text-red-600"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <div
          className={`overflow-hidden border-t border-slate-200 bg-white transition-all duration-300 lg:hidden ${
            menuOpen ? 'max-h-[520px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="container-main py-4">
            <div className="grid gap-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.to}
                  className={mobileNavLinkClass}
                >
                  <span>{item.name}</span>
                  <ChevronRight size={16} />
                </NavLink>
              ))}
            </div>

            <div className="mt-4 grid gap-3 border-t border-slate-200 pt-4">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                <Search size={16} />
                Browse Products
              </Link>

              <a
                href="tel:8006033345"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-red-600 hover:text-red-600"
              >
                <PhoneCall size={16} />
                80060 33345
              </a>

              <a
                href="mailto:Support@itsaathi.com"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-red-600 hover:text-red-600"
              >
                <Mail size={16} />
                Email Support
              </a>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}