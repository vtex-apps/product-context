import { itemHasVariation, findAvailableProduct } from './items'
import { Item } from '../ProductTypes'

interface QueryParams {
  skuId?: string
  idsku?: string
}

const QUERY_STRING_VARIANT_PREFIX = 'property__'

// `idsku` querystring is to keep compatibility with Google Shopping integration
export const getSelectedSKUFromQueryString = (
  query: QueryParams,
  items: Item[] = []
) => {
  const skuId = query.skuId ?? query.idsku

  if (skuId) {
    return skuId
  }

  const variantQueryProps = Object.entries(query)
    .filter(([key]) => key.startsWith(QUERY_STRING_VARIANT_PREFIX))
    .map(([key, value]) => [
      key.slice(QUERY_STRING_VARIANT_PREFIX.length),
      value,
    ])

  if (variantQueryProps.length === 0) {
    return
  }

  const itemsWithVariation = items.filter(item =>
    variantQueryProps.every(([name, value]) => {
      return itemHasVariation(item, { name, value })
    })
  )

  if (itemsWithVariation.length === 0) {
    return
  }

  const availableItem = itemsWithVariation.find(item =>
    findAvailableProduct(item)
  )

  if (availableItem) {
    return availableItem.itemId
  }

  return itemsWithVariation[0].itemId
}
