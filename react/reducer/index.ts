import { useReducer } from 'react'

import { getSelectedSKUFromQueryString } from '../modules/skuQueryString'
import { findAvailableProduct } from '../modules/items'
import type { Item } from '../ProductTypes'
import type {
  ProductContextState,
  Actions,
  ProductAndQuery,
} from '../ProductContextProvider'

const defaultState: ProductContextState = {
  loadingItem: false,
  product: undefined,
  selectedItem: null,
  selectedQuantity: 1,
  skuSelector: {
    selectedImageVariationSKU: null,
    isVisible: false,
    areAllVariationsSelected: true,
  },
  buyButton: {
    clicked: false,
  },
  assemblyOptions: {
    items: {},
    inputValues: {},
    areGroupsValid: {},
  },
}

export function reducer(
  state: ProductContextState,
  action: Actions
): ProductContextState {
  switch (action.type) {
    case 'SET_QUANTITY': {
      const args = action.args || {}

      return {
        ...state,
        selectedQuantity: args.quantity,
      }
    }

    case 'SELECT_IMAGE_VARIATION': {
      const args = action.args || {}

      return {
        ...state,
        skuSelector: {
          ...state.skuSelector,
          selectedImageVariationSKU: args.selectedImageVariationSKU,
        },
      }
    }

    case 'SKU_SELECTOR_SET_VARIATIONS_SELECTED': {
      const args = action.args || {}

      return {
        ...state,
        skuSelector: {
          ...state.skuSelector,
          areAllVariationsSelected: args.allSelected,
        },
      }
    }

    case 'SET_BUY_BUTTON_CLICKED': {
      const args = action.args || {}

      return {
        ...state,
        buyButton: {
          ...state.buyButton,
          clicked: args.clicked,
        },
      }
    }

    case 'SKU_SELECTOR_SET_IS_VISIBLE': {
      const args = action.args || {}

      return {
        ...state,
        skuSelector: {
          ...state.skuSelector,
          isVisible: args.isVisible,
        },
      }
    }

    case 'SET_SELECTED_ITEM': {
      const args = action.args || {}
      const { selectedImageVariationSKU } = state.skuSelector

      // ProductImages prefers `selectedImageVariationSKU` over `selectedItem`.
      // Drop a pin that no longer matches the resolved SKU so the gallery follows
      // the same item as price and buy (KI 669619).
      const pinDisagreesWithItem =
        selectedImageVariationSKU != null &&
        selectedImageVariationSKU !== args.item?.itemId

      return {
        ...state,
        loadingItem: false,
        selectedItem: args.item,
        ...(pinDisagreesWithItem
          ? {
              skuSelector: {
                ...state.skuSelector,
                selectedImageVariationSKU: null,
              },
            }
          : {}),
      }
    }

    case 'SET_LOADING_ITEM': {
      return {
        ...state,
        loadingItem: Boolean(action.args.loadingItem),
      }
    }

    case 'SET_ASSEMBLY_OPTIONS': {
      const {
        groupId = '',
        groupItems = [],
        groupInputValues = {},
        isValid = false,
      } = action.args || {}

      return {
        ...state,
        assemblyOptions: {
          ...state.assemblyOptions,
          inputValues: {
            ...state.assemblyOptions.inputValues,
            [groupId]: groupInputValues,
          },
          items: {
            ...state.assemblyOptions.items,
            [groupId]: groupItems,
          },
          areGroupsValid: {
            ...state.assemblyOptions.areGroupsValid,
            [groupId]: isValid,
          },
        },
      }
    }

    case 'SET_PRODUCT': {
      const args = action.args || {}
      const differentSlug = state?.product?.linkText !== args?.product?.linkText

      return {
        ...state,
        ...(differentSlug ? defaultState : {}),
        product: args.product,
      }
    }

    default:
      return state
  }
}

export function getSelectedItem(
  skuId: string | undefined,
  items: Item[],
  imageVariationSKU?: string | null
) {
  if (skuId) {
    return items.find((item) => item.itemId === skuId)
  }

  const pinnedItem = imageVariationSKU
    ? items.find((item) => item.itemId === imageVariationSKU)
    : undefined

  return pinnedItem ?? items.find(findAvailableProduct) ?? items[0]
}

function initReducer({ query, product }: ProductAndQuery) {
  const items = product?.items ?? []

  return {
    ...defaultState,
    selectedItem: getSelectedItem(
      getSelectedSKUFromQueryString(query, items),
      items
    ),
    product,
  }
}

export const useProductReducer = ({ query, product }: ProductAndQuery) =>
  useReducer(reducer, { query, product }, initReducer)
