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

  /*
   * Regression for a Critical bug found while QA-reviewing PR #88: a pin
   * that disagrees with the incoming item must clear even if that item
   * happens to equal the previous selectedItem (e.g. landing back on the
   * catalog's fallback item after picking a colour with no size selected).
   */
  it('clears the image variation SKU even when the selected item did not change', () => {
    const result = selectItem(buildState('1', '2'), '1')

    expect(result.selectedItem?.itemId).toBe('1')
    expect(result.skuSelector.selectedImageVariationSKU).toBeNull()
  })

  it('keeps the image variation SKU across a same-item re-dispatch when it already matches', () => {
    const result = selectItem(buildState('1', '1'), '1')

    expect(result.skuSelector.selectedImageVariationSKU).toBe('1')
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

  // https://github.com/vtex-apps/product-context/pull/88 — same as above,
  // but landing on an unrelated fallback item instead of the same one.
  it('clears the image variation SKU even when the incoming item is an unrelated fallback', () => {
    const result = selectItem(buildState('1', '2'), '3')

    expect(result.selectedItem?.itemId).toBe('3')
    expect(result.skuSelector.selectedImageVariationSKU).toBeNull()
  })
})
