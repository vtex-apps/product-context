import type { FC, Dispatch } from 'react'
import React, { useRef, useContext, useEffect } from 'react'
import { useRuntime } from 'vtex.render-runtime'

import ProductContext from './ProductContext'
import { ProductDispatchContext } from './ProductDispatchContext'
import { useProductReducer } from './reducer'
import type { MaybeProduct, Item } from './ProductTypes'

export interface ProductAndQuery {
  query: Record<string, any>
  product: MaybeProduct
}

type GroupId = string

export interface AssemblyOptionItem {
  id: string
  quantity: number
  seller: string
  initialQuantity: number
  choiceType: string
  name: string
  price: number
  children: Record<string, AssemblyOptionItem[]> | null
}

export interface BuyButtonContextState {
  clicked: boolean
}

export interface SkuSelectorContextState {
  selectedImageVariationSKU: string | null
  isVisible: boolean
  areAllVariationsSelected: boolean
}

export interface ProductContextState {
  loadingItem: boolean
  selectedItem?: Item | null
  product: MaybeProduct
  selectedQuantity: number
  skuSelector: Partial<SkuSelectorContextState>
  buyButton: BuyButtonContextState
  assemblyOptions: {
    items: Record<GroupId, AssemblyOptionItem[]>
    inputValues: Record<GroupId, InputValues>
    areGroupsValid: Record<GroupId, boolean>
  }
}

type InputValues = Record<string, string>

type Action<K, V = void> = V extends void ? { type: K } : { type: K } & V

export type Actions =
  | Action<
      'SELECT_IMAGE_VARIATION',
      { args: { selectedImageVariationSKU: string | null } }
    >
  | Action<'SET_QUANTITY', { args: { quantity: number } }>
  | Action<
      'SKU_SELECTOR_SET_VARIATIONS_SELECTED',
      { args: { allSelected: boolean } }
    >
  | Action<'SET_BUY_BUTTON_CLICKED', { args: { clicked: boolean } }>
  | Action<'SKU_SELECTOR_SET_IS_VISIBLE', { args: { isVisible: boolean } }>
  | Action<'SET_SELECTED_ITEM', { args: { item: Item | undefined | null } }>
  | Action<
      'SET_ASSEMBLY_OPTIONS',
      {
        args: {
          groupId: string
          groupItems: AssemblyOptionItem[]
          groupInputValues: InputValues
          isValid: boolean
        }
      }
    >
  | Action<'SET_PRODUCT', { args: { product: MaybeProduct } }>
  | Action<'SET_LOADING_ITEM', { args: { loadingItem: boolean } }>
  | Action<'SET_SELECTED_SKUID', { args: { skuId: string } }>

function useProductInState(product: MaybeProduct, dispatch: Dispatch<Actions>) {
  useEffect(() => {
    if (product) {
      dispatch({
        type: 'SET_PRODUCT',
        args: { product },
      })
    }
  }, [product, dispatch])
}

const useUpdateQueryBySKU = ({
  skuId,
  dispatch,
  isRoot,
}: {
  skuId: string
  dispatch: Dispatch<Actions>
  isRoot: boolean
}) => {
  const skipOnMountRef = useRef(true)
  const { setQuery } = useRuntime()

  useEffect(() => {
    if (!isRoot || skipOnMountRef.current) {
      skipOnMountRef.current = false

      return
    }

    dispatch({
      type: 'SET_LOADING_ITEM',
      args: { loadingItem: false },
    })
    setQuery({ skuId }, { replace: true })
  }, [skuId, isRoot, setQuery, dispatch])
}

const ProductContextProvider: FC<ProductAndQuery> = ({
  query,
  product,
  children,
}) => {
  const [state, dispatch] = useProductReducer({ query, product })

  // This is a hack to know if this is the root ProductContextProvider
  const ctx = useContext(ProductContext)
  const isRoot = JSON.stringify(ctx) === JSON.stringify({})

  // These hooks are used to keep the state in sync with API data, specially when switching between products without exiting the product page
  useProductInState(product, dispatch)

  useUpdateQueryBySKU({
    skuId: state.selectedItem?.itemId ?? '',
    isRoot,
    dispatch,
  })

  return (
    <ProductContext.Provider value={state}>
      <ProductDispatchContext.Provider value={dispatch}>
        {children}
      </ProductDispatchContext.Provider>
    </ProductContext.Provider>
  )
}

export default ProductContextProvider
