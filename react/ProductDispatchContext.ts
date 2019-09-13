import { createContext, useContext, Dispatch } from 'react'

// type DispatchFn =

export const ProductDispatchContext = createContext<Dispatch<Actions> | null>(
  null
)
function useProductDispatch() {
  return useContext(ProductDispatchContext)
}
export default { ProductDispatchContext, useProductDispatch }
