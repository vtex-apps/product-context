import { createContext, useContext } from 'react'

const ProductDispatchContext = createContext({})
function useProductDispatch() {
  return useContext(ProductDispatchContext)
}
export default { ProductDispatchContext, useProductDispatch }
