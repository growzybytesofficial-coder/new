import { createContext, useContext, useMemo, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.slug === product.slug)

      if (existing) {
        return prev.map((item) =>
          item.slug === product.slug ? { ...item, qty: item.qty + 1 } : item
        )
      }

      return [...prev, { ...product, qty: 1 }]
    })
  }

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.qty, 0),
    [cartItems]
  )

  return (
    <CartContext.Provider value={{ cartItems, addToCart, cartCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}