/* eslint-env jest */
import { reducer } from '../reducer'
import type { ProductContextState } from '../ProductContextProvider'
import { getItem } from '../__mocks__/productMock'

const baseState: ProductContextState = {
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

describe('reducer', () => {
  it('syncs selectedImageVariationSKU when SET_SELECTED_ITEM changes the SKU', () => {
    const itemOne = getItem('1')
    const itemTwo = getItem('2')

    const withFirstItem = reducer(baseState, {
      type: 'SET_SELECTED_ITEM',
      args: { item: itemOne },
    })

    expect(withFirstItem.selectedItem).toBe(itemOne)
    expect(withFirstItem.skuSelector.selectedImageVariationSKU).toBe('1')

    const withSecondItem = reducer(withFirstItem, {
      type: 'SET_SELECTED_ITEM',
      args: { item: itemTwo },
    })

    expect(withSecondItem.selectedItem).toBe(itemTwo)
    expect(withSecondItem.skuSelector.selectedImageVariationSKU).toBe('2')
  })

  it('clears a stale selectedImageVariationSKU when the selected item changes', () => {
    const staleState: ProductContextState = {
      ...baseState,
      selectedItem: getItem('1'),
      skuSelector: {
        ...baseState.skuSelector,
        selectedImageVariationSKU: '1',
      },
    }

    const nextState = reducer(staleState, {
      type: 'SET_SELECTED_ITEM',
      args: { item: getItem('2') },
    })

    expect(nextState.skuSelector.selectedImageVariationSKU).toBe('2')
  })

  it('fixes stale selectedImageVariationSKU without changing the selected item', () => {
    const itemTwo = getItem('2')
    const staleState: ProductContextState = {
      ...baseState,
      selectedItem: itemTwo,
      skuSelector: {
        ...baseState.skuSelector,
        selectedImageVariationSKU: '1',
      },
    }

    const nextState = reducer(staleState, {
      type: 'SET_SELECTED_ITEM',
      args: { item: itemTwo },
    })

    expect(nextState.skuSelector.selectedImageVariationSKU).toBe('2')
  })

  it('still allows SELECT_IMAGE_VARIATION to update the gallery SKU independently', () => {
    const itemOne = getItem('1')

    const withItem = reducer(baseState, {
      type: 'SET_SELECTED_ITEM',
      args: { item: itemOne },
    })

    const withPreview = reducer(withItem, {
      type: 'SELECT_IMAGE_VARIATION',
      args: { selectedImageVariationSKU: '3' },
    })

    expect(withPreview.selectedItem).toBe(itemOne)
    expect(withPreview.skuSelector.selectedImageVariationSKU).toBe('3')
  })
})
