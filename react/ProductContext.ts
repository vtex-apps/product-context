import { createContext } from 'react'

import { ProductContextState } from './ProductContextProvider'

const ProductContext = createContext<Partial<ProductContextState> | undefined>(
  {}
)

export default ProductContext
