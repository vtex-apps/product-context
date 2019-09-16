import { useReducer } from 'react'
import { path, find, propEq, compose, flip, gt, pathOr } from 'ramda'

const defaultState = {
  selectedItem: null,
  selectedQuantity: 1,
  skuSelector: {
    isVisible: false,
    areAllVariationsSelected: true,
  },
  assemblyOptions: {
    items: {},
    areGroupsValid: {},
  },
}

function reducer(
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
      return {
        ...state,
        selectedItem: args.item,
      }
    }
    case 'SET_ASSEMBLY_OPTIONS': {
      const { groupId='', groupItems=[], isValid=false } = action.args || {}
      return {
        ...state,
        assemblyOptions: {
          ...state.assemblyOptions,
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
      const differentSlug =
        path(['product', 'linkText'], state) !==
        path(['product', 'linkText'], args)
      return {
        ...state,
        product: args.product,
        ...(differentSlug ? defaultState : {}),
      }
    }
    default:
      return state
  }
}

const isSkuAvailable = compose<Seller, number, boolean>(
  flip(gt)(0),
  pathOr(0, ['commertialOffer', 'AvailableQuantity'])
)

const findItemById = (id: string) => find<Item>(propEq<string>('itemId', id))
function findAvailableProduct(item: Item) {
  return item.sellers.find(isSkuAvailable)
}

export function getSelectedItem(skuId: string | undefined, items: Item[]) {
  return skuId
    ? findItemById(skuId)(items)
    : items.find(findAvailableProduct) || items[0]
}

function initReducer({ query, product }: ProductAndQuery) {
  const items = (product && product.items) || []
  return {
    ...defaultState,
    selectedItem: getSelectedItem(query.skuId, items),
    product,
  }
}

export const useProductReducer = ({ query, product }: ProductAndQuery) =>
  useReducer(reducer, { query, product }, initReducer)
