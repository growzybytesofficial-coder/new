import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { ArrowUp, MessageSquare, PhoneCall } from 'lucide-react'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import CartDrawer from './CartDrawer.jsx'
import MobileBottomBar from './MobileBottomBar.jsx'

export default function Layout() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 selection:bg-red-500 selection:text-white pb-16 sm:pb-0">
      {/* Background ambient lighting */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-red-200/40 blur-[120px]" />
        <div className="absolute right-0 top-1/4 h-[420px] w-[420px] rounded-full bg-amber-100/40 blur-[140px]" />
        <div className="absolute bottom-10 left-1/3 h-[500px] w-[500px] rounded-full bg-slate-200/50 blur-[160px]" />
      </div>

      <Navbar />

      <main className="relative z-10">
        <div className="mx-auto min-h-[70vh]">
          <Outlet />
        </div>
      </main>

      <div className="relative mt-16">
        <div className="mx-auto h-px w-full max-w-7xl bg-gradient-to-r from-transparent via-red-300/80 to-transparent" />
        <Footer />
      </div>

      {/* Global Slide-Out Cart Drawer */}
      <CartDrawer />

      {/* Mobile Sticky Bottom Navigation Bar */}
      <MobileBottomBar />

      {/* Floating Actions (WhatsApp Chat & Scroll to Top) */}
      <div className="fixed bottom-20 sm:bottom-6 left-6 z-40 flex flex-col gap-2.5">
        <a
          href="https://wa.me/918006033345?text=Hello%20IT%20SAATHI%2C%20I%20have%20an%20inquiry%20regarding%20hardware%20products."
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-xs font-black text-white shadow-xl shadow-emerald-950/20 transition-all duration-300 hover:bg-emerald-500 hover:scale-105 active:scale-95"
          title="Chat on WhatsApp"
        >
          <MessageSquare size={18} className="animate-bounce" />
          <span className="hidden sm:inline">WhatsApp Helpdesk</span>
        </a>
      </div>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 sm:bottom-6 right-6 z-40 hidden sm:flex h-11 w-11 items-center justify-center rounded-full bg-white border border-slate-300 text-slate-700 shadow-xl shadow-slate-900/10 transition-all duration-300 hover:bg-red-600 hover:text-white hover:border-red-600 hover:scale-110 active:scale-95 animate-pop-in cursor-pointer"
          title="Scroll to Top"
          aria-label="Scroll to top"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </div>
  )
}

