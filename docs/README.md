📢 Use this project, [contribute](https://github.com/vtex-apps/product-context) to it or open issues to help evolve it using [Store Discussion](https://github.com/vtex-apps/store-discussion).

# Product Context

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

The Product Context app is designed to provide essential product data to all child blocks within your store theme.

## Configuration

1. Add the `product-context` app as a dependency to your store theme's `manifest.json` file:
    
    ```diff manifest.json
      "dependencies": {
    +   "vtex.product-context": "0.x"
      }
    ```
    
2. Install the TypeScript types exported by the app by running the following command:
    
    ```sh
    vtex setup
    ```

Now, you're ready to import components and hooks from the app. Check this example component that displays the product name using data stored in the nearest `ProductContext`:

```tsx
// Notice that this is TypeScript, and this code should be in a .tsx file
import React, { FC } from 'react'
import { useProduct } from 'vtex.product-context'

const MyComponent: FC = () => {
  const productContextValue = useProduct();

  return (
    <Fragment>
      {productContextValue?.product?.productName}
    </Fragment>
  )
}

export default MyComponent
```

## Hooks

### `useProduct`

The `useProduct` hook allows your app to retrieve data from the nearest `ProductContext` relative to its caller. Expect an object with the structure below as the return value:

```ts
interface ProductContextState {
  selectedItem?: Item | null
  product: MaybeProduct
  selectedQuantity: number
  skuSelector: {
    selectedImageVariationSKU: string | null
    isVisible: boolean
    areAllVariationsSelected: boolean
  }
  buyButton: BuyButtonContextState
  assemblyOptions: {
    items: Record<GroupId, AssemblyOptionItem[]>
    inputValues: Record<GroupId, InputValues>
    areGroupsValid: Record<GroupId, boolean>
  }
}
```

> Note that if the hook is called outside a `ProductContextProvider`, the return value may be `undefined` or an empty object.

### `useProductDispatch`

The `useProductDispatch` hook provides a `dispatch` function to manipulate the nearest `ProductContext`. The function supports the following actions:

- `SELECT_IMAGE_VARIATION`: Sets the value for the `skuSelector.selectedImageVariationSKU` property.
- `SET_QUANTITY`: Sets the value for the `selectedQuantity` property.
- `SKU_SELECTOR_SET_VARIATIONS_SELECTED`: Sets the value for the `skuSelector.areAllVariationsSelected` property.
- `SET_BUY_BUTTON_CLICKED`: Sets the value for the `buyButton.clicked` property.
- `SKU_SELECTOR_SET_IS_VISIBLE`: Sets the value for the `skuSelector.isVisible` property.
- `SET_SELECTED_ITEM`: Sets the value for the `selectedItem` property.
- `SET_ASSEMBLY_OPTIONS`: Sets the value for the `assemblyOptions` property.
- `SET_PRODUCT`: Sets the value for the `product` property.
- `SET_LOADING_ITEM`: Sets the value of whether a selected item is loading.

<!-- DOCS-IGNORE:start -->

## Contributors ✨

Thanks goes to these wonderful people:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/sahanljc"><img src="https://avatars.githubusercontent.com/u/42151054?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Sahan Jayawardana</b></sub></a><br /><a href="https://github.com/vtex-apps/product-context/commits?author=sahanljc" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

<!-- DOCS-IGNORE:end -->
