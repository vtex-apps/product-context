/* eslint-env jest */
import React, { useContext } from 'react'
import { render } from '@vtex/test-tools/react'
import { getProduct, getItem } from '../__mocks__/productMock'
import ProductContextProvider from '../ProductContextProvider'
import ProductContext from '../ProductContext'

const ProductPageMock = () => {
  const { selectedItem, product, selectedQuantity } = useContext(ProductContext) as any
  return (
    <div>
      <div>Product Page</div>
      <div>Selected Item id: {selectedItem && selectedItem.itemId}</div>
      <div>Selected Item name: {selectedItem && selectedItem.name}</div>
      {product ? <div>product slug: {product && product.linkText}</div> : <div>no product</div>}
      <div>Selected Quantity: {selectedQuantity}</div>
    </div>
  )
}

describe('ProductContextProvider component', () => {
  const getProps = customProps => {
    const product = getProduct()
    const props = {
      product,
      query: {},
      ...customProps,
    }
    return props
  }
  const renderComponent = (customProps?: any) => {
    const component = render(
      <ProductContextProvider {...getProps(customProps)}>
        <ProductPageMock />
      </ProductContextProvider>
    )
    const { getByText, rerender } = component
    return {
      ...component,
      testNoProduct: () => getByText('no product'),
      getSelectedItemId: item => getByText(`Selected Item id: ${item.itemId}`),
      getSelectedItemName: item =>
        getByText(`Selected Item name: ${item.name}`),
      getProductSlug: product => getByText(`product slug: ${product.linkText}`),
      rerender: (newProps: any) => rerender(<ProductContextProvider {...newProps}>
        <ProductPageMock />
      </ProductContextProvider>)
    }
  }

  it('should render with product', () => {
    const product = getProduct()
    const { getProductSlug } = renderComponent()
    getProductSlug(product)
  })

  it('should render with no product and then switch', () => {

    const { getProductSlug, rerender, testNoProduct } = renderComponent({ product: undefined })
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
})
