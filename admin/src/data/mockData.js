export const defaultStaff = [
  { id: 'STF01', name: 'Adarsh Jain', email: 'adarsh@itsaathi.in', phone: '+91 80060 33345', role: 'admin', status: 'Active' },
  { id: 'STF02', name: 'Manoj Kumar', email: 'manoj@itsaathi.in', phone: '+91 98765 43210', role: 'manager', status: 'Active' },
  { id: 'STF03', name: 'Amit Singh', email: 'amit@itsaathi.in', phone: '+91 99112 23344', role: 'staff', status: 'Active' },
  { id: 'STF04', name: 'Rajesh Sharma', email: 'rajesh@itsaathi.in', phone: '+91 98123 45678', role: 'staff', status: 'Suspended' }
];

export const defaultCategories = [
  { id: 'CAT01', name: 'CCTV Solutions', displayOrder: 1, status: 'Active', count: 12 },
  { id: 'CAT02', name: 'Networking Accessories', displayOrder: 2, status: 'Active', count: 18 },
  { id: 'CAT03', name: 'Computer Essentials', displayOrder: 3, status: 'Active', count: 24 },
  { id: 'CAT04', name: 'Storage Devices', displayOrder: 4, status: 'Active', count: 15 },
  { id: 'CAT05', name: 'Power Solutions', displayOrder: 5, status: 'Active', count: 10 },
  { id: 'CAT06', name: 'Cables Range', displayOrder: 6, status: 'Active', count: 22 }
];

export const defaultBrands = [
  { id: 'BRD01', name: 'Hikvision', status: 'Active', slug: 'hikvision', desc: 'World leader in surveillance products' },
  { id: 'BRD02', name: 'CP PLUS', status: 'Active', slug: 'cp-plus', desc: 'Leading Indian security brand' },
  { id: 'BRD03', name: 'Dahua', status: 'Active', slug: 'dahua', desc: 'Advanced camera systems' },
  { id: 'BRD04', name: 'TP-Link', status: 'Active', slug: 'tp-link', desc: 'Reliable networking routers and switches' },
  { id: 'BRD05', name: 'Western Digital', status: 'Active', slug: 'western-digital', desc: 'Surveillance purple hard drives' }
];

export const defaultCoupons = [
  { id: 'CPN01', code: 'ITSAATHI10', discountType: 'percentage', discountAmount: 10, minPurchase: 500, maxUsage: 100, usageCount: 24, status: 'Active' },
  { id: 'CPN02', code: 'SECURE20', discountType: 'percentage', discountAmount: 20, minPurchase: 2000, maxUsage: 50, usageCount: 12, status: 'Active' },
  { id: 'CPN03', code: 'B2BFLAT500', discountType: 'flat', discountAmount: 500, minPurchase: 10000, maxUsage: 20, usageCount: 5, status: 'Active' }
];

export const defaultBanners = [
  { id: 'BNR01', title: 'Smart CCTV Security Systems', image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800', priority: 1, status: 'Active', link: '/shop?category=CCTV%20Solutions' },
  { id: 'BNR02', title: 'High-Speed Networking Solutions', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800', priority: 2, status: 'Active', link: '/shop?category=Networking%20Accessories' }
];

export const defaultBlogs = [
  { id: 'BLG01', title: 'How to Choose the Right Security Camera for Your Shop', summary: 'Understanding dome vs bullet cameras, resolutions, night vision, and storage capacity.', author: 'Adarsh Jain', date: 'July 15, 2026', views: 342, image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400' },
  { id: 'BLG02', title: 'Set Up High-Speed Office Wi-Fi: Step by Step', summary: 'Best practices for placing routers, configuring switches, and security keys.', author: 'Manoj Kumar', date: 'July 19, 2026', views: 184, image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400' }
];

export const defaultFaqs = [
  { id: 'FAQ01', question: 'Do you offer installation services for CCTV security systems?', answer: 'Yes, we provide full technical consultation and on-site physical camera installation services in selected regions. Please contact support to schedule an installation visit.' },
  { id: 'FAQ02', question: 'Do your power adaptors carry warranty?', answer: 'Our professional-grade heavy adapters are backed by a standard 1-year product replacement warranty against manufacturing faults.' },
  { id: 'FAQ03', question: 'How can I apply for wholesale partnership pricing?', answer: 'Wholesale operators or local resellers can register their basic details and submit their GSTIN certs in the customer dashboard to be approved for wholesale special price catalogs.' }
];

export const defaultTestimonials = [
  { id: 'REV01', reviewer: 'Shivam Gupta (Delhi Electronics)', rating: 5, review: 'We have been procuring cables and CP PLUS cameras from IT SAATHI for 2 years. Perfect pricing and unmatched service quality!', status: 'Approved', product: 'CP PLUS 2MP Camera' },
  { id: 'REV02', reviewer: 'Rajiv Sharma', rating: 4, review: 'High performance power supply modules. Installed on 16-channel systems, working flawlessly without dropouts.', status: 'Approved', product: '12V Power Supply' },
  { id: 'REV03', reviewer: 'Ankur Yadav', rating: 5, review: 'Awesome customer care call-backs. They guided me precisely on selecting the compatible gigabit switches.', status: 'Pending', product: 'TP-Link 8-Port Switch' }
];

export const defaultSuppliers = [
  { id: 'SPL01', name: 'Sunshine Electronics Dist', contact: 'Ramesh Patel', phone: '+91 99887 76655', address: 'Nehru Place, New Delhi', balance: 45000, status: 'Active' },
  { id: 'SPL02', name: 'Metro IT Accessories Ltd', contact: 'Sunita Roy', phone: '+91 98877 66554', address: 'Lamington Road, Mumbai', balance: 0, status: 'Active' }
];

export const defaultLogistics = [
  { id: 'LGT01', partner: 'Delhivery Express', rate: 49, status: 'Active', estDays: '2-4 Days' },
  { id: 'LGT02', partner: 'Blue Dart Premium', rate: 149, status: 'Active', estDays: '1-2 Days' },
  { id: 'LGT03', partner: 'Local Store Pick-Up', rate: 0, status: 'Active', estDays: 'Same Day' }
];

export const initialApps = [
  { id: 'APP01', name: 'WhatsApp Live Chat Widget', category: 'Support & Chat', icon: 'MessageSquare', status: 'Active', desc: 'Allows customers to chat directly with IT SAATHI support desk.' },
  { id: 'APP02', name: 'Razorpay Payment Gateway', category: 'Payments', icon: 'ShieldAlert', status: 'Active', desc: 'Enables quick online checkouts via Cards, UPI, Netbanking, and Wallets.' },
  { id: 'APP03', name: 'Shiprocket Delivery Integration', category: 'Logistics', icon: 'Truck', status: 'Inactive', desc: 'Sync tracking numbers automatically with major Indian shipping companies.' },
  { id: 'APP04', name: 'Twilio OTP SMS Verifier', category: 'Security', icon: 'Bell', status: 'Inactive', desc: 'Verify customer phone registration with standard OTP verification codes.' }
];

export const initialInventoryAdjustments = [
  { id: 'ADJ01', productSku: 'SKU-ITSAATHI-10002', productName: 'ADAPTOR 12 VOLT 1.5AMP (HEAVY)', type: 'Inward', qty: 100, comment: 'Received container shipment from Sunshine Electronics', operator: 'Rajesh Sharma', date: '2026-07-20T10:30:00.000Z' },
  { id: 'ADJ02', productSku: 'SKU-ITSAATHI-10003', productName: 'ADAPTOR 12 VOLT 2AMP (HEAVY)', type: 'Outward', qty: 15, comment: 'Direct wholesale counter sale - cash paid', operator: 'Manoj Kumar', date: '2026-07-21T09:15:00.000Z' }
];

export const initialSystemLogs = [
  { id: 'LOG01', user: 'Adarsh Jain', type: 'Auth', module: 'System', details: 'Successful operator login from IP 103.24.45.18', date: '2026-07-21T08:00:00.000Z' },
  { id: 'LOG02', user: 'Manoj Kumar', type: 'Edit', module: 'Products', details: 'Associated image link for CCTV Dome Camera slug', date: '2026-07-21T09:20:00.000Z' },
  { id: 'LOG03', user: 'Adarsh Jain', type: 'Config', module: 'Settings', details: 'Updated low-stock global notification limit to 10 units', date: '2026-07-21T11:45:00.000Z' }
];
