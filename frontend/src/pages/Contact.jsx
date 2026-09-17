import { useState } from 'react'
import {
  ArrowRight,
  Clock3,
  Headphones,
  Mail,
  MapPin,
  MessageCircleMore,
  Phone,
  ShieldCheck,
} from 'lucide-react'

const contactCards = [
  {
    title: 'Call for instant support',
    value: '80060 33345',
    href: 'tel:8006033345',
    icon: Phone,
    note: 'Direct discussion for orders and urgent requirements',
  },
  {
    title: 'Email for bulk inquiry',
    value: 'Support@itsaathi.com',
    href: 'mailto:Support@itsaathi.com',
    icon: Mail,
    note: 'Best for quotations, bulk supply and product details',
  },
  {
    title: 'Service coverage',
    value: 'India-wide support',
    href: '#',
    icon: MapPin,
    note: 'Product inquiry and business supply assistance across India',
  },
]

const trustPoints = [
  {
    title: 'Fast response',
    text: 'Quick reply for product inquiries, order discussions and support needs.',
    icon: Clock3,
  },
  {
    title: 'Business focused',
    text: 'Suitable for resellers, office buyers, installers and repeat customers.',
    icon: ShieldCheck,
  },
  {
    title: 'Friendly guidance',
    text: 'Simple communication with clear product understanding before purchase.',
    icon: Headphones,
  },
]

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    subject: '',
    inquiryType: 'Product Inquiry',
    message: '',
    needCallback: false,
    bulkPricing: false
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [submittedEnquiryId, setSubmittedEnquiryId] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess(false)
    setSubmittedEnquiryId('')

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          subject: formData.subject || `${formData.inquiryType} for IT SAATHI`,
          inquiryType: formData.inquiryType,
          message: formData.message,
          needCallback: formData.needCallback,
          bulkPricing: formData.bulkPricing
        })
      })

      let result
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        result = await response.json()
      } else {
        const text = await response.text()
        try {
          result = JSON.parse(text)
        } catch {
          result = { success: response.ok, message: text || 'Server response received.' }
        }
      }

      if (response.ok && (result.success || result.enquiry)) {
        setSuccess(true)
        if (result.enquiry && result.enquiry.enquiryId) {
          setSubmittedEnquiryId(result.enquiry.enquiryId)
        }
        setFormData({
          name: '',
          email: '',
          phone: '',
          city: '',
          subject: '',
          inquiryType: 'Product Inquiry',
          message: '',
          needCallback: false,
          bulkPricing: false
        })
      } else {
        throw new Error(result.message || 'Unable to submit your inquiry at this moment.')
      }
    } catch (err) {
      console.error('Contact form submission error:', err)
      setError(err.message || 'Failed to submit inquiry. Please call or WhatsApp us directly at 8006033345.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="section-gap overflow-hidden">
      <div className="container-main">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="eyebrow">Contact Us</span>

            <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
              Let’s talk about your IT product needs, business orders and support queries
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
              IT SAATHI helps with product inquiries, reseller communication,
              business supply discussions and requirement-based support. This page is
              designed to make contact feel faster, cleaner and more professional.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {trustPoints.map((item) => {
                const Icon = item.icon

                return (
                  <div key={item.title} className="card-shell p-5">
                    <div className="mb-4 inline-flex rounded-2xl bg-red-50 p-3 text-red-700">
                      <Icon size={22} />
                    </div>
                    <h3 className="text-lg font-black">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
                  </div>
                )
              })}
            </div>

            <div className="mt-8 grid gap-4">
              {contactCards.map((item) => {
                const Icon = item.icon
                const isClickable = item.href !== '#'

                const Wrapper = isClickable ? 'a' : 'div'
                const wrapperProps = isClickable
                  ? { href: item.href }
                  : {}

                return (
                  <Wrapper
                    key={item.title}
                    {...wrapperProps}
                    className="card-shell group flex flex-col gap-4 rounded-[28px] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(15,23,42,0.12)] sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <div className="rounded-2xl bg-red-50 p-4 text-red-700 transition group-hover:bg-red-600 group-hover:text-white">
                        <Icon size={24} />
                      </div>

                      <div>
                        <h3 className="text-lg font-black text-slate-900">{item.title}</h3>
                        <p className="mt-1 break-all text-base font-semibold text-red-700">
                          {item.value}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {item.note}
                        </p>
                      </div>
                    </div>

                    {isClickable && (
                      <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition group-hover:text-red-600">
                        Connect
                        <ArrowRight size={16} />
                      </div>
                    )}
                  </Wrapper>
                )
              })}
            </div>

            <div className="mt-8 rounded-[32px] bg-slate-950 p-6 text-white shadow-[0_20px_60px_rgba(2,6,23,0.2)] sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.24em] text-red-300">
                    Quick Business Contact
                  </p>
                  <h2 className="mt-2 text-2xl font-black">
                    Need fast product assistance for your next order?
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">
                    Use direct calling or email support for faster communication about stock,
                    pricing, product selection and bulk purchase planning.
                  </p>
                </div>

                <a
                  href="tel:8006033345"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-red-600 hover:text-white"
                >
                  <Phone size={18} />
                  Call Now
                </a>
              </div>
            </div>
          </div>

          <div className="card-shell relative overflow-hidden rounded-[32px] p-6 sm:p-8">
            <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-red-100 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-slate-100 blur-3xl" />

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-red-700">
                <MessageCircleMore size={14} />
                Send Inquiry
              </span>

              <h2 className="mt-4 text-3xl font-black">
                Tell us what you need
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Share your requirement clearly and use this section for product sourcing,
                IT accessory support, business order requests or reseller communication.
              </p>

              {success && (
                <div className="mt-6 rounded-2xl bg-emerald-50 p-4 border border-emerald-200 text-emerald-800 text-sm font-semibold space-y-1">
                  <div className="flex items-center gap-2 font-bold text-emerald-900">
                    <span>🎉 Inquiry Submitted Successfully!</span>
                    {submittedEnquiryId && (
                      <span className="rounded-lg bg-emerald-200/70 px-2 py-0.5 text-xs text-emerald-950 font-mono">
                        Ref: {submittedEnquiryId}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-emerald-700 font-normal">
                    Thank you! The IT SAATHI business and support team will review your requirement and reach out to you shortly.
                  </p>
                </div>
              )}

              {error && (
                <div className="mt-6 rounded-2xl bg-red-50 p-4 border border-red-200 text-red-800 text-sm font-semibold">
                  ❌ {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Your Name"
                    className="input-field"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Your Email"
                    className="input-field"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    name="phone"
                    required
                    placeholder="Phone Number"
                    className="input-field"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="city"
                    placeholder="City / Business Name"
                    className="input-field"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>

                <input
                  type="text"
                  name="subject"
                  placeholder="Subject (Optional)"
                  className="input-field"
                  value={formData.subject}
                  onChange={handleChange}
                />

                <select
                  name="inquiryType"
                  className="input-field"
                  value={formData.inquiryType}
                  onChange={handleChange}
                >
                  <option value="Product Inquiry">Product Inquiry</option>
                  <option value="Bulk Order">Bulk Order</option>
                  <option value="Reseller Requirement">Reseller Requirement</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="General Business Query">General Business Query</option>
                </select>

                <textarea
                  name="message"
                  required
                  rows="6"
                  placeholder="Write your message with product details, quantity, brand preference or support requirement"
                  className="input-field resize-none"
                  value={formData.message}
                  onChange={handleChange}
                />

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                    <input
                      type="checkbox"
                      name="needCallback"
                      className="h-4 w-4 accent-red-600"
                      checked={formData.needCallback}
                      onChange={handleChange}
                    />
                    Need callback support
                  </label>

                  <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                    <input
                      type="checkbox"
                      name="bulkPricing"
                      className="h-4 w-4 accent-red-600"
                      checked={formData.bulkPricing}
                      onChange={handleChange}
                    />
                    Looking for bulk pricing
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary group mt-2 w-full disabled:opacity-50"
                >
                  <span className="inline-flex items-center gap-2">
                    {submitting ? 'Submitting...' : 'Submit Inquiry'}
                    <ArrowRight
                      size={18}
                      className="transition duration-300 group-hover:translate-x-1"
                    />
                  </span>
                </button>
              </form>

              <div className="mt-6 rounded-2xl border border-dashed border-red-200 bg-red-50 px-4 py-4 text-sm leading-6 text-slate-700">
                For faster response, mention product type, quantity, delivery city and your
                business requirement in the message.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
