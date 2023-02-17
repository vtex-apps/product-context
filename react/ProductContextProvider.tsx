import type { Dispatch, FC } from 'react'
import React, { useEffect } from 'react'

import ProductContext from './ProductContext'
import { ProductDispatchContext } from './ProductDispatchContext'
import { getSelectedItem, useProductReducer } from './reducer'
import { getSelectedSKUFromQueryString } from './modules/skuQueryString'
import type { Item, MaybeProduct } from './ProductTypes'

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

function getDefaultSellerByFacets(): string | null {
  const { facets } = JSON.parse(
    Buffer.from(window.__RUNTIME__.segmentToken, 'base64').toString('binary')
  )

  if (facets) {
    const facetsList = facets.split(';')
    const sellerFacet = facetsList.find((facet: string) =>
      facet.includes('private-seller')
    )

    return sellerFacet?.split('=')[1]
  }

  return null
}

function setDefaultSellerToProductItems(
  product: MaybeProduct,
  defaultSeller: string
): MaybeProduct {
  const newItems = product?.items?.map((item) => {
    return {
      ...item,
      sellers: item?.sellers?.map((seller) => ({
        ...seller,
        sellerDefault: seller?.sellerId === defaultSeller,
      })),
    }
  })

  return {
    ...product,
    ...(newItems ? { items: newItems } : {}),
  } as MaybeProduct
}

const ProductContextProvider: FC<ProductAndQuery> = ({
  query,
  product,
  children,
}) => {
  const seller = getDefaultSellerByFacets()
  const currentProduct =
    product && seller
      ? (setDefaultSellerToProductItems(product, seller) as MaybeProduct)
      : product

  const [state, dispatch] = useProductReducer({
    query,
    product: currentProduct,
  })

  // These hooks are used to keep the state in sync with API data, specially when switching between products without exiting the product page
  useProductInState(currentProduct, dispatch)
  const selectedSkuQueryString = getSelectedSKUFromQueryString(
    query,
    currentProduct?.items
  )

  useSelectedItemFromId(dispatch, currentProduct, selectedSkuQueryString)

  return (
    <ProductContext.Provider value={state}>
      <ProductDispatchContext.Provider value={dispatch}>
        {children}
      </ProductDispatchContext.Provider>
    </ProductContext.Provider>
  )
}

export default ProductContextProvider
