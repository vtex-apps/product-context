type Maybe<T> = T | null | undefined

export type MaybeProduct = Maybe<Product>

export interface Product {
  cacheId: string
  productName: string
  productId: string
  description: string
  titleTag: string
  metaTagDescription: string
  linkText: string
  link: string
  productReference: string
  categoryId: string
  categoriesIds: string[]
  categories: string[]
  categoryTree: Array<{
    id: string
    name: string
    href: string
  }>
  brand: string
  brandId: string
  properties: Array<{
    name: string
    values: string
  }>
  specificationGroups: Array<{
    name: string
    specifications: Array<{
      name: string
      values: string[]
    }>
  }>
  items: Item[]
  skuSpecifications: SkuSpecification[]
  itemMetadata: {
    items: ItemMetadata[]
    priceTable: any[]
  }
  priceRange: {
    sellingPrice: { highPrice: number; lowPrice: number }
    listPrice: { highPrice: number; lowPrice: number }
  }
}

export interface Item {
  itemId: string
  name: string
  nameComplete: string
  complementName: string
  ean: string
  referenceId: Array<{
    Key: string
    Value: string
  }>
  measurementUnit: string
  unitMultiplier: number
  images: Array<{
    imageId: string
    imageLabel: string
    imageTag: string
    imageUrl: string
    imageText: string
  }>
  videos: Array<{
    videoUrl: string
  }>
  sellers: Seller[]
  variations: Array<{
    name: string
    values: string[]
  }>
  productClusters: Array<{
    id: string
    name: string
  }>
  clusterHighlights: Array<{
    id: string
    name: string
  }>
}

export interface SkuSpecification {
  field: SkuSpecificationField
  values: SkuSpecificationValues[]
}

export interface SkuSpecificationField {
  name: string
}

export interface SkuSpecificationValues {
  name: string
}

export interface Seller {
  sellerId: string
  sellerName: string
  addToCartLink: string
  sellerDefault: boolean
  commertialOffer: CommercialOffer
}

export interface CommercialOffer {
  Installments: Installment[]
  discountHighlights: Array<{
    name: string
  }>
  teasers: Array<{
    name: string
  }>
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

export interface Installment {
  Value: number
  InterestRate: number
  TotalValuePlusInterestRate: number
  NumberOfInstallments: number
  PaymentSystemName: string
  PaymentSystemGroupName: string
  Name: string
}

export interface ItemMetadata {
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
    values: Array<{
      id: string
      assemblyId: string
      price: number | null
    }>
  }>
}

export type InputValue = TextInputValue | BooleanInputValue | OptionsInputValue

const enum InputValueType {
  'TEXT' = 'TEXT',
  'BOOLEAN' = 'BOOLEAN',
  'OPTIONS' = 'OPTIONS',
}

export interface TextInputValue {
  type: InputValueType.TEXT
  defaultValue: ''
  label: string
  maxLength: number
  domain: null
}

export interface BooleanInputValue {
  type: InputValueType.BOOLEAN
  defaultValue: boolean
  label: string
  maxLength: null
  domain: null
}

export interface OptionsInputValue {
  type: InputValueType.OPTIONS
  defaultValue: string
  label: string
  maxLength: null
  domain: string[]
}

export interface Composition {
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
