📢 Use this project, [contribute](https://github.com/vtex-apps/add-to-cart-button) to it or open issues to help evolve it using [Store Discussion](https://github.com/vtex-apps/store-discussion).

# Product Context

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

The Product Context app is responsible for exposing data regarding a certain product to all of it's children.

## Usage

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

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!