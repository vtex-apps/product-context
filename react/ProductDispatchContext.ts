import { createContext, useContext } from 'react'

const ProductDispatchContext = createContext(null)
function useProductDispatch() {
  return useContext(ProductDispatchContext)
}
export default { ProductDispatchContext, useProductDispatch }
