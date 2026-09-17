import { createContext, useContext, useState, useEffect } from 'react'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('itsaathi_wishlist')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('itsaathi_wishlist', JSON.stringify(wishlist))
    } catch (e) {
      console.error('Failed to save wishlist', e)
    }
  }, [wishlist])

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.slug === product.slug)
      if (exists) {
        return prev.filter((item) => item.slug !== product.slug)
      } else {
        return [...prev, product]
      }
    })
  }

  const isInWishlist = (slug) => {
    return wishlist.some((item) => item.slug === slug)
  }

  const removeFromWishlist = (slug) => {
    setWishlist((prev) => prev.filter((item) => item.slug !== slug))
  }

  const clearWishlist = () => {
    setWishlist([])
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        clearWishlist,
        wishlistCount: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider')
  }
  return context
}
