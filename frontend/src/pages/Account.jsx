import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  User,
  Mail,
  Lock,
  Phone,
  Building,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  LogOut,
  ShoppingBag,
  CreditCard,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Smartphone,
  Sparkles,
  HelpCircle,
  Truck,
  Printer
} from 'lucide-react'

export default function Account() {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(true)
  const [authMode, setAuthMode] = useState('login') // 'login' | 'register'
  
  // Dashboard active tab
  const [activeTab, setActiveTab] = useState('profile') // 'profile' | 'orders' | 'addresses' | 'wholesale'

  // Form Fields - Login
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Form Fields - Register
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regRole, setRegRole] = useState('customer') // 'customer' | 'wholesaler'
  const [regCompanyName, setRegCompanyName] = useState('')
  const [regGstin, setRegGstin] = useState('')

  // Form Fields - Profile Edit
  const [editName, setEditName] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editCompanyName, setEditCompanyName] = useState('')
  const [editGstin, setEditGstin] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  // Form Fields - Addresses
  const [addressLine, setAddressLine] = useState('')
  const [city, setCity] = useState('')
  const [stateName, setStateName] = useState('')
  const [pincode, setPincode] = useState('')
  const [isDefault, setIsDefault] = useState(false)

  // Dynamic Data
  const [orders, setOrders] = useState([])
  const [isFetchingOrders, setIsFetchingOrders] = useState(false)

  // Global Alerts
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  // Load auth state on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('user_token')
    const savedUser = localStorage.getItem('user')
    if (savedToken && savedUser) {
      try {
        setToken(savedToken)
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
        
        // Initialize profile edit fields
        setEditName(parsedUser.name || '')
        setEditPhone(parsedUser.phone || '')
        setEditCompanyName(parsedUser.companyName || '')
        setEditGstin(parsedUser.gstin || '')
      } catch (e) {
        localStorage.removeItem('user_token')
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  // Fetch orders when user is set or tab switches to orders
  useEffect(() => {
    if (user && token && activeTab === 'orders') {
      fetchMyOrders()
    }
  }, [user, token, activeTab])

  const fetchMyOrders = async () => {
    setIsFetchingOrders(true)
    setErrorMsg('')
    try {
      const res = await fetch('/api/orders/my-orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await res.json()
      if (data.success) {
        setOrders(data.orders || [])
      } else {
        setErrorMsg(data.message || 'Failed to fetch your orders.')
      }
    } catch (err) {
      setErrorMsg('Could not connect to server to fetch order details.')
    } finally {
      setIsFetchingOrders(false)
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setActionLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      })
      const data = await res.json()

      if (res.ok && data.success) {
        localStorage.setItem('user_token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        setToken(data.token)
        setUser(data.user)

        // Set edit form values
        setEditName(data.user.name || '')
        setEditPhone(data.user.phone || '')
        setEditCompanyName(data.user.companyName || '')
        setEditGstin(data.user.gstin || '')
        
        setSuccessMsg('Logged in successfully!')
        setLoginEmail('')
        setLoginPassword('')
      } else {
        setErrorMsg(data.message || 'Invalid email or password.')
      }
    } catch (err) {
      setErrorMsg('Connection failed. Please check your internet.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setActionLoading(true)

    const payload = {
      name: regName,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
      role: regRole,
      companyName: regRole === 'wholesaler' ? regCompanyName : '',
      gstin: regRole === 'wholesaler' ? regGstin : ''
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()

      if (res.ok && data.success) {
        localStorage.setItem('user_token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        setToken(data.token)
        setUser(data.user)

        // Set edit form values
        setEditName(data.user.name || '')
        setEditPhone(data.user.phone || '')
        setEditCompanyName(data.user.companyName || '')
        setEditGstin(data.user.gstin || '')

        setSuccessMsg(
          regRole === 'wholesaler'
            ? 'Account registered! Wholesaler application submitted for admin approval.'
            : 'Account registered and logged in successfully!'
        )
        
        // Reset reg fields
        setRegName('')
        setRegEmail('')
        setRegPhone('')
        setRegPassword('')
        setRegCompanyName('')
        setRegGstin('')
      } else {
        setErrorMsg(data.message || 'Registration failed. Please check inputs.')
      }
    } catch (err) {
      setErrorMsg('Connection error. Could not complete registration.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setActionLoading(true)

    const payload = {
      name: editName,
      phone: editPhone,
      companyName: editCompanyName,
      gstin: editGstin
    }

    if (newPassword) {
      payload.currentPassword = currentPassword
      payload.newPassword = newPassword
    }

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
      const data = await res.json()

      if (res.ok && data.success) {
        localStorage.setItem('user', JSON.stringify(data.user))
        setUser(data.user)
        setSuccessMsg('Profile updated successfully!')
        setCurrentPassword('')
        setNewPassword('')
      } else {
        setErrorMsg(data.message || 'Profile update failed.')
      }
    } catch (err) {
      setErrorMsg('Failed to sync updates with server.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleAddAddress = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setActionLoading(true)

    if (!addressLine.trim() || !city.trim() || !stateName.trim() || !pincode.trim()) {
      setErrorMsg('Please complete all address fields.')
      setActionLoading(false)
      return
    }

    const newAddress = {
      street: addressLine,
      city,
      state: stateName,
      zipCode: pincode,
      isDefault
    }

    const updatedAddresses = [...(user.addresses || []), newAddress]

    try {
      // Put directly to server profile addresses
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ addresses: updatedAddresses })
      })
      const data = await res.json()

      if (res.ok && data.success) {
        localStorage.setItem('user', JSON.stringify(data.user))
        setUser(data.user)
        setSuccessMsg('Address added successfully!')
        setAddressLine('')
        setCity('')
        setStateName('')
        setPincode('')
        setIsDefault(false)
      } else {
        setErrorMsg(data.message || 'Failed to save address.')
      }
    } catch (err) {
      setErrorMsg('Failed to update address book on database.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteAddress = async (indexToDelete) => {
    setErrorMsg('')
    setSuccessMsg('')
    setActionLoading(true)

    const updatedAddresses = (user.addresses || []).filter((_, idx) => idx !== indexToDelete)

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ addresses: updatedAddresses })
      })
      const data = await res.json()

      if (res.ok && data.success) {
        localStorage.setItem('user', JSON.stringify(data.user))
        setUser(data.user)
        setSuccessMsg('Address removed successfully.')
      } else {
        setErrorMsg(data.message || 'Failed to delete address.')
      }
    } catch (err) {
      setErrorMsg('Failed to update database.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user_token')
    localStorage.removeItem('user')
    setUser(null)
    setToken('')
    setSuccessMsg('Logged out successfully.')
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <section className="section-gap">
      <div className="container-main max-w-6xl">
        
        {/* Global Notification Banners */}
        {errorMsg && (
          <div className="mb-6 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-600 flex items-center gap-3 border border-red-100 animate-in fade-in duration-200">
            <AlertCircle size={18} className="flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-6 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700 flex items-center gap-3 border border-emerald-100 animate-in fade-in duration-200">
            <CheckCircle2 size={18} className="flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* LOGGED OUT PORTAL */}
        {!user ? (
          <div className="mx-auto max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
            
            {/* Header Tabs */}
            <div className="flex border-b border-slate-100 bg-slate-50/50">
              <button
                onClick={() => { setAuthMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
                className={`flex-1 py-4 text-sm font-bold transition duration-300 ${
                  authMode === 'login'
                    ? 'border-b-2 border-red-600 text-red-700 bg-white'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setAuthMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
                className={`flex-1 py-4 text-sm font-bold transition duration-300 ${
                  authMode === 'register'
                    ? 'border-b-2 border-red-600 text-red-700 bg-white'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Create Account
              </button>
            </div>

            <div className="p-8 md:p-10">
              {/* Brand Heading */}
              <div className="text-center mb-8">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-red-600">IT SAATHI</span>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                  {authMode === 'login' ? 'Welcome Back!' : 'Join our Network'}
                </h2>
                <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                  {authMode === 'login' 
                    ? 'Login to access saved address book, order status, and wholesale cashback balance.' 
                    : 'Sign up as a regular consumer or register your business to request official Wholesale trading status.'}
                </p>
              </div>

              {/* LOGIN FORM */}
              {authMode === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4 text-sm">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="email"
                        placeholder="yourname@gmail.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 outline-none transition focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 outline-none transition focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100 font-medium"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="w-full rounded-full bg-slate-950 py-3.5 text-sm font-bold text-white transition hover:bg-red-600 focus:ring-4 focus:ring-red-100 disabled:opacity-50 mt-2 shadow-md inline-flex items-center justify-center gap-2"
                  >
                    {actionLoading ? 'Verifying Account...' : 'Sign In'}
                  </button>
                </form>
              )}

              {/* REGISTER FORM */}
              {authMode === 'register' && (
                <form onSubmit={handleRegister} className="space-y-4 text-sm">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="text"
                        placeholder="Shivam Gupta"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        required
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 outline-none transition focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="email"
                        placeholder="shivam.cctv@gmail.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        required
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 outline-none transition focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="tel"
                        placeholder="+91 80060 33345"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        required
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 outline-none transition focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="password"
                        placeholder="Minimum 6 characters"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 outline-none transition focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100 font-medium"
                      />
                    </div>
                  </div>

                  {/* Account Role Selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Account Role</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setRegRole('customer')}
                        className={`p-3 rounded-2xl border text-xs font-bold transition flex flex-col items-center gap-1.5 ${
                          regRole === 'customer'
                            ? 'border-red-600 bg-red-50/40 text-red-700'
                            : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        <User size={16} />
                        <span>Retail Buyer</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setRegRole('wholesaler')}
                        className={`p-3 rounded-2xl border text-xs font-bold transition flex flex-col items-center gap-1.5 ${
                          regRole === 'wholesaler'
                            ? 'border-red-600 bg-red-50/40 text-red-700'
                            : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        <Building size={16} />
                        <span>B2B Wholesaler</span>
                      </button>
                    </div>
                  </div>

                  {/* Wholesaler Conditional Fields */}
                  {regRole === 'wholesaler' && (
                    <div className="space-y-4 rounded-2xl bg-red-50/40 border border-red-100 p-4 animate-in slide-in-from-top-2 duration-300">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-red-800 mb-1">Company / Store Name</label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400" size={14} />
                          <input
                            type="text"
                            placeholder="e.g. Delhi Electronics"
                            value={regCompanyName}
                            onChange={(e) => setRegCompanyName(e.target.value)}
                            required={regRole === 'wholesaler'}
                            className="w-full rounded-xl border border-red-200 bg-white py-2 pl-9 pr-3 outline-none focus:border-red-500 font-semibold text-xs text-slate-800"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-red-800 mb-1">GSTIN Number (15 digits)</label>
                        <div className="relative">
                          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400" size={14} />
                          <input
                            type="text"
                            placeholder="e.g. 07AAAAA1111A1Z1"
                            value={regGstin}
                            onChange={(e) => setRegGstin(e.target.value)}
                            required={regRole === 'wholesaler'}
                            className="w-full rounded-xl border border-red-200 bg-white py-2 pl-9 pr-3 outline-none focus:border-red-500 font-semibold text-xs text-slate-800"
                          />
                        </div>
                      </div>
                      
                      <p className="text-[10px] text-red-600/80 font-medium leading-relaxed">
                        * B2B profiles require verification. After submitting, our managers will review your GSTIN details to activate wholesale tier catalog rates.
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="w-full rounded-full bg-slate-950 py-3.5 text-sm font-bold text-white transition hover:bg-red-600 focus:ring-4 focus:ring-red-100 disabled:opacity-50 mt-2 shadow-md inline-flex items-center justify-center gap-2"
                  >
                    {actionLoading ? 'Creating Account...' : 'Register'}
                  </button>
                </form>
              )}
            </div>
          </div>
        ) : (
          
          /* LOGGED IN ACCOUNT CONSOLE */
          <div className="grid gap-8 md:grid-cols-4">
            
            {/* Sidebar Menu */}
            <div className="space-y-6 md:col-span-1">
              
              {/* Profile Card Summary */}
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-700 font-black text-xl mb-3">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'C'}
                </div>
                <h3 className="text-base font-black text-slate-900 truncate leading-tight">{user.name}</h3>
                <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>
                
                {/* Role Badge */}
                <div className="mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-700 uppercase tracking-wider">
                  {user.role === 'wholesaler' ? 'B2B Wholesaler' : 'Retail Customer'}
                </div>

                {user.role === 'wholesaler' && (
                  <div className="mt-2">
                    {user.status === 'PendingApproval' ? (
                      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock size={10} />
                        Pending Approval
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <ShieldCheck size={10} />
                        Wholesale Active
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Sidebar Menu Items */}
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-sm text-sm font-bold">
                <nav className="space-y-1">
                  {[
                    { id: 'profile', label: 'My Profile', icon: User },
                    { id: 'orders', label: 'Order History', icon: ShoppingBag },
                    { id: 'addresses', label: 'Address Book', icon: MapPin },
                    { id: 'wholesale', label: 'Wholesale & B2B', icon: Building, cond: user.role === 'wholesaler' }
                  ].map(tab => {
                    if (tab.cond === false) return null
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id); setErrorMsg(''); setSuccessMsg(''); }}
                        className={`w-full flex items-center justify-between rounded-2xl px-4 py-3 transition ${
                          activeTab === tab.id
                            ? 'bg-red-50 text-red-700'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon size={16} />
                          <span>{tab.label}</span>
                        </div>
                        <ChevronRight size={14} className={activeTab === tab.id ? 'text-red-600' : 'text-slate-300'} />
                      </button>
                    )
                  })}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 rounded-2xl px-4 py-3 text-red-600 hover:bg-red-50 transition border-t border-slate-100 mt-2 pt-3"
                  >
                    <LogOut size={16} />
                    <span>Logout Session</span>
                  </button>
                </nav>
              </div>

              {/* Quick WhatsApp Support desk widget */}
              <div className="rounded-3xl bg-slate-900 p-5 text-white shadow-md relative overflow-hidden">
                <div className="absolute right-[-10px] bottom-[-10px] opacity-10">
                  <HelpCircle size={100} />
                </div>
                <h4 className="font-black text-sm tracking-wide">Need Support?</h4>
                <p className="text-xs text-white/70 mt-1 leading-relaxed">
                  Have doubts about product specifications or dynamic orders? Speak directly to our support desk on WhatsApp.
                </p>
                <a
                  href={`https://wa.me/918006033345?text=${encodeURIComponent('Hello IT SAATHI, I need customer support with my account.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 block text-center rounded-xl bg-white px-4 py-2 text-xs font-black text-slate-950 transition hover:bg-red-600 hover:text-white"
                >
                  Message Support
                </a>
              </div>
            </div>

            {/* Main Tab View */}
            <div className="md:col-span-3 space-y-6">
              
              {/* Profile Overview and Welcome header banner */}
              <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 p-6 md:p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-red-400 font-bold flex items-center gap-1.5">
                    <Sparkles size={12} />
                    Verified Customer Portal
                  </span>
                  <h1 className="text-2xl md:text-3xl font-black mt-1.5 tracking-tight">Hello, {user.name}!</h1>
                  <p className="text-xs text-white/70 mt-1">Smart Tech, Trusted Service since 2016.</p>
                </div>
                
                {/* Cashback balance summary card */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 min-w-[180px]">
                  <span className="text-[10px] uppercase tracking-wider text-white/60 font-bold block">Cashback Balance</span>
                  <p className="text-2xl font-black text-red-400 mt-1">₹{(user.cashbackBalance || 0).toLocaleString('en-IN')}</p>
                  <span className="text-[9px] text-white/50 block mt-0.5">* Redeemable on your next order verification.</span>
                </div>
              </div>

              {/* PROFILE TAB PANEL */}
              {activeTab === 'profile' && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-black text-slate-900 mb-6 tracking-tight flex items-center gap-2">
                    <User size={18} className="text-red-600" />
                    Profile Details
                  </h2>

                  <form onSubmit={handleUpdateProfile} className="space-y-6 text-sm">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Full Name</label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          required
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 px-4 outline-none transition focus:border-red-500 focus:bg-white font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Phone Number</label>
                        <input
                          type="tel"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          required
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 px-4 outline-none transition focus:border-red-500 focus:bg-white font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Email Address</label>
                        <input
                          type="email"
                          value={user.email}
                          disabled
                          className="w-full rounded-2xl border border-slate-200 bg-slate-100 py-3 px-4 text-slate-400 font-medium cursor-not-allowed"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">Contact support to change your account email address.</p>
                      </div>

                      {user.role === 'wholesaler' && (
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Company Name</label>
                          <input
                            type="text"
                            value={editCompanyName}
                            onChange={(e) => setEditCompanyName(e.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 px-4 outline-none transition focus:border-red-500 focus:bg-white font-medium"
                          />
                        </div>
                      )}
                    </div>

                    {user.role === 'wholesaler' && (
                      <div className="border-t border-slate-100 pt-6">
                        <div className="grid gap-6 sm:grid-cols-2">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">GSTIN Number</label>
                            <input
                              type="text"
                              value={editGstin}
                              onChange={(e) => setEditGstin(e.target.value)}
                              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 px-4 outline-none transition focus:border-red-500 focus:bg-white font-medium uppercase"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="border-t border-slate-100 pt-6 space-y-4">
                      <h3 className="font-bold text-slate-800 text-sm">Security & Password</h3>
                      <p className="text-xs text-slate-400">Leave these blank if you do not wish to update your login password.</p>
                      
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Current Password</label>
                          <input
                            type="password"
                            placeholder="Required to set new password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 px-4 outline-none transition focus:border-red-500 focus:bg-white font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">New Password</label>
                          <input
                            type="password"
                            placeholder="Minimum 6 characters"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 px-4 outline-none transition focus:border-red-500 focus:bg-white font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={actionLoading}
                        className="rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-600 disabled:opacity-50 shadow-md inline-flex items-center gap-2"
                      >
                        {actionLoading ? 'Saving changes...' : 'Save Profile Updates'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ORDER HISTORY TAB PANEL */}
              {activeTab === 'orders' && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                    <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <ShoppingBag size={18} className="text-red-600" />
                      Order Ledger
                    </h2>
                    <span className="text-xs font-medium text-slate-500">Linked to: {user.email}</span>
                  </div>

                  {isFetchingOrders ? (
                    <div className="py-12 flex flex-col items-center justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-3 border-red-600 border-t-transparent" />
                      <p className="mt-2 text-xs font-bold text-slate-400">Checking dispatcher log...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="py-12 text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
                        <ShoppingBag size={24} />
                      </div>
                      <h4 className="font-bold text-slate-800 text-base">No Orders Located</h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                        You have not placed any orders yet. Visit our shop to browse computer parts, CCTV setups, or networking accessories.
                      </p>
                      <div className="mt-6">
                        <Link to="/shop" className="rounded-full bg-slate-950 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-600 transition shadow-sm">
                          Browse hardware shop
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map(order => {
                        return (
                          <div key={order._id || order.orderId} className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition duration-300">
                            
                            {/* Order Header */}
                            <div className="bg-slate-950 p-4 text-white flex justify-between items-center flex-wrap gap-3">
                              <div>
                                <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-bold">Order ID</span>
                                <span className="font-black text-red-500 text-sm">{order.orderId}</span>
                              </div>
                              <div className="text-right sm:text-left">
                                <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-bold">Date Placed</span>
                                <span className="text-xs font-bold">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                              </div>
                              <div>
                                <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-bold">Grand Total</span>
                                <span className="text-sm font-black text-red-400">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                              </div>
                              <div>
                                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                                  order.status === 'Delivered' ? 'bg-emerald-500 text-slate-950' :
                                  order.status === 'Cancelled' ? 'bg-red-500 text-white' :
                                  order.status === 'Shipped' ? 'bg-blue-500 text-white' : 'bg-red-600 text-white animate-pulse'
                                }`}>
                                  {order.status}
                                </span>
                              </div>
                            </div>

                            {/* Order Body */}
                            <div className="p-4 md:p-5 space-y-4 text-xs font-medium">
                              
                              {/* Items List */}
                              <div className="space-y-2 border-b border-slate-100 pb-3">
                                {order.items.map((itm, i) => (
                                  <div key={i} className="flex justify-between items-center text-slate-700">
                                    <div className="flex-1 truncate pr-4">
                                      <span className="font-bold text-slate-900">{itm.name}</span>
                                      <span className="text-slate-400 text-[10px] ml-2">SKU: {itm.sku}</span>
                                    </div>
                                    <div className="text-slate-500">Qty: {itm.qty}</div>
                                    <div className="min-w-[80px] text-right font-bold text-slate-900">₹{(itm.price * itm.qty).toLocaleString('en-IN')}</div>
                                  </div>
                                ))}
                              </div>

                              {/* Delivery info */}
                              <div className="grid gap-4 sm:grid-cols-2 text-[11px] text-slate-500 leading-relaxed border-b border-slate-100 pb-3">
                                <div>
                                  <span className="block font-black text-slate-700 uppercase tracking-wide text-[9px] mb-1">Shipping Details</span>
                                  <p className="font-bold text-slate-800">{order.customerName}</p>
                                  <p>{order.customerPhone}</p>
                                  <p className="italic text-slate-500 mt-1">{order.shippingAddress}</p>
                                </div>
                                <div>
                                  <span className="block font-black text-slate-700 uppercase tracking-wide text-[9px] mb-1">Billing Summary</span>
                                  <p>Payment: <span className="font-bold">{order.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : 'UPI Scan'}</span></p>
                                  <p className="mt-1">For delivery dispatch queries, our support executive can assist with your transaction.</p>
                                </div>
                              </div>

                              <div className="flex justify-between items-center flex-wrap gap-2 pt-1">
                                <span className="text-[10px] text-slate-400">Order Ref: #{order.orderId}</span>
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-lg">
                                  <CheckCircle2 size={13} />
                                  <span>Official Store Receipt Confirmed</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ADDRESS BOOK TAB PANEL */}
              {activeTab === 'addresses' && (
                <div className="space-y-6">
                  
                  {/* Saved Addresses list */}
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-black text-slate-900 mb-6 tracking-tight flex items-center gap-2">
                      <MapPin size={18} className="text-red-600" />
                      Saved Delivery Addresses
                    </h2>

                    {(!user.addresses || user.addresses.length === 0) ? (
                      <p className="text-xs font-semibold text-slate-400 italic">No delivery addresses saved in your workbook. Use the form below to register one.</p>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {user.addresses.map((addr, idx) => (
                          <div key={idx} className="relative p-5 rounded-2xl border border-slate-150 bg-slate-55/40 text-xs leading-relaxed">
                            {addr.isDefault && (
                              <span className="absolute top-4 right-4 bg-red-600 text-white font-black text-[8px] uppercase px-1.5 py-0.5 rounded-full">
                                Default
                              </span>
                            )}
                            <h4 className="font-black text-slate-800 text-sm flex items-center gap-1.5">
                              <MapPin size={14} className="text-red-600" />
                              Address #{idx + 1}
                            </h4>
                            <p className="mt-3 text-slate-700 font-semibold">{addr.street}</p>
                            <p className="text-slate-500">{addr.city}, {addr.state} - <span className="font-bold text-slate-800">{addr.zipCode}</span></p>
                            
                            <div className="mt-4 border-t border-slate-100 pt-3 flex justify-end">
                              <button
                                onClick={() => handleDeleteAddress(idx)}
                                className="text-[10px] font-black text-red-600 hover:underline"
                              >
                                Delete Address
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add Address Form */}
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-4 text-sm">Add New Address</h3>
                    <form onSubmit={handleAddAddress} className="space-y-4 text-xs font-semibold">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Street Address</label>
                        <input
                          type="text"
                          placeholder="Complete house details, shop number, road name"
                          value={addressLine}
                          onChange={(e) => setAddressLine(e.target.value)}
                          required
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 outline-none focus:border-red-500 focus:bg-white"
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">City</label>
                          <input
                            type="text"
                            placeholder="e.g. Haldwani"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 outline-none focus:border-red-500 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">State</label>
                          <input
                            type="text"
                            placeholder="e.g. Uttarakhand"
                            value={stateName}
                            onChange={(e) => setStateName(e.target.value)}
                            required
                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 outline-none focus:border-red-500 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Pincode (ZIP)</label>
                          <input
                            type="text"
                            placeholder="6-digit e.g. 263139"
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value)}
                            required
                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 outline-none focus:border-red-500 focus:bg-white"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 py-1">
                        <input
                          type="checkbox"
                          id="default_address_checkbox"
                          checked={isDefault}
                          onChange={(e) => setIsDefault(e.target.checked)}
                          className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
                        />
                        <label htmlFor="default_address_checkbox" className="text-slate-600 cursor-pointer select-none">Set as primary default address</label>
                      </div>

                      <button
                        type="submit"
                        disabled={actionLoading}
                        className="rounded-full bg-slate-950 px-5 py-2.5 text-xs font-black text-white hover:bg-red-600 transition disabled:opacity-50 inline-flex items-center gap-1.5"
                      >
                        Add Address Record
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* WHOLESALE B2B TAB PANEL */}
              {activeTab === 'wholesale' && user.role === 'wholesaler' && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6 text-sm">
                  <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <Building size={18} className="text-red-600" />
                    Wholesale B2B trade profile
                  </h2>

                  {user.status === 'PendingApproval' ? (
                    <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5 space-y-3 leading-relaxed">
                      <div className="flex items-center gap-2 text-amber-800 font-bold">
                        <Clock size={18} />
                        <h4>Verification Application Under Management Review</h4>
                      </div>
                      <p className="text-xs text-amber-700/90 font-medium">
                        Your wholesale trading request for <span className="font-bold text-slate-900">{user.companyName}</span> (GSTIN: <span className="font-mono bg-white px-1.5 py-0.5 rounded border text-[11px] font-bold">{user.gstin}</span>) has been saved in our directory. Our administrators are validating tax records to authorize wholesale prices.
                      </p>
                      <p className="text-xs text-amber-700/90">
                        In the meantime, you can browse retail products or contact support directly on WhatsApp at <span className="font-bold text-slate-950">+91 80060 33345</span> to expedite approval.
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 space-y-3 leading-relaxed">
                      <div className="flex items-center gap-2 text-emerald-800 font-bold">
                        <CheckCircle2 size={18} />
                        <h4>Wholesale Trading Status: Activated</h4>
                      </div>
                      <p className="text-xs text-emerald-700/90 font-medium">
                        Excellent! Your B2B reseller account is certified. You have access to specialized pricing, corporate invoice generation with GST compliance, and high cashback ledger options.
                      </p>
                    </div>
                  )}

                  <div className="grid gap-6 sm:grid-cols-2 font-medium">
                    <div className="rounded-2xl border border-slate-100 p-4 space-y-2">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Trading Company</span>
                      <p className="text-base font-black text-slate-800">{user.companyName || 'Not Defined'}</p>
                    </div>

                    <div className="rounded-2xl border border-slate-100 p-4 space-y-2">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">GSTIN Registry</span>
                      <p className="text-base font-black font-mono text-slate-800 uppercase">{user.gstin || 'Not Provided'}</p>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-900 p-5 text-white space-y-3">
                    <h4 className="font-black text-sm tracking-wide flex items-center gap-1.5">
                      <Sparkles size={16} className="text-red-500 animate-pulse" />
                      Exclusive B2B Benefits
                    </h4>
                    <ul className="space-y-2 text-xs text-white/80 list-disc list-inside leading-relaxed">
                      <li>Up to <span className="text-red-400 font-bold">35% discount</span> on wholesale lots of Cat6 copper cables & coaxial connectors.</li>
                      <li>GST-compliant business tax invoices to claim input credit on surveillance CCTV systems.</li>
                      <li>Same-day local shipping in Haldwani and regional transport tracking.</li>
                      <li>Direct credit ledger support and cashbacks directly to store wallet balance.</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
