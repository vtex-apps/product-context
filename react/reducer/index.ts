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

      // Clear the pin whenever it disagrees with the incoming item — that is
      // the only condition that matters, and it already covers every case:
      //
      // - Selecting an image variation dispatches SELECT_IMAGE_VARIATION and
      //   only then redirects, which lands here with that same SKU, so the
      //   pin already equals the incoming item and is correctly left alone.
      // - The provider re-dispatches this action whenever the product object
      //   identity changes, with the item unchanged; if the pin still equals
      //   that item, it's correctly left alone too.
      // - Picking a colour while another variation is still unselected
      //   redirects with a cleared skuId and lands on the query-string
      //   fallback item (the first available item in the catalog) — which
      //   must clear the pin like any other mismatch, even when that
      //   fallback happens to equal the item the shopper started from (this
      //   is the common case: landing on a PDP with no `skuId` in the URL at
      //   all resolves to the same fallback item). An earlier version of
      //   this guard also required `args.item?.itemId !==
      //   state.selectedItem?.itemId` ("itemChanged"), which was meant to
      //   protect the same-item-re-dispatch case above, but that case is
      //   already covered by the pin equalling the item — the extra
      //   condition only ever did something in this fallback-to-same-item
      //   case, where it wrongly suppressed the clear (see
      //   https://github.com/vtex-apps/product-context/pull/88): the gallery
      //   must always match `selectedItem`, even when `selectedItem` itself
      //   is just a fallback the shopper never explicitly chose.
      const pointsToAnotherItem =
        selectedImageVariationSKU != null &&
        selectedImageVariationSKU !== args.item?.itemId

      return {
        ...state,
        loadingItem: false,
        selectedItem: args.item,
        ...(pointsToAnotherItem
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
