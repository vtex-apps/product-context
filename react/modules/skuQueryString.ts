import { findAvailableProduct } from '../reducer'
import { zipObj } from 'ramda'

interface QueryParams {
  skuId?: string
  idsku?: string
  propertyName?: string
  propertyValue?: string
}

interface Variation {
  name: string
  value: string
}

const itemHasVariation = (item: Item, variation: Variation) => {
  const { name, value } = variation

  return Boolean(
    item.variations.find(
      variation =>
        variation.name === name &&
        variation.values.some(variationValue => variationValue === value)
    )
  )
}

// `idsku` querystring is to keep compatibility with Google Shopping integration
export const getSelectedSKUFromQueryString = (
  query: QueryParams,
  items: Item[]
) => {
  const skuId = query.skuId || query.idsku

  if (skuId) {
    return skuId
  }

  if (!query.propertyName || !query.propertyValue) {
    return
  }

  const names = query.propertyName.split(',')
  const values = query.propertyValue.split(',')
  const selectedVariations = zipObj(names, values)

  const selectedVariationEntries = Object.entries(selectedVariations)

  if (selectedVariationEntries.length === 0) {
    return
  }

  const selectedItem = items.find(item =>
    selectedVariationEntries.every(selectedVariation => {
      const [name, value] = selectedVariation
      return (
        Boolean(findAvailableProduct(item)) &&
        itemHasVariation(item, { name, value })
      )
    })
  )

  return selectedItem && selectedItem.itemId
}
