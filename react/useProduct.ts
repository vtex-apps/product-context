import { useContext } from 'react'

import ProductContext from './ProductContext'

/**
 * useProduct hook. Use this hook to access the data from the nearest
 * `ProductContext`.
 *
 * Be aware that this could be an empty Object if used outside of a
 * `ProductContextProvider`.
 *
 * @returns `ProductContextState` | `undefined` | `{}`
 */
function useProduct() {
  return useContext(ProductContext)
}

export default useProduct
