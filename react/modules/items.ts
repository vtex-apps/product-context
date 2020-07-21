export function findAvailableProduct(item: Item) {
  return item.sellers.find((seller: Seller) => {
    return seller?.commertialOffer?.AvailableQuantity > 0
  })
}

export function itemHasVariation(
  item: Item,
  variation: { name: string; value: string }
) {
  const { name, value } = variation

  return Boolean(
    item.variations.find(
      v =>
        v.name === name &&
        v.values.some(variationValue => variationValue === value)
    )
  )
}
