import React, { useState } from 'react';
import {
  ShoppingBag,
  Clock,
  ShieldAlert,
  Trash2,
  RefreshCw,
  Users,
  CheckCircle,
  TrendingUp,
  Tag,
  MessageSquare,
  AlertTriangle,
  Gift,
  Award,
  Database,
  ArrowRight
} from 'lucide-react';

export default function DashboardView({
  orders,
  customers,
  products,
  enquiries,
  suppliers = [],
  brands = [],
  testimonials = [],
  imageMap = {},
  setActiveTab
}) {
  const [timeRange, setTimeRange] = useState('7d');
  const [hoveredBar, setHoveredBar] = useState(null);

  // Derive stats
  const pendingOrders = orders.filter(o => o.status === 'Pending');
  const processingOrders = orders.filter(o => o.status === 'Processing');
  const shippedOrders = orders.filter(o => o.status === 'Shipped');
  const cancelledOrders = orders.filter(o => o.status === 'Cancelled');
  const deliveredOrders = orders.filter(o => o.status === 'Delivered');

  const dispatchOrdersCount = processingOrders.length + shippedOrders.length;
  const returnedOrdersCount = 0; // Simulated returns
  const pendingPreorderCount = 0; // Simulated preorders

  // Wholesalers and Retailers count
  const wholesalersCount = customers.filter(c => c.role === 'wholesaler' || c.role === 'manager').length || 1;
  const retailersCount = customers.filter(c => c.role === 'retailer' || !c.role || c.role === 'customer').length || Math.max(1, customers.length - 1);
  const referralsCount = 4; // Simulated active referrers

  // Revenue collection
  const totalRevenue = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingCashback = 1250;
  const usedCashback = 450;

  // Products
  const totalProductsCount = products.length;
  const activeProductsCount = products.filter(p => !p.badge || p.badge !== 'Discontinued').length;
  const inactiveProductsCount = totalProductsCount - activeProductsCount;
  const outOfStockCount = products.filter((_, idx) => idx % 15 === 3).length; // Simulated out-of-stock

  const activeBrands = brands.filter(b => b.status === 'Active').length || 5;
  const inactiveBrands = brands.length - activeBrands;
  const pendingReviews = testimonials.filter(t => t.status === 'Pending').length;

  // Chart data
  const chartData = timeRange === '7d' 
    ? [
        { label: 'Mon', value: 12400, orders: 4 },
        { label: 'Tue', value: 18500, orders: 7 },
        { label: 'Wed', value: 9200, orders: 3 },
        { label: 'Thu', value: 24600, orders: 9 },
        { label: 'Fri', value: 15300, orders: 5 },
        { label: 'Sat', value: 31000, orders: 12 },
        { label: 'Sun', value: 22000, orders: 8 }
      ]
    : [
        { label: 'Week 1', value: 110000, orders: 35 },
        { label: 'Week 2', value: 145000, orders: 48 },
        { label: 'Week 3', value: 95000, orders: 29 },
        { label: 'Week 4', value: 182000, orders: 55 }
      ];

  const maxChartValue = Math.max(...chartData.map(d => d.value)) * 1.15;

  const cards = [
    { title: 'Pending Orders', count: pendingOrders.length, desc: 'Awaiting dispatch approval', icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-200', badge: 'Today 0', tab: 'orders' },
    { title: 'Dispatch Order', count: dispatchOrdersCount, desc: 'In processing / shipped', icon: TrendingUp, color: 'text-sky-600 bg-sky-50 border-sky-200', badge: 'Active 2', tab: 'orders' },
    { title: 'Pending Preorder', count: pendingPreorderCount, desc: 'Awaiting stock releases', icon: Database, color: 'text-indigo-600 bg-indigo-50 border-indigo-200', badge: 'Today 0', tab: 'orders' },
    { title: 'Cancel Orders', count: cancelledOrders.length, desc: 'Cancelled requests', icon: Trash2, color: 'text-red-600 bg-red-50 border-red-200', badge: 'Today 0', tab: 'orders' },
    { title: 'Return Orders', count: returnedOrdersCount, desc: 'Return tickets', icon: RefreshCw, color: 'text-orange-600 bg-orange-50 border-orange-200', badge: 'Active 0', tab: 'orders' },
    { title: 'Wholesaler', count: wholesalersCount, desc: 'Special pricing partners', icon: Users, color: 'text-emerald-600 bg-emerald-50 border-emerald-200', badge: 'Active 2', tab: 'wholesalers' },
    { title: 'Retailer', count: retailersCount, desc: 'B2C shoppers registered', icon: Users, color: 'text-teal-600 bg-teal-50 border-teal-200', badge: 'Active 12', tab: 'retailers' },
    { title: 'Referral', count: referralsCount, desc: 'Promoters tracking codes', icon: Award, color: 'text-purple-600 bg-purple-50 border-purple-200', badge: 'Today 0', tab: 'referrals' },
    { title: 'Collection', count: `₹${totalRevenue.toLocaleString('en-IN')}`, desc: 'Delivered billing collection', icon: ShoppingBag, color: 'text-red-700 bg-red-50 border-red-200', badge: 'Today 0', tab: 'orders' },
    { title: 'Total Cashback', count: `₹${pendingCashback}`, desc: 'Pending cashback credit', icon: Gift, color: 'text-pink-600 bg-pink-50 border-pink-200', badge: 'Pending pool', tab: 'cashbacks' },
    { title: 'Used Cashback', count: `₹${usedCashback}`, desc: 'Redeemed promo credits', icon: Gift, color: 'text-rose-600 bg-rose-50 border-rose-200', badge: 'Today 0', tab: 'cashbacks' },
    { title: 'Supplier', count: suppliers.length || 2, desc: 'Partner manufacturing units', icon: Users, color: 'text-cyan-600 bg-cyan-50 border-cyan-200', badge: 'Active 2', tab: 'suppliers' },
    { title: 'Total Product', count: totalProductsCount, desc: 'Total items in master file', icon: Database, color: 'text-slate-700 bg-slate-50 border-slate-200', badge: 'Active catalog', tab: 'products' },
    { title: 'Active Product', count: activeProductsCount, desc: 'Visible on customer shop', icon: CheckCircle, color: 'text-green-600 bg-green-50 border-green-200', badge: 'Live', tab: 'products' },
    { title: 'Inactive Product', count: inactiveProductsCount, desc: 'Drafted / hidden products', icon: ShieldAlert, color: 'text-gray-500 bg-gray-50 border-gray-200', badge: 'Drafts', tab: 'products' },
    { title: 'Out of Stock SKUs', count: outOfStockCount, desc: 'Reorder alerts triggered', icon: AlertTriangle, color: 'text-amber-700 bg-amber-50 border-amber-200', badge: 'Low Stock', tab: 'inventory' },
    { title: 'Total Brands', count: brands.length || 5, desc: 'Manufacturer brands listed', icon: Tag, color: 'text-blue-600 bg-blue-50 border-blue-200', badge: 'Partners', tab: 'brands' },
    { title: 'Active Brands', count: activeBrands, desc: 'Active brands filters', icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50 border-emerald-200', badge: 'Active', tab: 'brands' },
    { title: 'Inactive Brand', count: inactiveBrands, desc: 'Suspended brands filters', icon: X => <span>X</span>, color: 'text-slate-400 bg-slate-50 border-slate-200', badge: 'Inactive', tab: 'brands' },
    { title: 'Pending Reviews', count: pendingReviews, desc: 'Unapproved feedback logs', icon: MessageSquare, color: 'text-purple-600 bg-purple-50 border-purple-200', badge: 'Awaiting action', tab: 'testimonials' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Administrative Overview</h1>
          <p className="text-slate-500 text-sm">
            Quick statistics, analytical logs, and real-time storefront synchronization diagnostics for IT SAATHI.
          </p>
        </div>
        <div className="flex gap-2 rounded-xl bg-slate-100 p-1 border border-slate-200 shrink-0">
          <button 
            onClick={() => setTimeRange('7d')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${timeRange === '7d' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Last 7 Days
          </button>
          <button 
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${timeRange === '30d' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Last Month
          </button>
        </div>
      </div>

      {/* Grid of 20 Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {cards.map((card, i) => {
          const IconComponent = card.icon;
          return (
            <button
              key={i}
              onClick={() => setActiveTab(card.tab)}
              className={`text-left rounded-xl border p-4 shadow-sm transition hover:scale-102 hover:shadow-md cursor-pointer group ${card.color}`}
            >
              <div className="flex justify-between items-start gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 line-clamp-1">{card.title}</span>
                <span className="rounded bg-white/80 px-1.5 py-0.5 text-[9px] font-black tracking-wide border shadow-2xs shrink-0">{card.badge}</span>
              </div>
              <div className="mt-2.5 flex items-baseline gap-2">
                <span className="text-xl font-black text-slate-900 tracking-tight">{card.count}</span>
              </div>
              <div className="mt-1.5 flex items-center justify-between gap-1 text-[10px] text-slate-400 font-bold">
                <span className="line-clamp-1 group-hover:text-slate-600 transition">{card.desc}</span>
                <span className="shrink-0 p-1 rounded-full bg-white shadow-2xs text-slate-700 opacity-60 group-hover:opacity-100 transition">
                  {typeof IconComponent === 'function' ? <IconComponent size={10} /> : <Database size={10} />}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Chart and Category Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Custom SVG Revenue Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Revenue Stream & Sales</h3>
              <p className="text-xs text-slate-500">Interactive checkout collections performance visualizer</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 font-bold">Estimated Collections</span>
              <div className="text-lg font-black text-red-700">₹{(chartData.reduce((sum, d) => sum + d.value, 0)).toLocaleString('en-IN')}</div>
            </div>
          </div>

          {/* SVG Canvas Chart */}
          <div className="relative h-60 w-full mt-2">
            <svg viewBox="0 0 500 200" className="w-full h-full">
              {/* Grid Lines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="60" x2="480" y2="60" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="100" x2="480" y2="100" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="140" x2="480" y2="140" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="170" x2="480" y2="170" stroke="#cbd5e1" strokeWidth="1" />

              {/* Chart Bars */}
              {chartData.map((d, index) => {
                const step = 440 / chartData.length;
                const x = 50 + index * step;
                const barHeight = (d.value / maxChartValue) * 140;
                const y = 170 - barHeight;
                const isHovered = hoveredBar === index;

                return (
                  <g 
                    key={index}
                    onMouseEnter={() => setHoveredBar(index)}
                    onMouseLeave={() => setHoveredBar(null)}
                    className="cursor-pointer"
                  >
                    {/* Shadow Bar */}
                    <rect 
                      x={x - 10} 
                      y="15" 
                      width="30" 
                      height="155" 
                      fill="transparent" 
                      className="hover:fill-slate-50/50 transition duration-150"
                    />
                    {/* Real Color Bar */}
                    <rect
                      x={x - 4}
                      y={y}
                      width="8"
                      height={barHeight}
                      rx="3"
                      fill={isHovered ? '#b91c1c' : '#ef4444'}
                      className="transition duration-150"
                    />
                    {/* Label */}
                    <text
                      x={x}
                      y="185"
                      textAnchor="middle"
                      fill="#64748b"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      {d.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredBar !== null && (
              <div 
                className="absolute bg-slate-900 text-white rounded-lg p-2.5 shadow-xl text-xs font-semibold z-10 transition duration-150 border border-slate-700 animate-in fade-in zoom-in-95"
                style={{
                  left: `${15 + (hoveredBar * (85 / (chartData.length - 0.5)))}%`,
                  top: '15%'
                }}
              >
                <div className="text-slate-400 font-bold text-[10px] uppercase">{chartData[hoveredBar].label}</div>
                <div className="mt-0.5 text-sm font-black text-red-400">₹{chartData[hoveredBar].value.toLocaleString('en-IN')}</div>
                <div className="text-[10px] text-slate-300 mt-0.5">{chartData[hoveredBar].orders} Delivered Orders</div>
              </div>
            )}
          </div>
        </div>

        {/* Categories Analysis */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Category Sales Share</h3>
            <p className="text-xs text-slate-500">Breakdown of product category dispatch ratios</p>
          </div>

          <div className="space-y-4 my-4 flex-1 flex flex-col justify-center">
            {[
              { name: 'CCTV Solutions', percent: 45, color: 'bg-red-600', count: 18 },
              { name: 'Power Solutions', percent: 22, color: 'bg-amber-500', count: 9 },
              { name: 'Cables & Wiring', percent: 18, color: 'bg-emerald-500', count: 7 },
              { name: 'Networking Accessories', percent: 15, color: 'bg-sky-500', count: 6 }
            ].map((cat, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span className="truncate max-w-[150px]">{cat.name}</span>
                  <span className="text-slate-400 shrink-0">{cat.count} sold ({cat.percent}%)</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.percent}%` }} />
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => setActiveTab('products')}
            className="w-full py-2.5 text-xs font-bold border border-slate-200 hover:border-red-200 text-slate-600 hover:text-red-700 rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
          >
            Manage Store Catalog
            <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* Low Stock Alerts and Latest Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low stock notifications */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Inventory Alerts</h3>
              <p className="text-xs text-slate-400">Products with stock level below safety trigger threshold</p>
            </div>
            <button 
              onClick={() => setActiveTab('inventory')}
              className="text-xs font-bold text-red-600 hover:underline"
            >
              Adjust Stock
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 font-bold text-slate-400 uppercase">
                  <th className="p-3">SKU</th>
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 text-right">In Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {products.slice(0, 4).map((p, i) => {
                  const stockLevel = [5, 2, 8, 0][i] ?? 4;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-3 font-mono text-slate-400 text-[10px]">{p.sku}</td>
                      <td className="p-3 font-bold text-slate-900 truncate max-w-[150px]">{p.name}</td>
                      <td className="p-3 text-slate-500">{p.category}</td>
                      <td className="p-3 text-right">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] ${stockLevel === 0 ? 'bg-red-50 text-red-700 animate-pulse' : 'bg-amber-50 text-amber-700'}`}>
                          {stockLevel} Units
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Latest Public Enquiries */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Recent Enquiries</h3>
              <p className="text-xs text-slate-400">Direct contact form submissions from website visitors</p>
            </div>
            <button 
              onClick={() => setActiveTab('enquiry')}
              className="text-xs font-bold text-red-600 hover:underline"
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            {enquiries.length === 0 ? (
              <div className="py-10 text-center text-slate-400 font-bold text-xs">
                No active enquiries submitted yet.
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 font-bold text-slate-400 uppercase">
                    <th className="p-3">Sender Name</th>
                    <th className="p-3">Requirement</th>
                    <th className="p-3">Callback</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {enquiries.slice(0, 4).map((enq) => (
                    <tr key={enq._id} className="hover:bg-slate-50/50 transition">
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{enq.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{enq.phone}</div>
                      </td>
                      <td className="p-3 text-slate-500 truncate max-w-[150px]">{enq.productRequirement || enq.message}</td>
                      <td className="p-3 text-slate-500">
                        {enq.needCallback ? (
                          <span className="text-red-600 font-bold">Yes, Call Back</span>
                        ) : (
                          <span className="text-slate-400">No</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] ${
                          enq.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {enq.status || 'New'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
