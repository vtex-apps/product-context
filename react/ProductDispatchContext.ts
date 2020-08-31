import { createContext, Dispatch } from 'react'

import { Actions } from './ProductContextProvider'
import useProductDispatch from './useProductDispatch'

export const ProductDispatchContext = createContext<Dispatch<Actions> | null>(
  null
)

export default { ProductDispatchContext, useProductDispatch }
