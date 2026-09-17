import { useEffect, useState, useRef } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  ChevronRight,
  Mail,
  Menu,
  PhoneCall,
  Search,
  ShoppingCart,
  X,
  Heart,
  User,
  Sparkles,
  Zap,
  Tag,
  ArrowRight,
  FileText,
  Download,
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useProductImages } from '../context/ProductImageContext'
import { products } from '../data/products'
import Logo from './Logo'

const navItems = [
  { name: 'Home', to: '/' },
  { name: 'Shop Products', to: '/shop' },
  { name: 'About Us', to: '/about' },
  { name: 'Contact & Support', to: '/contact' },
]

const announcements = [
  '⚡ Flat 10% OFF on all CCTV & Power orders with code: ITSAATHI10',
  '🚚 FREE Express Delivery across India on orders over ₹999',
  '🔒 100% Genuine Certified Hardware & 1-Year Official Warranty',
  '💬 Bulk & Reseller Wholesale Pricing Available — Chat on WhatsApp',
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [announcementIdx, setAnnouncementIdx] = useState(0)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const searchRef = useRef(null)

  const { cartCount, openDrawer } = useCart()
  const { wishlistCount } = useWishlist()
  const { productImages } = useProductImages()
  const location = useLocation()
  const navigate = useNavigate()

  // Rotate announcement every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIdx((prev) => (prev + 1) % announcements.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [])

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
    setSearchQuery('')
  }, [location.pathname])

  // Click outside search popup
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Live search calculation
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }
    const q = searchQuery.toLowerCase().trim()
    const filtered = products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          (p.short && p.short.toLowerCase().includes(q))
      )
      .slice(0, 6)
    setSearchResults(filtered)
  }, [searchQuery])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
    }
  }

  const navLinkClass = ({ isActive }) =>
    `relative rounded-full px-4 py-2 text-sm font-bold transition-all duration-200 ${
      isActive
        ? 'bg-red-600 text-white shadow-md shadow-red-900/20'
        : 'text-slate-700 hover:bg-red-50 hover:text-red-600'
    }`

  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold transition-all duration-200 ${
      isActive
        ? 'bg-red-600 text-white shadow-md'
        : 'bg-slate-50 text-slate-700 hover:bg-red-50 hover:text-red-600'
    }`

  return (
    <>
      {/* Top Banner with dynamic rotating announcement */}
      <div className="border-b border-slate-900 bg-slate-950 text-white">
        <div className="container-main flex items-center justify-between py-2 text-xs">
          <div className="flex items-center gap-5">
            <a
              href="tel:8006033345"
              className="inline-flex items-center gap-1.5 text-white/80 transition hover:text-white"
            >
              <PhoneCall size={13} className="text-red-400" />
              <span className="font-semibold">+91 80060 33345</span>
            </a>
            <a
              href="mailto:Support@itsaathi.com"
              className="hidden sm:inline-flex items-center gap-1.5 text-white/80 transition hover:text-white"
            >
              <Mail size={13} className="text-red-400" />
              <span className="font-semibold">Support@itsaathi.com</span>
            </a>
          </div>

          {/* Rotating Live Announcement */}
          <div className="hidden md:flex items-center gap-2 overflow-hidden max-w-md lg:max-w-lg">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <div key={announcementIdx} className="text-white/90 font-medium truncate animate-fade-in text-xs">
              {announcements[announcementIdx]}
            </div>
          </div>

          {/* Top Quick Links */}
          <div className="flex items-center gap-4 text-white/80">
            <Link to="/shop" className="hover:text-white font-medium transition flex items-center gap-1">
              <ShoppingCart size={13} className="text-red-400" />
              <span>Shop Products</span>
            </Link>
            <span className="h-3 w-px bg-slate-800" />
            <Link to="/account" className="hover:text-white font-medium transition flex items-center gap-1">
              <User size={13} />
              <span>Account / Orders</span>
            </Link>
            <span className="h-3 w-px bg-slate-800" />
            <a
              href="/admin/"
              className="hidden sm:inline-flex items-center gap-1 text-red-400 hover:text-red-300 font-bold transition"
            >
              <span>Admin Portal</span>
            </a>
            <span className="h-3 w-px bg-slate-800" />
            <a
              href="/it-saathi-project.zip"
              download="it-saathi-project.zip"
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600/90 px-2.5 py-0.5 text-[11px] font-bold text-white hover:bg-emerald-500 shadow-sm transition"
              title="Download Full Project Source Code (ZIP)"
            >
              <Download size={11} />
              <span>Project ZIP</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 border-b transition-all duration-300 ${
          isScrolled
            ? 'border-slate-200/90 bg-white/95 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl'
            : 'border-slate-200/80 bg-white/90 backdrop-blur-md'
        }`}
      >
        <div className="container-main flex h-20 items-center justify-between gap-4">
          {/* Logo Branding */}
          <Link to="/" className="group flex items-center gap-3 shrink-0" title="IT SAATHI Home">
            <Logo variant="horizontal" size="md" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-1.5 lg:flex">
            {navItems.map((item) => (
              <NavLink key={item.name} to={item.to} className={navLinkClass}>
                <span className="flex items-center gap-1.5">
                  {item.name}
                  {item.badge && (
                    <span className="rounded-full bg-amber-400 text-slate-950 px-1.5 py-0.2 text-[9px] font-black uppercase tracking-wider">
                      {item.badge}
                    </span>
                  )}
                </span>
              </NavLink>
            ))}
          </nav>

          {/* Live Search, Wishlist & Cart Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Desktop / Tablet Live Search Input & Popover */}
            <div ref={searchRef} className="relative">
              <div className="relative hidden md:block w-48 lg:w-64">
                <form onSubmit={handleSearchSubmit}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setSearchOpen(true)
                    }}
                    onFocus={() => setSearchOpen(true)}
                    placeholder="Search 1,500+ items..."
                    className="w-full rounded-full border border-slate-300 bg-slate-50/80 py-2 pl-9 pr-4 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none transition focus:border-red-600 focus:bg-white focus:ring-2 focus:ring-red-100"
                  />
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </form>
              </div>

              {/* Mobile Search Trigger Icon */}
              <button
                onClick={() => setSearchOpen((prev) => !prev)}
                className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 hover:text-red-600 transition"
                aria-label="Search"
              >
                <Search size={18} />
              </button>

              {/* Autocomplete Dropdown Popup */}
              {searchOpen && (
                <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-pop-in">
                  {/* Mobile Search input inside popup */}
                  <div className="p-3 border-b border-slate-100 md:hidden">
                    <form onSubmit={handleSearchSubmit}>
                      <div className="relative">
                        <input
                          type="text"
                          autoFocus
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search CCTV, adapters, cables..."
                          className="w-full rounded-xl border border-slate-300 py-2 pl-8 pr-3 text-xs font-semibold text-slate-900 outline-none focus:border-red-600"
                        />
                        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      </div>
                    </form>
                  </div>

                  {/* Results preview */}
                  {searchQuery.trim() ? (
                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                      {searchResults.length > 0 ? (
                        <>
                          <div className="px-4 py-2 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex justify-between">
                            <span>Matching Products</span>
                            <span>{searchResults.length} items found</span>
                          </div>
                          {searchResults.map((p) => {
                            const img = productImages[p.slug]
                            return (
                              <Link
                                key={p.slug}
                                to={`/product/${p.slug}`}
                                onClick={() => setSearchOpen(false)}
                                className="flex items-center gap-3 p-3 hover:bg-red-50/60 transition group"
                              >
                                <div className="h-11 w-11 shrink-0 rounded-xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center overflow-hidden">
                                  {img ? (
                                    <img src={img} alt={p.name} className="h-full w-full object-contain" />
                                  ) : (
                                    <span className="text-[9px] font-bold text-red-600">IT</span>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-red-600">
                                    {p.name}
                                  </div>
                                  <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                                    <span>{p.category}</span>
                                    <span>•</span>
                                    <span className="font-mono">{p.sku}</span>
                                  </div>
                                </div>
                                <div className="text-right shrink-0">
                                  <span className="text-xs font-black text-red-700">₹{p.price}</span>
                                </div>
                              </Link>
                            )
                          })}
                          <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                            <Link
                              to={`/shop?search=${encodeURIComponent(searchQuery)}`}
                              onClick={() => setSearchOpen(false)}
                              className="text-xs font-bold text-red-600 hover:text-red-700 inline-flex items-center gap-1"
                            >
                              See all matching results <ArrowRight size={13} />
                            </Link>
                          </div>
                        </>
                      ) : (
                        <div className="p-6 text-center text-xs text-slate-500">
                          No matching hardware found for "<span className="font-bold text-slate-800">{searchQuery}</span>".
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 space-y-3">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Popular Categories</div>
                      <div className="flex flex-wrap gap-1.5">
                        {['CCTV Range', 'Power Solutions', 'Networking', 'Cables Range', 'Converters'].map((c) => (
                          <Link
                            key={c}
                            to={`/shop?category=${encodeURIComponent(c)}`}
                            onClick={() => setSearchOpen(false)}
                            className="rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-600 px-2.5 py-1 text-xs font-semibold text-slate-700 transition"
                          >
                            {c}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist Button */}
            <Link
              to="/shop"
              className="relative inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:border-rose-400 hover:text-rose-600 hover:scale-105 active:scale-95 shadow-sm"
              title="Saved Wishlist"
              aria-label="Wishlist"
            >
              <Heart size={18} className={wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : ''} />
              {wishlistCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white shadow-sm animate-pop-in">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Dynamic Cart Button with Drawer Trigger */}
            <button
              onClick={openDrawer}
              className="relative inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-xs sm:text-sm font-bold text-white transition hover:bg-red-600 hover:shadow-lg hover:shadow-red-900/20 active:scale-95 shadow-sm"
              aria-label="Open cart"
            >
              <ShoppingCart size={17} />
              <span className="hidden sm:inline">Cart</span>
              <span className="inline-flex min-w-[22px] items-center justify-center rounded-full bg-red-600 sm:bg-white px-1.5 py-0.5 text-xs font-black text-white sm:text-red-700 shadow-sm transition-transform">
                {cartCount}
              </span>
            </button>

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:border-red-600 hover:text-red-600 lg:hidden"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <div
          className={`overflow-hidden border-t border-slate-200 bg-white transition-all duration-300 lg:hidden ${
            menuOpen ? 'max-h-[560px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="container-main py-4">
            <div className="grid gap-2">
              {navItems.map((item) => (
                <NavLink key={item.name} to={item.to} className={mobileNavLinkClass}>
                  <span>{item.name}</span>
                  <ChevronRight size={16} />
                </NavLink>
              ))}
              <NavLink to="/account" className={mobileNavLinkClass}>
                <span>My Account & Orders</span>
                <ChevronRight size={16} />
              </NavLink>
              <a
                href="/admin/"
                className="flex items-center justify-between rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700 hover:bg-red-100 transition-all duration-200"
              >
                <span className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-red-600 animate-ping" />
                  Admin Dashboard Panel
                </span>
                <ChevronRight size={16} />
              </a>
              <a
                href="/it-saathi-project.zip"
                download="it-saathi-project.zip"
                className="flex items-center justify-between rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-100 transition-all duration-200"
              >
                <span className="flex items-center gap-2">
                  <Download size={16} className="text-emerald-600" />
                  Download Full Project ZIP
                </span>
                <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] text-white">ZIP</span>
              </a>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-200 pt-4">
              <a
                href="tel:8006033345"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 px-3 py-2.5 text-xs font-bold text-slate-700 transition hover:border-red-600 hover:text-red-600"
              >
                <PhoneCall size={14} /> Call Support
              </a>
              <a
                href="https://wa.me/918006033345"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 text-white px-3 py-2.5 text-xs font-bold transition hover:bg-emerald-700 shadow-sm"
              >
                WhatsApp Chat
              </a>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
