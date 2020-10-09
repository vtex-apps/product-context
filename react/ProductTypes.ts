type Maybe<T> = T | null | undefined

export type MaybeProduct = Maybe<Product>

export type ProductSpecification = { name: string; values: string[] }

export type Product = {
  brand: string
  brandId: string
  cacheId: string
  categories: string[]
  categoriesIds: string[]
  categoryId: string
  categoryTree: Array<{ id: string; name: string; href: string }>
  clusterHighlights: Array<{ id: string; name: string }>
  description: string
  itemMetadata: { items: ItemMetadata[]; priceTable: any[] }
  items: Item[]
  link: string
  linkText: string
  metaTagDescription: string
  priceRange: {
    sellingPrice: { highPrice: number; lowPrice: number }
    listPrice: { highPrice: number; lowPrice: number }
  }
  productClusters: Array<{ id: string; name: string }>
  productId: string
  productName: string
  productReference: string
  properties: ProductSpecification[]
  skuSpecifications: SkuSpecification[]
  specificationGroups: Array<{
    name: string
    specifications: ProductSpecification[]
  }>
  titleTag: string
}

export type Item = {
  complementName: string
  ean: string
  images: Array<{
    imageId: string
    imageLabel: string
    imageTag: string
    imageUrl: string
    imageText: string
  }>
  itemId: string
  measurementUnit: string
  name: string
  nameComplete: string
  referenceId: Array<{ Key: string; Value: string }>
  sellers: Seller[]
  unitMultiplier: number
  variations: Array<{ name: string; values: string[] }>
  videos: Array<{ videoUrl: string }>
}

export type SkuSpecification = {
  field: SkuSpecificationField
  values: SkuSpecificationValues[]
}

export type SkuSpecificationField = {
  name: string
}

export type SkuSpecificationValues = {
  name: string
}

export type Seller = {
  sellerId: string
  sellerName: string
  addToCartLink: string
  sellerDefault: boolean
  commertialOffer: CommercialOffer
}

export type CommercialOffer = {
  Installments: Installment[]
  discountHighlights: Array<{ name: string }>
  teasers: Array<{ name: string }>
  Price: number
  ListPrice: number
  spotPrice: number
  SellingPrice?: number
  PriceWithoutDiscount: number
  RewardValue: number
  PriceValidUntil: string
  AvailableQuantity: number
  Tax: number
  taxPercentage: number
  CacheVersionUsedToCallCheckout: string
}

export type Installment = {
  Value: number
  InterestRate: number
  TotalValuePlusInterestRate: number
  NumberOfInstallments: number
  PaymentSystemName: string
  PaymentSystemGroupName: string
  Name: string
}

export type ItemMetadata = {
  items: Array<{
    id: string
    name: string
    imageUrl: string
    seller: string
    assemblyOptions: {
      id: string
      name: string
      required: boolean
      inputValues: InputValue[]
      composition: Composition | null
    }
  }>
  priceTable: Array<{
    type: string
    values: Array<{ id: string; assemblyId: string; price: number | null }>
  }>
}

export type InputValue = TextInputValue | BooleanInputValue | OptionsInputValue

const enum InputValueType {
  'TEXT' = 'TEXT',
  'BOOLEAN' = 'BOOLEAN',
  'OPTIONS' = 'OPTIONS',
}

export type TextInputValue = {
  type: InputValueType.TEXT
  defaultValue: ''
  label: string
  maxLength: number
  domain: null
}

export type BooleanInputValue = {
  type: InputValueType.BOOLEAN
  defaultValue: boolean
  label: string
  maxLength: null
  domain: null
}

export type OptionsInputValue = {
  type: InputValueType.OPTIONS
  defaultValue: string
  label: string
  maxLength: null
  domain: string[]
}

export type Composition = {
  minQuantity: number
  maxQuantity: number
  items: Array<{
    id: string
    minQuantity: number
    maxQuantity: number
    priceTable: string
    seller: string
    initialQuantity: number
  }>
}
