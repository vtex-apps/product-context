import React, { FC, useEffect, Dispatch } from 'react'

import ProductContext from './ProductContext'
import { ProductDispatchContext } from './ProductDispatchContext'
import { useProductReducer, getSelectedItem } from './reducer'
import { getSelectedSKUFromQueryString } from './modules/skuQueryString'
import { MaybeProduct, Item } from './ProductTypes'

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

export interface ProductContextState {
  selectedItem?: Item | null
  product: MaybeProduct
  selectedQuantity: number
  skuSelector: {
    selectedImageVariationSKU: string | null
    isVisible: boolean
    areAllVariationsSelected: boolean
  }
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

function useSelectedItemFromId(
  dispatch: Dispatch<Actions>,
  product: MaybeProduct,
  skuId?: string
) {
  useEffect(() => {
    const items = product?.items ?? []

    dispatch({
      type: 'SET_SELECTED_ITEM',
      args: { item: getSelectedItem(skuId, items) },
    })
  }, [dispatch, skuId, product])
}

const ProductContextProvider: FC<ProductAndQuery> = ({
  query,
  product,
  children,
}) => {
  const [state, dispatch] = useProductReducer({ query, product })

  // These hooks are used to keep the state in sync with API data, specially when switching between products without exiting the product page
  useProductInState(product, dispatch)
  const selectedSkuQueryString = getSelectedSKUFromQueryString(
    query,
    product?.items
  )

  useSelectedItemFromId(dispatch, product, selectedSkuQueryString)

  return (
    <ProductContext.Provider value={state}>
      <ProductDispatchContext.Provider value={dispatch}>
        {children}
      </ProductDispatchContext.Provider>
    </ProductContext.Provider>
  )
}

export default ProductContextProvider
