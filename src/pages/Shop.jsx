import { useMemo, useState } from 'react'
import {
  ArrowRight,
  ChevronDown,
  Filter,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react'
import { products } from '../data/products'
import ProductCard from '../components/ProductCard'

const sortOptions = [
  { value: 'default', label: 'Default Sorting' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name', label: 'Name: A to Z' },
]

export default function Shop() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sortBy, setSortBy] = useState('default')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const categories = useMemo(
    () => ['All', ...new Set(products.map((item) => item.category))],
    []
  )

  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    if (category !== 'All') {
      filtered = filtered.filter((item) => item.category === category)
    }

    if (search.trim()) {
      const searchTerm = search.trim().toLowerCase()

      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm) ||
          item.category.toLowerCase().includes(searchTerm) ||
          item.sku?.toLowerCase().includes(searchTerm)
      )
    }

    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price)
    }

    if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price)
    }

    if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name))
    }

    return filtered
  }, [search, category, sortBy])

  const hasActiveFilters =
    search.trim() !== '' || category !== 'All' || sortBy !== 'default'

  const clearFilters = () => {
    setSearch('')
    setCategory('All')
    setSortBy('default')
    setMobileFiltersOpen(false)
  }

  const selectCategory = (selectedCategory) => {
    setCategory(selectedCategory)
    setMobileFiltersOpen(false)
  }

  return (
    <>
      <section className="relative overflow-hidden section-gap">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-slate-100" />
        <div className="absolute left-0 top-10 h-60 w-60 rounded-full bg-red-100/60 blur-3xl" />
        <div className="absolute right-0 top-12 h-72 w-72 rounded-full bg-orange-100/50 blur-3xl" />

        <div className="container-main relative">
          <div className="max-w-3xl">
            <span className="eyebrow">Shop Products</span>

            <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
              Explore our complete IT and accessory range
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Search, filter and browse CCTV accessories, networking products,
              power items, cables, adapters, storage devices and computer-use
              essentials from IT SAATHI.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="card-shell p-5">
              <div className="text-2xl font-black text-red-700">
                {products.length}+
              </div>
              <p className="mt-1 text-sm text-slate-500">Available Products</p>
            </div>

            <div className="card-shell p-5">
              <div className="text-2xl font-black text-red-700">
                {categories.length - 1}
              </div>
              <p className="mt-1 text-sm text-slate-500">Product Categories</p>
            </div>

            <div className="card-shell p-5">
              <div className="text-2xl font-black text-red-700">Easy</div>
              <p className="mt-1 text-sm text-slate-500">Search & Inquiry Flow</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-gap pt-0">
        <div className="container-main">
          <div className="card-shell overflow-hidden p-0">
            <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50 p-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Find the right product
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Use search, category and sorting options for faster browsing.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-red-600 hover:text-red-700 lg:hidden"
              >
                <SlidersHorizontal size={17} />
                Filters
                <ChevronDown
                  size={16}
                  className={`transition ${mobileFiltersOpen ? 'rotate-180' : ''}`}
                />
              </button>
            </div>

            <div
              className={`grid gap-4 p-5 lg:grid-cols-[1.4fr_0.9fr_0.9fr] ${
                mobileFiltersOpen ? 'block' : 'hidden lg:grid'
              }`}
            >
              <label className="relative block">
                <span className="sr-only">Search products</span>

                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Search by product name, category or SKU..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-field w-full pl-11"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-700"
                    aria-label="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
              </label>

              <label className="relative block">
                <span className="sr-only">Filter by category</span>

                <Filter
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input-field w-full appearance-none pl-11"
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item === 'All' ? 'All Categories' : item}
                    </option>
                  ))}
                </select>
              </label>

              <label className="relative block">
                <span className="sr-only">Sort products</span>

                <SlidersHorizontal
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-field w-full appearance-none pl-11"
                >
                  {sortOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="border-t border-slate-200 p-5">
              <div className="flex flex-wrap gap-2">
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => selectCategory(item)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      category === item
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-700'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Showing {filteredProducts.length} of {products.length} products
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {category === 'All'
                  ? 'All product categories are currently visible.'
                  : `Browsing ${category} category products.`}
              </p>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-2 text-sm font-semibold text-red-700 transition hover:text-red-900"
              >
                <RotateCcw size={16} />
                Clear all filters
              </button>
            )}
          </div>

          {filteredProducts.length > 0 ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-700">
                <Search size={28} />
              </div>

              <h2 className="mt-5 text-2xl font-black text-slate-900">
                No matching products found
              </h2>

              <p className="mx-auto mt-3 max-w-md text-slate-600">
                Try another product name, clear your search or select a
                different category to continue browsing.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="btn-primary mt-6"
              >
                Reset Filters
                <ArrowRight className="ml-2" size={17} />
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}