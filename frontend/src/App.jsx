import { HashRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import ProductDetails from './pages/ProductDetails.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Cart from './pages/Cart.jsx'
import Account from './pages/Account.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { WishlistProvider } from './context/WishlistContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { ProductImageProvider } from './context/ProductImageContext.jsx'

export default function App() {
  return (
    <ProductImageProvider>
      <WishlistProvider>
        <CartProvider>
          <ToastProvider>
            <HashRouter>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="shop" element={<Shop />} />
                  <Route path="product/:slug" element={<ProductDetails />} />
                  <Route path="about" element={<About />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="account" element={<Account />} />
                </Route>
              </Routes>
            </HashRouter>
          </ToastProvider>
        </CartProvider>
      </WishlistProvider>
    </ProductImageProvider>
  )
}

