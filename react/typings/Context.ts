type Action<K, V = void> = V extends void ? { type: K } : { type: K } & V

interface ProductAndQuery {
  query: Record<string, any>
  product: MaybeProduct
}

interface AssemblyOptionItem {
  id: string
  quantity: number
  seller: string
  initialQuantity: number
  choiceType: string
  name: string
  price: number
  children: Record<string, AssemblyOptionItem[]> | null
}

interface ProductContextState {
  selectedItem?: Item | null
  product: MaybeProduct
  selectedQuantity: number
  skuSelector: {
    isVisible: boolean
    areAllVariationsSelected: boolean
  }
  assemblyOptions: {
    items: Record<string, AssemblyOptionItem[]>
    areGroupsValid: Record<string, boolean>
  }
}

type Actions =
  | Action<'SET_QUANTITY', { args: { quantity: number } }>
  | Action<
      'SKU_SELECTOR_SET_VARIATIONS_SELECTED',
      { args: { allSelected: boolean } }
    >
  | Action<'SKU_SELECTOR_SET_IS_VISIBLE', { args: { isVisible: boolean } }>
  | Action<'SET_SELECTED_ITEM', { args: { item: Item | undefined | null } }>
  | Action<
      'SET_ASSEMBLY_OPTIONS',
      {
        args: {
          groupId: string
          groupItems: AssemblyOptionItem[]
          isValid: boolean
        }
      }
    >
  | Action<'SET_PRODUCT', { args: { product: MaybeProduct } }>
