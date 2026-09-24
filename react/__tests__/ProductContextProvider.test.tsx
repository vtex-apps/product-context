/* eslint-env jest */
import React, { useContext, useEffect } from 'react'
import { render } from '@vtex/test-tools/react'

// eslint-disable-next-line jest/no-mocks-import
import { getProduct, getItem } from '../__mocks__/productMock'
import ProductContextProvider, {
  ProductAndQuery,
} from '../ProductContextProvider'
import ProductContext from '../ProductContext'
import ProductDispatchContext from '../ProductDispatchContext'

const { useProductDispatch } = ProductDispatchContext

const ProductPageMock = () => {
  const { selectedItem, product, selectedQuantity, skuSelector } = useContext(
    ProductContext
  ) as any

  return (
    <div>
      <div>Product Page</div>
      <div>Selected Item id: {selectedItem?.itemId}</div>
      <div>Selected Item name: {selectedItem?.name}</div>
      {product ? (
        <div>product slug: {product?.linkText}</div>
      ) : (
        <div>no product</div>
      )}
      <div>Selected Quantity: {selectedQuantity}</div>
      <div>Pin: {skuSelector?.selectedImageVariationSKU ?? 'none'}</div>
    </div>
  )
}

const PinImageVariationMock = ({ itemId }: { itemId: string }) => {
  const dispatch = useProductDispatch()

  useEffect(() => {
    dispatch?.({
      type: 'SELECT_IMAGE_VARIATION',
      args: { selectedImageVariationSKU: itemId },
    })
  }, [dispatch, itemId])

  return null
}

describe('ProductContextProvider component', () => {
  const getProps = (customProps: Partial<ProductAndQuery>): ProductAndQuery => {
    const product = getProduct()
    const props = {
      product,
      query: {},
      ...customProps,
    }

    return props
  }

  const renderComponent = (customProps: Partial<ProductAndQuery> = {}) => {
    const component = render(
      <ProductContextProvider {...getProps(customProps)}>
        <ProductPageMock />
      </ProductContextProvider>
    )

    const { getByText, rerender } = component

    return {
      ...component,
      testNoProduct: () => getByText('no product'),
      getSelectedItemId: (item: { itemId: string }) =>
        getByText(`Selected Item id: ${item.itemId}`),
      getSelectedItemName: (item: { name: string }) =>
        getByText(`Selected Item name: ${item.name}`),
      getProductSlug: (product: { linkText: string }) =>
        getByText(`product slug: ${product.linkText}`),
      rerender: (newProps: any) =>
        rerender(
          <ProductContextProvider {...newProps}>
            <ProductPageMock />
          </ProductContextProvider>
        ),
    }
  }

  it('should render with product', () => {
    const product = getProduct()
    const { getProductSlug } = renderComponent()

    getProductSlug(product)
  })

  it('should render with no product and then switch', () => {
    const { getProductSlug, rerender, testNoProduct } = renderComponent({
      product: undefined,
    })

    testNoProduct()

    const product = getProduct()

    rerender({ product, query: {} })

    getProductSlug(product)
  })

  it('should switch items and reset state', () => {
    const product = getProduct()
    const {
      rerender,
      getSelectedItemId,
      getSelectedItemName,
      getProductSlug,
    } = renderComponent()

    const newItem = getItem('2')
    const newProduct = getProduct({
      items: [newItem],
      productId: '2',
      linkText: 'product-slug-2',
      titleTag: 'Product 2',
      productName: 'Product 2',
    })

    getSelectedItemId(product.items[0])
    getSelectedItemName(product.items[0])
    getProductSlug(product)

    rerender({ product: newProduct, query: {} })

    getSelectedItemId(newProduct.items[0])
    getSelectedItemName(newProduct.items[0])
    getProductSlug(newProduct)
  })

  it('should select first item with available quantity', async () => {
    const noQuantity = getItem('no quantity', 90, 0)
    const itemWithQuantity = getItem('Item with quantity', 90, 10)
    const otherItemWithQuantity = getItem('other item with quantity', 90, 10)
    const newProduct = getProduct({
      items: [noQuantity, noQuantity, itemWithQuantity, otherItemWithQuantity],
    })

    const { getSelectedItemId, getSelectedItemName } = renderComponent({
      product: newProduct,
    })

    getSelectedItemId(itemWithQuantity)
    getSelectedItemName(itemWithQuantity)
  })

  it('should switch items when changing query prop', async () => {
    const itemone = getItem('1', 90, 1)
    const itemtwo = getItem('2', 90, 10)
    const itemthree = getItem('3', 90, 10)
    const newProduct = getProduct({
      items: [itemone, itemtwo, itemthree],
    })

    const props = {
      product: newProduct,
      params: { slug: newProduct.linkText },
      productQuery: { product: newProduct, loading: false },
    }

    const {
      getSelectedItemId,
      getSelectedItemName,
      rerender,
    } = renderComponent(props)

    getSelectedItemId(itemone)
    getSelectedItemName(itemone)

    rerender({ product: newProduct, query: { skuId: itemtwo.itemId } })

    getSelectedItemId(itemtwo)
    getSelectedItemName(itemtwo)
  })

  it('reconciles a stale pin when the query object changes without a skuId', () => {
    const itemOne = getItem('1', 90, 10)
    const itemTwo = getItem('2', 90, 10)
    const product = getProduct({ items: [itemOne, itemTwo] })
    const emptyQuery = {}

    const { getByText, rerender } = render(
      <ProductContextProvider product={product} query={emptyQuery}>
        <ProductPageMock />
      </ProductContextProvider>
    )

    getByText(`Selected Item id: ${itemOne.itemId}`)
    getByText('Pin: none')

    rerender(
      <ProductContextProvider product={product} query={emptyQuery}>
        <ProductPageMock />
        <PinImageVariationMock itemId={itemTwo.itemId} />
      </ProductContextProvider>
    )

    getByText(`Pin: ${itemTwo.itemId}`)

    rerender(
      <ProductContextProvider product={product} query={{ skuId: '' }}>
        <ProductPageMock />
      </ProductContextProvider>
    )

    getByText(`Selected Item id: ${itemTwo.itemId}`)
    getByText(`Pin: ${itemTwo.itemId}`)
  })

  it('falls back to the first available item when the pin points nowhere', () => {
    const itemOne = getItem('1', 90, 10)
    const itemTwo = getItem('2', 90, 10)
    const product = getProduct({ items: [itemOne, itemTwo] }) as any
    const emptyQuery = {}

    const { getByText, rerender } = render(
      <ProductContextProvider product={product} query={emptyQuery}>
        <ProductPageMock />
      </ProductContextProvider>
    )

    rerender(
      <ProductContextProvider product={product} query={emptyQuery}>
        <ProductPageMock />
        <PinImageVariationMock itemId="does-not-exist" />
      </ProductContextProvider>
    )

    getByText('Pin: does-not-exist')

    rerender(
      <ProductContextProvider product={product} query={{ skuId: '' }}>
        <ProductPageMock />
      </ProductContextProvider>
    )

    getByText(`Selected Item id: ${itemOne.itemId}`)
    getByText('Pin: none')
  })

  it('clears a stale pin when skuId in the query selects another item', () => {
    const green41 = getItem('green-41', 90, 10)
    const green40 = getItem('green-40', 90, 10)
    const product = getProduct({ items: [green41, green40] })

    const { getByText, rerender } = render(
      <ProductContextProvider
        product={product}
        query={{ skuId: green41.itemId }}
      >
        <ProductPageMock />
      </ProductContextProvider>
    )

    getByText(`Selected Item id: ${green41.itemId}`)
    getByText(`Pin: none`)

    rerender(
      <ProductContextProvider
        product={product}
        query={{ skuId: green41.itemId }}
      >
        <ProductPageMock />
        <PinImageVariationMock itemId={green41.itemId} />
      </ProductContextProvider>
    )

    getByText(`Pin: ${green41.itemId}`)

    rerender(
      <ProductContextProvider
        product={product}
        query={{ skuId: green40.itemId }}
      >
        <ProductPageMock />
      </ProductContextProvider>
    )

    getByText(`Selected Item id: ${green40.itemId}`)
    getByText('Pin: none')
  })

  it('should dispatch action with bad args and not break anything', () => {
    const BadComponent = () => {
      const dispatch = useProductDispatch()

      dispatch?.({ type: 'SET_QUANTITY', quantity: 1 } as any)
      dispatch?.({
        type: 'SKU_SELECTOR_SET_VARIATIONS_SELECTED',
        quantity: 1,
      } as any)
      dispatch?.({ type: 'SKU_SELECTOR_SET_IS_VISIBLE', quantity: 1 } as any)
      dispatch?.({ type: 'SET_SELECTED_ITEM', quantity: 1 } as any)
      dispatch?.({ type: 'SET_ASSEMBLY_OPTIONS', quantity: 1 } as any)
      dispatch?.({ type: 'SET_PRODUCT', quantity: 1 } as any)

      return <div>Bad Component rendered OK</div>
    }

    const { getByText } = render(
      <ProductContextProvider {...getProps({})}>
        <BadComponent />
      </ProductContextProvider>
    )

    getByText('Bad Component rendered OK')
  })
})
