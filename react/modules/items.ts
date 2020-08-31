import { Item, Seller } from '../ProductTypes'

export function findAvailableProduct(item: Item) {
  return item.sellers.find((seller: Seller) => {
    return seller?.commertialOffer?.AvailableQuantity > 0
  })
}

export function itemHasVariation(
  item: Item,
  { name, value }: { name: string; value: string }
) {
  return Boolean(
    item.variations.find(
      variation =>
        variation.name === name &&
        variation.values.some(variationValue => variationValue === value)
    )
  )
}
