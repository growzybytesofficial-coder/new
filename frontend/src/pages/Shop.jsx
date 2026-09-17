import { useMemo, useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  ArrowRight,
  ChevronDown,
  Filter,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
  Grid,
  List,
  Check,
  Flame,
  Star,
  Sparkles,
  Layers,
  ArrowUpDown,
  ShoppingBag,
  Heart,
  Eye,
  Trash2,
} from 'lucide-react'
import { products } from '../data/products'
import ProductCard from '../components/ProductCard'
import QuickViewModal from '../components/QuickViewModal'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useToast } from '../context/ToastContext'
import { useProductImages } from '../context/ProductImageContext'

const sortOptions = [
  { value: 'default', label: 'Featured & Popular' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'discount', label: 'Biggest Discount' },
  { value: 'name', label: 'Product Name (A-Z)' },
]

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sortBy, setSortBy] = useState('default')
  const [priceMax, setPriceMax] = useState(5000)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [onSaleOnly, setOnSaleOnly] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [pageLimit, setPageLimit] = useState(24)
  const [quickViewProduct, setQuickViewProduct] = useState(null)

  const { addToCart, openDrawer } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const { addToast } = useToast()
  const { productImages } = useProductImages()

  // Sync URL search params
  useEffect(() => {
    const urlCat = searchParams.get('category')
    const urlSearch = searchParams.get('search')
    if (urlCat) setCategory(urlCat)
    if (urlSearch) setSearch(urlSearch)
  }, [searchParams])

  const categories = useMemo(
    () => ['All', ...new Set(products.map((item) => item.category))],
    []
  )

  const maxPossiblePrice = useMemo(() => {
    return Math.max(...products.map((p) => Number(p.price) || 0), 1000)
  }, [])

  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    if (category !== 'All') {
      filtered = filtered.filter((item) => item.category === category)
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.sku?.toLowerCase().includes(q) ||
          (item.short && item.short.toLowerCase().includes(q))
      )
    }

    if (priceMax < maxPossiblePrice) {
      filtered = filtered.filter((item) => Number(item.price) <= priceMax)
    }

    if (onSaleOnly) {
      filtered = filtered.filter((item) => item.oldPrice && item.oldPrice > item.price)
    }

    if (sortBy === 'price-low') {
      filtered.sort((a, b) => Number(a.price) - Number(b.price))
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => Number(b.price) - Number(a.price))
    } else if (sortBy === 'discount') {
      filtered.sort((a, b) => {
        const discA = a.oldPrice ? a.oldPrice - a.price : 0
        const discB = b.oldPrice ? b.oldPrice - b.price : 0
        return discB - discA
      })
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name))
    }

    return filtered
  }, [search, category, sortBy, priceMax, onSaleOnly, maxPossiblePrice])

  const paginatedProducts = filteredProducts.slice(0, pageLimit)

  const hasActiveFilters =
    search.trim() !== '' ||
    category !== 'All' ||
    sortBy !== 'default' ||
    priceMax < maxPossiblePrice ||
    onSaleOnly

  const clearFilters = () => {
    setSearch('')
    setCategory('All')
    setSortBy('default')
    setPriceMax(maxPossiblePrice)
    setOnSaleOnly(false)
    setSearchParams({})
    setMobileFiltersOpen(false)
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-50/70 via-white to-slate-50 border-b border-slate-200/80 py-12 text-slate-900 shadow-xs">
        <div className="container-main relative">
          <div className="max-w-3xl space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 border border-red-200 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-red-700">
              <Sparkles size={13} /> Complete Wholesale Catalog
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
              Hardware Products & Accessories
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              Explore CCTV infrastructure, high-frequency connectors, heavy SMPS converters, multi-gigabit Ethernet cabling, and installation tools with live pricing.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-xs">
              <div className="text-2xl font-black text-red-600">{products.length}+</div>
              <div className="text-xs font-bold text-slate-800 mt-0.5">Live Products</div>
            </div>
            <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-xs">
              <div className="text-2xl font-black text-amber-600">{categories.length - 1}</div>
              <div className="text-xs font-bold text-slate-800 mt-0.5">Hardware Categories</div>
            </div>
            <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-xs">
              <div className="text-2xl font-black text-emerald-600">100%</div>
              <div className="text-xs font-bold text-slate-800 mt-0.5">Genuine Certification</div>
            </div>
            <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-xs">
              <div className="text-2xl font-black text-blue-600">Same Day</div>
              <div className="text-xs font-bold text-slate-800 mt-0.5">Dispatch Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Shop Container */}
      <div className="container-main">
        {/* Top Control Bar (Search, Active Tags, Sort, View Switcher) */}
        <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, category, or SKU..."
                className="w-full rounded-2xl border border-slate-300 bg-slate-50/80 py-2.5 pl-10 pr-10 text-xs font-semibold text-slate-900 outline-none focus:border-red-600 focus:bg-white"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Sort & View Switches */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700"
              >
                <Filter size={15} className="text-red-600" />
                Filters
                {hasActiveFilters && (
                  <span className="h-2 w-2 rounded-full bg-red-600" />
                )}
              </button>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-2xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-red-600 cursor-pointer shadow-sm"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Grid / List View Toggle */}
              <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-100 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-xl transition ${
                    viewMode === 'grid' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Grid View"
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-xl transition ${
                    viewMode === 'list' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="List View"
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filter Pills Bar */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-400">Active Filters:</span>
              {category !== 'All' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-200 px-3 py-1 text-xs font-bold text-red-700">
                  Category: {category}
                  <button onClick={() => setCategory('All')} className="hover:text-red-900">
                    <X size={12} />
                  </button>
                </span>
              )}
              {search && (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-bold text-slate-800">
                  Search: "{search}"
                  <button onClick={() => setSearch('')} className="hover:text-slate-900">
                    <X size={12} />
                  </button>
                </span>
              )}
              {onSaleOnly && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-800">
                  On Sale Only
                  <button onClick={() => setOnSaleOnly(false)} className="hover:text-amber-900">
                    <X size={12} />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-xs font-bold text-red-600 hover:text-red-700 underline underline-offset-2 ml-1"
              >
                Reset All
              </button>
            </div>
          )}
        </div>

        {/* Content Layout (Sidebar + Results) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start pt-4">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-6 sticky top-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-red-600" />
                <h3 className="text-base font-black text-slate-900">Filter Products</h3>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-bold text-red-600 hover:text-red-700"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">Categories</h4>
              <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                {categories.map((cat) => {
                  const isSelected = category === cat
                  const count =
                    cat === 'All'
                      ? products.length
                      : products.filter((p) => p.category === cat).length
                  return (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition text-left ${
                        isSelected
                          ? 'bg-red-600 text-white shadow-sm'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate">{cat}</span>
                      <span className={`text-[10px] font-mono ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                        {count}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Quick Filter Toggles */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Special Filters</h4>
              <label className="flex items-center gap-3 cursor-pointer text-xs font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={onSaleOnly}
                  onChange={(e) => setOnSaleOnly(e.target.checked)}
                  className="rounded border-slate-300 text-red-600 focus:ring-red-500 h-4 w-4"
                />
                <span>🔥 On Sale / Discounted</span>
              </label>
            </div>
          </aside>

          {/* Product Results Stage */}
          <div className="lg:col-span-3 space-y-6">
            {/* Quick Category Scrollbar on Top of Results */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    category === cat
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Results Count Bar */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>
                Showing <span className="text-slate-900 font-black">{paginatedProducts.length}</span> of{' '}
                <span className="text-slate-900 font-black">{filteredProducts.length}</span> items
              </span>
              <span>Sorted by {sortOptions.find((s) => s.value === sortBy)?.label}</span>
            </div>

            {/* Products Listing (Grid or List View) */}
            {filteredProducts.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                  <Search size={32} />
                </div>
                <h3 className="text-lg font-black text-slate-800">No hardware products match your filter</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try clearing your search query or selecting a different category from the sidebar.
                </p>
                <button onClick={clearFilters} className="btn-primary text-xs py-2.5 px-6">
                  Reset All Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={() => setQuickViewProduct(product)}
                  />
                ))}
              </div>
            ) : (
              /* Compact List View */
              <div className="space-y-4">
                {paginatedProducts.map((product) => {
                  const img = productImages[product.slug]
                  return (
                    <div
                      key={product.id}
                      className="flex flex-col sm:flex-row items-center gap-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-red-200"
                    >
                      <div className="h-32 w-32 shrink-0 rounded-2xl bg-slate-50 border border-slate-200 p-2 flex items-center justify-center overflow-hidden">
                        {img ? (
                          <img src={img} alt={product.name} className="h-full w-full object-contain" />
                        ) : (
                          <span className="font-bold text-red-600 text-xs">IT SAATHI</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                          <span className="text-red-700 uppercase">{product.category}</span>
                          <span>•</span>
                          <span className="font-mono">{product.sku}</span>
                        </div>
                        <Link
                          to={`/product/${product.slug}`}
                          className="text-base font-black text-slate-900 hover:text-red-700 transition line-clamp-1 mt-1"
                        >
                          {product.name}
                        </Link>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                          {product.short || product.desc}
                        </p>
                      </div>

                      <div className="shrink-0 text-right flex flex-col items-end gap-3 w-full sm:w-auto">
                        <div>
                          <div className="text-2xl font-black text-red-700">₹{product.price}</div>
                          {product.oldPrice && (
                            <div className="text-xs text-slate-400 line-through">₹{product.oldPrice}</div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button
                            onClick={() => setQuickViewProduct(product)}
                            className="btn-secondary py-2 px-3 text-xs"
                            title="Quick View"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => {
                              addToCart(product, 1)
                              addToast({
                                title: 'Added to Cart',
                                message: product.name,
                                type: 'success',
                                action: {
                                  label: 'View Cart',
                                  onClick: openDrawer,
                                },
                              })
                            }}
                            className="btn-primary py-2 px-4 text-xs font-bold flex-1 sm:flex-initial"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Load More Pagination */}
            {paginatedProducts.length < filteredProducts.length && (
              <div className="pt-8 text-center">
                <button
                  onClick={() => setPageLimit((prev) => prev + 24)}
                  className="btn-secondary py-3 px-8 text-xs font-extrabold shadow-sm hover:border-red-600"
                >
                  Load More Products ({filteredProducts.length - paginatedProducts.length} remaining)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            onClick={() => setMobileFiltersOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-sm bg-white p-6 shadow-2xl flex flex-col justify-between">
              <div className="space-y-6 overflow-y-auto">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal size={18} className="text-red-600" />
                    <h3 className="text-base font-black text-slate-900">Filter Hardware</h3>
                  </div>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Categories */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">Category</h4>
                  <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                    {categories.map((cat) => {
                      const isSelected = category === cat
                      return (
                        <button
                          key={cat}
                          onClick={() => {
                            setCategory(cat)
                            setMobileFiltersOpen(false)
                          }}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition ${
                            isSelected ? 'bg-red-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span>{cat}</span>
                          {isSelected && <Check size={14} />}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Sort Option */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Sort Order</h4>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-800"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Special Toggle */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={onSaleOnly}
                      onChange={(e) => setOnSaleOnly(e.target.checked)}
                      className="rounded border-slate-300 text-red-600 h-4 w-4"
                    />
                    <span>🔥 On Sale Only</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full btn-primary py-3 text-xs justify-center font-black"
                >
                  Apply Filters ({filteredProducts.length} Results)
                </button>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="w-full btn-secondary py-2.5 text-xs justify-center font-bold text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Reset All Filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Embedded Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          isOpen={Boolean(quickViewProduct)}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  )
}
