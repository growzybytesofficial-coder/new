import { createContext, useContext, useState, useEffect } from 'react'

const ProductImageContext = createContext(null)

export function ProductImageProvider({ children }) {
  const [productImages, setProductImages] = useState({})

  const fetchProductImages = async () => {
    try {
      const response = await fetch('/api/products/images')
      const data = await response.json()
      if (data.success && data.images) {
        setProductImages(data.images)
      }
    } catch (err) {
      console.error('Error fetching product images:', err)
    }
  }

  useEffect(() => {
    fetchProductImages()
  }, [])

  return (
    <ProductImageContext.Provider value={{ productImages, fetchProductImages }}>
      {children}
    </ProductImageContext.Provider>
  )
}

export function useProductImages() {
  const context = useContext(ProductImageContext)
  if (!context) {
    return { productImages: {}, fetchProductImages: () => {} }
  }
  return context;
}
