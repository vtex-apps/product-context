interface QueryParams {
  skuId?: string
  idsku?: string
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

  const selectedVariations: Record<string, string> = {}

  const propertyRegex = /^property__(.*)/

  Object.entries(query).forEach(keyValue => {
    const [key, value] = keyValue

    const match = propertyRegex.exec(key)

    if (!match) {
      return
    }

    const [, variationName] = match
    selectedVariations[variationName] = value
  })

  if (Object.entries(selectedVariations).length === 0) {
    return
  }

  const selectedItem = items.find(item =>
    Object.entries(selectedVariations).every(selectedVariation => {
      const [name, value] = selectedVariation
      return itemHasVariation(item, { name, value })
    })
  )

  return selectedItem && selectedItem.itemId
}
