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

      // Both guards are required. Selecting an image variation dispatches
      // SELECT_IMAGE_VARIATION and only then redirects, which lands here with
      // that same SKU, so clearing on equality would undo it. And the provider
      // re-dispatches this action whenever the product object identity changes,
      // with the item unchanged, which must not drop a valid selection either.
      //
      // This also clears the pin when the incoming item is a query-string
      // fallback (e.g. picking a colour while another variation is still
      // unselected clears `skuId` and lands on the first available item) —
      // considered and deliberately rejected an exception for that case
      // (see https://github.com/vtex-apps/product-context/pull/88): the
      // gallery must always match `selectedItem`, even when `selectedItem`
      // itself is just a fallback the shopper never explicitly chose.
      const itemChanged = args.item?.itemId !== state.selectedItem?.itemId
      const pointsToAnotherItem =
        selectedImageVariationSKU != null &&
        selectedImageVariationSKU !== args.item?.itemId

      return {
        ...state,
        loadingItem: false,
        selectedItem: args.item,
        ...(itemChanged && pointsToAnotherItem
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

export function getSelectedItem(skuId: string | undefined, items: Item[]) {
  return skuId
    ? items.find((item) => item.itemId === skuId)
    : items.find(findAvailableProduct) ?? items[0]
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
