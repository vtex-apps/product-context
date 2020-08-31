import { useContext } from 'react'

import { ProductDispatchContext } from './ProductDispatchContext'

/**
 * useProductDispatch hook. Use this hook to make changes to the data from the nearest
 * `ProductContext`.
 *
 * @returns `dispatch` function | `null`.
 */
function useProductDispatch() {
  return useContext(ProductDispatchContext)
}

export default useProductDispatch
