import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  Cable,
  CreditCard,
  Headphones,
  LayoutGrid,
  MonitorSmartphone,
  PackageCheck,
  ScanSearch,
  ShieldCheck,
  ShoppingBag,
  Star,
  Store,
  Truck,
  Wallet,
  Wrench,
} from 'lucide-react'
import { products } from '../data/products'
import ProductCard from '../components/ProductCard'

const servicePoints = [
  {
    title: 'Fast Delivery',
    text: 'Quick handling for practical business buying needs and smoother order movement.',
    icon: Truck,
  },
  {
    title: 'COD Available',
    text: 'Convenient purchase flow for buyers who prefer trusted order confirmation first.',
    icon: Wallet,
  },
  {
    title: 'Secure Checkout',
    text: 'Confident and professional buying experience with clean inquiry-first user flow.',
    icon: ShieldCheck,
  },
  {
    title: 'Online Payment',
    text: 'Simple payment options for faster order processing and easier business convenience.',
    icon: CreditCard,
  },
]

const categoryCards = [
  {
    title: 'CCTV Products',
    text: 'Camera accessories, connectors, DVR/NVR support items and daily surveillance essentials.',
    icon: MonitorSmartphone,
  },
  {
    title: 'Networking Items',
    text: 'Routers, switches, LAN accessories and setup material for office and installer needs.',
    icon: LayoutGrid,
  },
  {
    title: 'Power Solutions',
    text: 'SMPS, adapters, chargers and practical power support products for stable usage.',
    icon: BadgeCheck,
  },
  {
    title: 'Storage Devices',
    text: 'HDD, SSD, memory cards and dependable storage products for regular operations.',
    icon: PackageCheck,
  },
  {
    title: 'Cables Range',
    text: 'LAN, USB, HDMI, scanner and utility cables for business and technical use.',
    icon: Cable,
  },
  {
    title: 'Adapters & Connectors',
    text: 'Useful conversion accessories and compact hardware for smoother compatibility.',
    icon: Boxes,
  },
  {
    title: 'Installation Tools',
    text: 'Technician-friendly tools for fitting, service and routine maintenance support.',
    icon: Wrench,
  },
  {
    title: 'Computer Accessories',
    text: 'Mouse, keyboard and utility products for office, counter and billing setups.',
    icon: Store,
  },
]

const stats = [
  { value: '215+', label: 'Live Products' },
  { value: '13', label: 'Core Categories' },
  { value: '24/7', label: 'Inquiry Access' },
  { value: '500+', label: 'Business Buyers Reach' },
]

const promiseBlocks = [
  {
    label: 'Focus Area',
    value: 'CCTV, adapters, cables, tools and networking products',
  },
  {
    label: 'Ideal For',
    value: 'Retail buyers, resellers, offices and technicians',
  },
  {
    label: 'Catalog Size',
    value: '215 frontend-ready product items',
  },
  {
    label: 'Contact',
    value: '80060 33345',
  },
]

const trustHighlights = [
  {
    title: 'Business Friendly',
    text: 'Structured presentation that helps both retail and B2B-style buyers browse quickly.',
    icon: ShoppingBag,
  },
  {
    title: 'Product Guidance',
    text: 'Useful category-level clarity for customers who need fast selection support.',
    icon: ScanSearch,
  },
  {
    title: 'Trusted Support',
    text: 'Focused on practical communication and reliable after-inquiry assistance.',
    icon: Headphones,
  },
]

const buyingSteps = [
  {
    step: '01',
    title: 'Browse Products',
    text: 'Customers can scan categories, featured items and best-selling ranges.',
  },
  {
    step: '02',
    title: 'Select Requirement',
    text: 'Choose the relevant product based on category, use case and price band.',
  },
  {
    step: '03',
    title: 'Send Inquiry',
    text: 'Use contact or inquiry flow to connect for stock, quantity or support details.',
  },
  {
    step: '04',
    title: 'Confirm Order',
    text: 'Finalize via call, direct support or future checkout workflow expansion.',
  },
]

const faqItems = [
  {
    question: 'What kind of products are available on IT SAATHI?',
    answer:
      'The catalog is focused on CCTV accessories, networking products, power items, cables, storage devices and computer-use essentials.',
  },
  {
    question: 'Is this website suitable for retail and reseller buyers?',
    answer:
      'Yes, the homepage structure and inquiry flow are designed to support both direct buyers and business-oriented purchase requirements.',
  },
  {
    question: 'Can more features be added later?',
    answer:
      'Yes, this frontend can be extended with admin panel, real checkout, login system, WhatsApp order flow and backend product management.',
  },
]

export default function Home() {
  const featuredProducts = products
    .filter((item) => item.section === 'featured')
    .slice(0, 6)

  const bestProducts = products
    .filter((item) => item.section === 'best')
    .slice(0, 3)

  const newProducts = products
    .filter((item) => item.section === 'new')
    .slice(0, 3)

  return (
    <>
      <section className="relative overflow-hidden section-gap">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-slate-100" />
        <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-red-100/60 blur-3xl" />
        <div className="absolute right-0 top-16 h-72 w-72 rounded-full bg-orange-100/50 blur-3xl" />

        <div className="container-main relative grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <span className="eyebrow">Professional Ecommerce Store</span>

            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              IT, CCTV and accessory products with a sharper, cleaner storefront
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              IT SAATHI is built with a stronger visual identity while
              keeping the ecommerce flow practical, trustworthy and easy to
              browse for both everyday buyers and business customers.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link to="/shop" className="btn-primary">
                Explore Products <ArrowRight className="ml-2" size={18} />
              </Link>

              <Link to="/about" className="btn-secondary">
                About Adarsh Jain
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((item) => (
                <div key={item.label} className="card-shell p-5">
                  <div className="text-2xl font-black text-red-700 sm:text-3xl">
                    {item.value}
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">
                CCTV Essentials
              </span>
              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                Networking Products
              </span>
              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                Storage Devices
              </span>
              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                Computer Accessories
              </span>
            </div>
          </div>

          <div className="card-shell p-4">
            <div className="rounded-[28px] bg-gradient-to-br from-slate-950 via-red-800 to-red-600 p-6 text-white sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-white/75">
                    Brand Promise
                  </p>
                  <h2 className="mt-2 text-3xl font-black sm:text-4xl">
                    Smart Tech, Trusted Service
                  </h2>
                </div>

                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                  <Star className="h-7 w-7 text-yellow-300" />
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {promiseBlocks.map((item) => (
                  <div key={item.label} className="rounded-2xl bg-white/10 p-5">
                    <p className="text-sm text-white/80">{item.label}</p>
                    <p className="mt-1 font-semibold leading-6">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-white/15 bg-white/10 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-white/70">
                  Why this storefront
                </p>
                <p className="mt-2 text-sm leading-7 text-white/85">
                  It supports faster scanning, better product visibility,
                  stronger business trust and a cleaner inquiry-first buying
                  journey for electronics and IT accessories.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-gap">
        <div className="container-main">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="eyebrow">Service Highlights</span>
              <h2 className="mt-4 text-3xl font-black sm:text-4xl">
                Business-ready ecommerce sections
              </h2>
            </div>

            <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Built for practical buying behavior with faster scanning,
              stronger trust points and cleaner product support.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {servicePoints.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="card-shell group p-6 transition duration-300 hover:-translate-y-1"
                >
                  <div className="mb-5 inline-flex rounded-2xl bg-red-50 p-4 text-red-700 transition group-hover:bg-red-100">
                    <Icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="mt-3 text-slate-600">{item.text}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section-gap bg-white">
        <div className="container-main">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="eyebrow">Why Choose Us</span>
              <h2 className="mt-4 text-3xl font-black sm:text-4xl">
                More than a product listing page
              </h2>
            </div>

            <Link to="/contact" className="btn-secondary">
              Talk to Support
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {trustHighlights.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="card-shell group p-6 transition duration-300 hover:-translate-y-1"
                >
                  <div className="mb-5 inline-flex rounded-2xl bg-slate-100 p-4 text-red-700 transition group-hover:bg-red-50">
                    <Icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-3 text-slate-600">{item.text}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section-gap">
        <div className="container-main">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="eyebrow">Categories</span>
              <h2 className="mt-4 text-3xl font-black sm:text-4xl">
                Shop by product type
              </h2>
            </div>

            <Link to="/shop" className="btn-secondary">
              Visit Full Shop
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {categoryCards.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="card-shell group p-6 transition duration-300 hover:-translate-y-1"
                >
                  <div className="mb-4 inline-flex rounded-2xl bg-red-50 p-3 text-red-700 transition group-hover:bg-red-100">
                    <Icon size={22} />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.22em] text-red-700">
                    Category
                  </span>
                  <h3 className="mt-3 text-2xl font-black">{item.title}</h3>
                  <p className="mt-3 text-slate-600">{item.text}</p>
                  <Link
                    to="/shop"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-red-700 transition hover:text-red-800"
                  >
                    Browse now <ArrowRight size={15} />
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section-gap bg-white">
        <div className="container-main">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="eyebrow">Featured Products</span>
              <h2 className="mt-4 text-3xl font-black sm:text-4xl">
                Homepage featured grid
              </h2>
            </div>

            <Link to="/shop" className="btn-primary">
              See All Products
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-gap">
        <div className="container-main grid gap-10 lg:grid-cols-2">
          <div>
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <span className="eyebrow">Best Seller</span>
                <h2 className="mt-4 text-3xl font-black">Popular moving items</h2>
              </div>
              <Link
                to="/shop"
                className="hidden text-sm font-semibold text-red-700 lg:inline-flex"
              >
                View more
              </Link>
            </div>

            <div className="grid gap-6">
              {bestProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          <div>
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <span className="eyebrow">New Arrival</span>
                <h2 className="mt-4 text-3xl font-black">
                  Fresh product additions
                </h2>
              </div>
              <Link
                to="/shop"
                className="hidden text-sm font-semibold text-red-700 lg:inline-flex"
              >
                View more
              </Link>
            </div>

            <div className="grid gap-6">
              {newProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-gap bg-white">
        <div className="container-main">
          <div className="mb-10">
            <span className="eyebrow">How It Works</span>
            <h2 className="mt-4 text-3xl font-black sm:text-4xl">
              Simple buying flow for practical customers
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {buyingSteps.map((item) => (
              <div
                key={item.step}
                className="card-shell relative p-6 transition duration-300 hover:-translate-y-1"
              >
                <div className="text-sm font-bold uppercase tracking-[0.25em] text-red-700">
                  Step {item.step}
                </div>
                <h3 className="mt-4 text-xl font-black">{item.title}</h3>
                <p className="mt-3 text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-gap">
        <div className="container-main">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="card-shell p-6 sm:p-8">
              <span className="eyebrow">Business Support</span>
              <h2 className="mt-4 text-3xl font-black sm:text-4xl">
                Built to grow with more features
              </h2>
              <p className="mt-4 text-slate-600 leading-7">
                Ye homepage ab sirf basic landing page nahi rahi. Isme trust
                sections, product flow, category depth, inquiry direction aur
                business-friendly structure add ki gayi hai taaki future me
                admin panel, order logic, checkout, login aur backend integration
                aur easily ki ja sake.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-5">
                  <h3 className="font-bold text-slate-900">Frontend Ready</h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Multi-section ecommerce homepage with reusable blocks.
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-5">
                  <h3 className="font-bold text-slate-900">Backend Ready</h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Can be extended with database, order panel and admin control.
                  </p>
                </div>
              </div>
            </div>

            <div className="card-shell p-6 sm:p-8">
              <span className="eyebrow">FAQs</span>
              <h2 className="mt-4 text-3xl font-black sm:text-4xl">
                Common customer questions
              </h2>

              <div className="mt-6 space-y-4">
                {faqItems.map((item) => (
                  <div key={item.question} className="rounded-2xl bg-slate-50 p-5">
                    <h3 className="text-lg font-bold text-slate-900">
                      {item.question}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-gap">
        <div className="container-main">
          <div className="rounded-[32px] bg-gradient-to-r from-slate-950 via-red-800 to-red-600 px-6 py-10 text-white sm:px-10">
            <div className="grid items-center gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div>
                <span className="text-sm font-semibold uppercase tracking-[0.25em] text-white/70">
                  Business Contact
                </span>
                <h2 className="mt-4 text-3xl font-black sm:text-4xl">
                  Frontend ready with 215 products
                </h2>
                <p className="mt-4 max-w-2xl text-white/85">
                  Is frontend project me product catalog integrated hai. Aap agle
                  step me admin panel, login, checkout, database, WhatsApp order
                  flow aur real product management bhi add kar sakte ho.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:justify-items-end">
                <Link
                  to="/contact"
                  className="btn-secondary border-white bg-white text-slate-900 hover:border-white hover:text-slate-900"
                >
                  Contact Page
                </Link>

                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-red-700 transition hover:bg-slate-100"
                >
                  Browse Shop
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}