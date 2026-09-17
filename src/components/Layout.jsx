import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'

export default function Layout() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-50 text-slate-900">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-red-100/60 blur-3xl" />
        <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-orange-100/50 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-slate-200/60 blur-3xl" />
      </div>

      <Navbar />

      <main className="relative z-10">
        <div className="mx-auto min-h-[65vh]">
          <Outlet />
        </div>
      </main>

      <div className="relative mt-10">
        <div className="mx-auto h-px w-full max-w-7xl bg-gradient-to-r from-transparent via-red-300/80 to-transparent" />
        <Footer />
      </div>
    </div>
  )
}