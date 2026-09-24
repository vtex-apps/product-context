/* eslint-env jest */
import { reducer, getSelectedItem } from '../reducer'
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

  it('clears the image variation SKU even when the selected item id is unchanged', () => {
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

  it('clears the image variation SKU when the incoming item is an unrelated fallback', () => {
    const result = selectItem(buildState('1', '2'), '3')

    expect(result.selectedItem?.itemId).toBe('3')
    expect(result.skuSelector.selectedImageVariationSKU).toBeNull()
  })
})

describe('getSelectedItem', () => {
  const available = (itemId: string) =>
    ({
      itemId,
      sellers: [{ commertialOffer: { AvailableQuantity: 1 } }],
    } as any)

  const soldOut = (itemId: string) =>
    ({
      itemId,
      sellers: [{ commertialOffer: { AvailableQuantity: 0 } }],
    } as any)

  const items = [soldOut('1'), available('2'), available('3')]

  it('resolves by skuId when there is one', () => {
    expect(getSelectedItem('1', items)?.itemId).toBe('1')
  })

  it('lets an explicit skuId win over the image variation SKU', () => {
    expect(getSelectedItem('2', items, '3')?.itemId).toBe('2')
  })

  it('falls back to the first available item when nothing is pinned', () => {
    expect(getSelectedItem(undefined, items)?.itemId).toBe('2')
  })

  it('prefers the pinned item over the first available one', () => {
    expect(getSelectedItem(undefined, items, '3')?.itemId).toBe('3')
  })

  it('prefers a pinned item that is sold out, since it was picked on purpose', () => {
    expect(getSelectedItem(undefined, items, '1')?.itemId).toBe('1')
  })

  it('ignores a pin that matches no item', () => {
    expect(getSelectedItem(undefined, items, 'nope')?.itemId).toBe('2')
  })

  it('falls back to the first item when none is available', () => {
    const noneAvailable = [soldOut('1'), soldOut('2')]

    expect(getSelectedItem(undefined, noneAvailable)?.itemId).toBe('1')
  })
})
