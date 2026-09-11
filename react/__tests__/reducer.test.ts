/* eslint-env jest */
import { reducer } from '../reducer'
import type { ProductContextState } from '../ProductContextProvider'

const buildState = (
  selectedItemId: string | null,
  selectedImageVariationSKU: string | null
): ProductContextState =>
  ({
    loadingItem: true,
    product: undefined,
    selectedItem: selectedItemId ? { itemId: selectedItemId } : null,
    selectedQuantity: 1,
    skuSelector: {
      selectedImageVariationSKU,
      isVisible: true,
      areAllVariationsSelected: false,
    },
    buyButton: { clicked: false },
    assemblyOptions: { items: {}, inputValues: {}, areGroupsValid: {} },
  } as any)

const selectItem = (state: ProductContextState, itemId: string) =>
  reducer(state, {
    type: 'SET_SELECTED_ITEM',
    args: { item: { itemId } },
  } as any)

describe('SET_SELECTED_ITEM', () => {
  it('clears the image variation SKU when another item gets selected', () => {
    const result = selectItem(buildState('1', '1'), '2')

    expect(result.selectedItem?.itemId).toBe('2')
    expect(result.skuSelector.selectedImageVariationSKU).toBeNull()
  })

  it('keeps the image variation SKU when it points at the incoming item', () => {
    const result = selectItem(buildState('1', '2'), '2')

    expect(result.skuSelector.selectedImageVariationSKU).toBe('2')
  })

  it('keeps the image variation SKU when the selected item did not change', () => {
    const result = selectItem(buildState('1', '2'), '1')

    expect(result.skuSelector.selectedImageVariationSKU).toBe('2')
  })

  it('leaves the rest of the sku selector state untouched', () => {
    const cleared = selectItem(buildState('1', '1'), '2')
    const untouched = selectItem(buildState('1', null), '2')

    expect(cleared.skuSelector.isVisible).toBe(true)
    expect(cleared.skuSelector.areAllVariationsSelected).toBe(false)
    expect(untouched.skuSelector.selectedImageVariationSKU).toBeNull()
    expect(untouched.skuSelector.isVisible).toBe(true)
  })

  it('still resets the loading flag and assigns the item', () => {
    const result = selectItem(buildState('1', null), '2')

    expect(result.loadingItem).toBe(false)
    expect(result.selectedItem?.itemId).toBe('2')
  })

  // https://github.com/vtex-apps/product-context/pull/88 — picking a colour
  // while another variation is still unselected also lands here with a
  // fallback item (the query string's skuId gets cleared). An exception that
  // preserved the pin in that case was considered and rejected: the gallery
  // must always match `selectedItem`, even when `selectedItem` itself is
  // just a fallback the shopper never explicitly chose. This case is no
  // different from any other item change, so it clears like the rest.
  it('clears the image variation SKU even when the incoming item is an unrelated fallback', () => {
    const result = selectItem(buildState('1', '2'), '3')

    expect(result.selectedItem?.itemId).toBe('3')
    expect(result.skuSelector.selectedImageVariationSKU).toBeNull()
  })
})
