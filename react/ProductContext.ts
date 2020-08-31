import { createContext } from 'react'

import { ProductContextState } from './ProductContextProvider'

const productContext = createContext<Partial<ProductContextState> | undefined>(
  {}
)

export default productContext
