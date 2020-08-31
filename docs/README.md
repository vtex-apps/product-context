📢 Use this project, [contribute](https://github.com/vtex-apps/add-to-cart-button) to it or open issues to help evolve it using [Store Discussion](https://github.com/vtex-apps/store-discussion).

# Product Context

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

The Product Context app is responsible for exposing data regarding a certain product to all of it's children.

## Usage example

To use this app, be sure to add it to you app's `manifest.json` file:

```json
{
  "dependencies": {
    "vtex.product-context": "0.x"
  }
}
```

then you can import any of the exported components and hooks from the app. Here's an example of a component that render's the name of the product whose data is stored in the nearest `ProductContext`:

```tsx
import React, { FC } from 'react'
import { useProduct } from 'vtex.product-context'

const MyComponent: FC = () => {
  const productContextValue = useProduct()

  return (
    <Fragment>
      {productContextValue?.product?.productName}
    </div>
  )
}

export default MyComponent
```

:warning: Be sure to run `vtex setup` in your project to install the correct TypeScript types exported by this app.

## API

### `ProductContext`

The `ProductContext` entry point exports the React context in it's raw form. This is only useful if you want to reference it directly.

Be aware that most of the times, what you're looking for is the `useProduct` hook described below.

### `useProduct`

This is the most useful export from this app. The `useProduct` hook can be used to read the data from the nearest `ProductContext` relative to its caller. The `productContextValue` variable from the example in the [Usage Example](#usage-example) example has the following type definition:

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

you should expect an object that looks like that as the return value of `useProduct`. Just be aware that, if the hook is called **outside** of a `ProductContextProvider`, the return value could be `undefined` or an empty object.

ℹ️ To have the full type definition in your development environment, be sure to run `vtex setup` in your project to install all TypeScript types exported by this app.

### `ProductContextProvider`

### `ProductDispatchContext`

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!