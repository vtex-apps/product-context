import { createContext, useContext, Dispatch } from 'react'

import { Actions } from './ProductContextProvider'

export const ProductDispatchContext = createContext<Dispatch<Actions> | null>(
  null
)

function useProductDispatch() {
  return useContext(ProductDispatchContext)
}

export default { ProductDispatchContext, useProductDispatch }
