import { createContext, useContext, useMemo, useState, useEffect } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('itsaathi_cart')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem('itsaathi_cart', JSON.stringify(cartItems))
    } catch (e) {
      console.error('Failed to save cart', e)
    }
  }, [cartItems])

  const addToCart = (product, quantity = 1, openCartDrawer = false) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.slug === product.slug)

      if (existing) {
        return prev.map((item) =>
          item.slug === product.slug ? { ...item, qty: item.qty + quantity } : item
        )
      }

      return [...prev, { ...product, qty: quantity }]
    })

    if (openCartDrawer) {
      setIsDrawerOpen(true)
    }
  }

  const removeFromCart = (slug) => {
    setCartItems((prev) => prev.filter((item) => item.slug !== slug))
  }

  const updateQty = (slug, qty) => {
    if (qty <= 0) {
      removeFromCart(slug)
      return
    }
    setCartItems((prev) =>
      prev.map((item) => (item.slug === slug ? { ...item, qty } : item))
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.qty, 0),
    [cartItems]
  )

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + (Number(item.price) || 0) * item.qty, 0),
    [cartItems]
  )

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        cartCount,
        subtotal,
        isDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
        toggleDrawer: () => setIsDrawerOpen((prev) => !prev),
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
