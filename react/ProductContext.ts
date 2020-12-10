import { createContext } from 'react'

import type { ProductContextState } from './ProductContextProvider'

const ProductContext = createContext<Partial<ProductContextState> | undefined>(
  {}
)

export default ProductContext
