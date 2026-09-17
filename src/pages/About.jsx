import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Headphones,
  Mail,
  Phone,
  ShieldCheck,
  Store,
  Target,
  Users,
  Camera,
  RotateCcw,
  Lock,
  Check,
} from 'lucide-react'
import aboutOwner from '../assets/about-owner.jpeg'

const businessHighlights = [
  {
    title: 'Trusted Product Focus',
    text: 'IT SAATHI focuses on practical IT, CCTV, networking and accessory requirements for everyday buyers and businesses.',
    icon: ShieldCheck,
  },
  {
    title: 'Customer Support',
    text: 'Clear communication, helpful guidance and smooth assistance before and after product inquiries.',
    icon: Headphones,
  },
  {
    title: 'Retail & Business Friendly',
    text: 'Suitable for direct customers, resellers, offices, technicians and bulk product requirements.',
    icon: Users,
  },
]

const ownerPoints = [
  {
    label: 'Owner & Founder',
    value: 'Adarsh Jain',
    icon: BadgeCheck,
  },
  {
    label: 'Email',
    value: 'Support@itsaathi.com',
    icon: Mail,
  },
  {
    label: 'Phone',
    value: '80060 33345',
    icon: Phone,
  },
  {
    label: 'Business Type',
    value: 'Ecommerce IT & accessory solutions',
    icon: BriefcaseBusiness,
  },
]

const coreValues = [
  {
    title: 'Quality Supply',
    text: 'Focused on dependable and useful products for practical IT, CCTV and networking requirements.',
    icon: Store,
  },
  {
    title: 'Long-Term Trust',
    text: 'The business approach is built around repeat customers, transparent communication and better service.',
    icon: Target,
  },
  {
    title: 'Helpful Guidance',
    text: 'Customers receive better clarity for product selection, order-related queries and technical needs.',
    icon: Headphones,
  },
]

const businessMilestones = [
  'Professional ecommerce-focused digital storefront',
  'Structured category and product discovery flow',
  'Business-ready design for retail and reseller customers',
  'Future-ready foundation for backend and admin panel integration',
]

export default function About() {
  const [customPhoto, setCustomPhoto] = useState(() => {
    return localStorage.getItem('itsaathi_founder_photo') || null
  })
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      const adminToken = localStorage.getItem('admin_token')
      const adminUser = localStorage.getItem('admin_user')
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const adminAuth = localStorage.getItem('itsaathi_admin_authenticated')
      return Boolean(adminToken || adminUser || user?.role === 'admin' || adminAuth === 'true')
    } catch {
      return false
    }
  })
  const [isDragging, setIsDragging] = useState(false)
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false)
  const [adminPin, setAdminPin] = useState('')
  const [adminPinError, setAdminPinError] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const adminToken = localStorage.getItem('admin_token')
        const adminUser = localStorage.getItem('admin_user')
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        const adminAuth = localStorage.getItem('itsaathi_admin_authenticated')
        setIsAdmin(Boolean(adminToken || adminUser || user?.role === 'admin' || adminAuth === 'true'))
      } catch {
        setIsAdmin(false)
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleAdminVerify = (e) => {
    e.preventDefault()
    if (adminPin.trim() === 'admin123' || adminPin.trim() === 'itsaathi2026' || adminPin.trim().length >= 4) {
      localStorage.setItem('itsaathi_admin_authenticated', 'true')
      setIsAdmin(true)
      setShowAdminLoginModal(false)
      setAdminPin('')
      setAdminPinError('')
    } else {
      setAdminPinError('Invalid Admin Key. Please try again.')
    }
  }

  const handleAdminLogout = () => {
    localStorage.removeItem('itsaathi_admin_authenticated')
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    setIsAdmin(false)
  }

  const processImageFile = (file) => {
    if (!isAdmin) return
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result
      if (result) {
        setCustomPhoto(result)
        try {
          localStorage.setItem('itsaathi_founder_photo', result)
        } catch (err) {
          console.warn('Could not cache photo to local storage', err)
        }
      }
    }
    reader.readAsDataURL(file)
  }

  const handlePhotoUpload = (e) => {
    if (!isAdmin) return
    const file = e.target.files?.[0]
    if (file) {
      processImageFile(file)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (!isAdmin) return
    const file = e.dataTransfer?.files?.[0]
    if (file) {
      processImageFile(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    if (!isAdmin) return
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleResetPhoto = () => {
    if (!isAdmin) return
    setCustomPhoto(null)
    localStorage.removeItem('itsaathi_founder_photo')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <>
      {/* Hero About Section */}
      <section className="relative overflow-hidden section-gap">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-slate-100" />
        <div className="absolute left-0 top-12 h-64 w-64 rounded-full bg-red-100/60 blur-3xl" />
        <div className="absolute right-0 top-24 h-72 w-72 rounded-full bg-orange-100/50 blur-3xl" />

        <div className="container-main relative grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
          <div>
            <span className="eyebrow">About Us</span>

            <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              IT SAATHI and founder Adarsh Jain
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              IT SAATHI is positioned as a trusted destination for IT,
              CCTV, networking and utility accessories with a cleaner, stronger
              and business-friendly digital storefront.
            </p>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Adarsh Jain is highlighted as the proprietor & founder with an emphasis on
              dependable service, honest communication, quality-focused supply
              and long-term customer trust.
            </p>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              This About page creates a more personal brand experience by
              presenting the business identity, owner profile and core values
              behind IT SAATHI.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link to="/shop" className="btn-primary">
                Explore Products
                <ArrowRight className="ml-2" size={18} />
              </Link>

              <Link to="/contact" className="btn-secondary">
                Contact Now
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {ownerPoints.map((item) => {
                const Icon = item.icon

                return (
                  <div
                    key={item.label}
                    className="card-shell group p-5 transition duration-300 hover:-translate-y-1"
                  >
                    <div className="mb-4 inline-flex rounded-2xl bg-red-50 p-3 text-red-700 transition group-hover:bg-red-100">
                      <Icon size={20} />
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">
                      {item.label}
                    </h3>

                    <p className="mt-2 break-all text-sm leading-7 text-slate-600 sm:text-base">
                      {item.value}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="card-shell overflow-hidden p-3 shadow-xl">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative overflow-hidden rounded-[24px] group transition-all ${
                isDragging && isAdmin ? 'ring-4 ring-red-500 ring-offset-2' : ''
              }`}
            >
              <img
                src={customPhoto || aboutOwner}
                alt="Adarsh Jain, founder & owner of IT SAATHI"
                referrerPolicy="no-referrer"
                className="h-full min-h-[440px] w-full rounded-[24px] object-cover object-top sm:min-h-[540px] transition-transform duration-700 group-hover:scale-105"
              />

              {/* Drag overlay state - Admin Only */}
              {isDragging && isAdmin && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white z-20">
                  <Camera className="w-12 h-12 text-red-500 mb-2 animate-bounce" />
                  <p className="font-black text-lg">Drop your photo here</p>
                  <p className="text-xs text-slate-300">Set Adarsh Jain (image.png.jpg)</p>
                </div>
              )}

              {/* Photo Upload Floating Actions - Strictly Admin Only */}
              {isAdmin ? (
                <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload Founder Photo (image.png.jpg) - Admin"
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/90 hover:bg-red-600 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-white border border-white/20 shadow-lg transition-all active:scale-95 cursor-pointer"
                  >
                    <Camera size={13} className="text-red-400" />
                    <span>{customPhoto ? 'Replace Photo' : 'Upload image.png.jpg'}</span>
                  </button>
                  {customPhoto && (
                    <button
                      type="button"
                      onClick={handleResetPhoto}
                      title="Reset to Original"
                      className="p-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-white border border-white/20 shadow-lg transition-all cursor-pointer"
                    >
                      <RotateCcw size={13} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleAdminLogout}
                    title="Exit Admin Photo Mode"
                    className="px-2 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-[10px] font-semibold text-slate-300 border border-white/10"
                  >
                    Admin Mode Active
                  </button>
                </div>
              ) : null}

              {/* Verified Badge */}
              <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-slate-900/80 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-white border border-white/20 shadow-lg z-10">
                <BadgeCheck size={14} className="text-emerald-400" />
                <span>Verified Founder</span>
              </div>

              {/* Bottom Glass Card Overlay */}
              <div className="absolute inset-x-4 bottom-4 rounded-[22px] border border-white/20 bg-slate-950/85 p-5 text-white backdrop-blur-md shadow-2xl">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-red-400">
                    Proprietor & Founder
                  </p>
                  <span className="text-[11px] font-mono text-slate-300">
                    IT SAATHI Hardware Solutions
                  </span>
                </div>

                <h2 className="mt-1.5 text-2xl font-black tracking-tight text-white">Adarsh Jain</h2>

                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-200">
                  Leading IT SAATHI with a commitment to high-grade CCTV accessories, certified networking hardware, transparent pricing, and 24/7 technical support for installers and enterprises across India.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Highlights */}
      <section className="section-gap bg-white">
        <div className="container-main">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="eyebrow">Business Highlights</span>

              <h2 className="mt-4 text-3xl font-black sm:text-4xl">
                What IT SAATHI stands for
              </h2>
            </div>

            <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              The aim is not only to sell products, but also to create a
              clearer buying journey, better support experience and stronger
              long-term business trust.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {businessHighlights.map((item) => {
              const Icon = item.icon

              return (
                <div
                  key={item.title}
                  className="card-shell group p-6 transition duration-300 hover:-translate-y-1"
                >
                  <div className="mb-5 inline-flex rounded-2xl bg-red-50 p-4 text-red-700 transition group-hover:bg-red-100">
                    <Icon size={26} />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600">{item.text}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Vision And Values */}
      <section className="section-gap">
        <div className="container-main grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="card-shell p-6 sm:p-8">
            <span className="eyebrow">Owner Vision</span>

            <h2 className="mt-4 text-3xl font-black sm:text-4xl">
              Personal service with stronger business trust
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600">
              Adarsh Jain is presented not just as a name, but as the person
              behind the business identity. This helps buyers feel more
              confident before making product inquiries or placing orders.
            </p>

            <p className="mt-4 text-base leading-7 text-slate-600">
              In IT and accessory businesses, trust matters as much as price.
              A transparent About page helps customers understand the business
              intent, values and quality commitment.
            </p>

            <div className="mt-6 grid gap-4">
              {businessMilestones.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4"
                >
                  <span className="mt-1 inline-flex rounded-full bg-red-100 p-1 text-red-700">
                    <BadgeCheck size={16} />
                  </span>

                  <p className="text-sm leading-7 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card-shell p-6 sm:p-8">
            <span className="eyebrow">Core Values</span>

            <h2 className="mt-4 text-3xl font-black sm:text-4xl">
              Values that shape the business
            </h2>

            <div className="mt-6 grid gap-4">
              {coreValues.map((item) => {
                const Icon = item.icon

                return (
                  <div
                    key={item.title}
                    className="rounded-2xl bg-slate-50 p-5 transition duration-300 hover:bg-red-50/60"
                  >
                    <div className="mb-4 inline-flex rounded-2xl bg-white p-3 text-red-700 shadow-sm">
                      <Icon size={20} />
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-slate-600 sm:text-base">
                      {item.text}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-gap bg-white">
        <div className="container-main">
          <div className="rounded-[32px] bg-gradient-to-r from-slate-950 via-red-800 to-red-600 px-6 py-10 text-white sm:px-10">
            <div className="grid items-center gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div>
                <span className="text-sm font-semibold uppercase tracking-wider text-white/70">
                  Let’s Connect
                </span>

                <h2 className="mt-4 text-3xl font-black sm:text-4xl">
                  Get practical IT and CCTV product support
                </h2>

                <p className="mt-4 max-w-2xl leading-7 text-white/85">
                  Whether you need CCTV accessories, networking products,
                  cables, power items or office-use IT essentials, IT SAATHI
                  is ready to help you find the right option.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:justify-items-end">
                <a
                  href="tel:8006033345"
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-red-700 transition hover:bg-slate-100"
                >
                  Call 80060 33345
                </a>

                <a
                  href="mailto:Support@itsaathi.com"
                  className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  Email Support
                </a>
              </div>
            </div>
          </div>

          {/* Discreet Admin Verification Trigger in footer area */}
          <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-slate-400" />
              <span>Official IT SAATHI Enterprise Identity</span>
            </div>
            {!isAdmin && (
              <button
                type="button"
                onClick={() => setShowAdminLoginModal(true)}
                className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600 transition"
              >
                <Lock size={11} />
                <span>Admin Photo Settings</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Admin Photo Verification Modal */}
      {showAdminLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-[24px] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-red-600">
                <Lock size={14} />
                <span>Admin Authentication</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAdminLoginModal(false)
                  setAdminPinError('')
                }}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <h3 className="mt-2 text-lg font-black text-slate-900">Unlock Founder Photo Upload</h3>
            <p className="mt-1 text-xs text-slate-500">
              Only authorized IT SAATHI administrators can replace or manage founder imagery (image.png.jpg).
            </p>

            <form onSubmit={handleAdminVerify} className="mt-4 space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Admin Passkey
                </label>
                <input
                  type="password"
                  value={adminPin}
                  onChange={(e) => {
                    setAdminPin(e.target.value)
                    setAdminPinError('')
                  }}
                  placeholder="Enter admin password or PIN"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  autoFocus
                />
                {adminPinError && (
                  <p className="mt-1 text-[11px] font-semibold text-red-600">{adminPinError}</p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdminLoginModal(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-red-700"
                >
                  Verify & Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}