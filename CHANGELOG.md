# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.11.1] - 2026-09-24

### Fixed

- `SET_SELECTED_ITEM` now clears a stale `skuSelector.selectedImageVariationSKU` whenever it disagrees with the incoming item, even when that item is just a fallback and happens to match the previous selection. Components that give the pin priority over `selectedItem` (such as the product gallery) no longer render a stale SKU in that case.
- The pin is now also reconciled when the query string changes without changing the derived `skuId` (e.g. going from no `skuId` to an empty one), so it doesn't get stuck pointing at a colour that was clicked with another variation still unselected.

### Changed

- With no `skuId` to resolve, `getSelectedItem` now prefers the item pointed at by `skuSelector.selectedImageVariationSKU` over the first available one, so an incomplete selection keeps the colour the shopper clicked instead of falling back to an unrelated item. Behaviour is unchanged when nothing is pinned or when the pin matches no item.

## [0.11.0] - 2026-05-26

### Added

- `SkuNonStructuredAttribute` type and optional `attributes` field on the `Item` type to expose non-structured SKU specifications coming from `vtex.search-graphql`.

### Changed

- Update GitHub actions/cache to v4
- Update DK Catalog platform-flow-id

## [0.10.1] - 2024-02-01
### Fixed
- Min docs improvements

## [0.10.0] - 2021-08-03
### Added
- `loadingItem` to product context
- Action `SET_LOADING_ITEM` to product context dispatch.

## [0.9.9] - 2021-03-30
### Fixed
- Fixed typing for assembly options

## [0.9.8] - 2021-03-30
### Fixed
- Fixed typing for product item metadata

## [0.9.7] - 2020-12-21
### Fixed
- Added `originalName` to `ProductSpecification`.

### Changed
- Deprecate `SpecificationGroupItem`.

## [0.9.6] - 2020-12-15
### Fixed
- Product Dispatch context.

## [0.9.5] - 2020-12-10
### Fixed
- Expose context state types.
- `teasers` types.

## [0.9.4] - 2020-12-01
### Fixed
- Typings for `specificationGroups` (once again).

## [0.9.3] - 2020-12-01
### Fixed
- Typings for `specificationGroups`.

## [0.9.2] - 2020-10-09
### Fixed
- `product.specifications` types.

## [0.9.1] - 2020-09-28
### Fixed
-  Move `productClusters` typings definitions to `Product` type.

## [0.9.0] - 2020-09-15
### Added
- Documentation on how to use the app.

## [0.8.2] - 2020-09-04
### Added
- `useProductDispatch` hook.

### Fixed
- TypeScript types not being picked-up and exported correctly by React builder.

## [0.8.1] - 2020-07-22
### Fixed
- When variants are passed in the query string, guarantee that the matched SKU is available if possible.

## [0.8.0] - 2020-07-10

### Added
- Support for the `property__VariationName=Variation` query string.

## [0.7.1] - 2020-02-11
### Added
- `SELECT_IMAGE_VARIATION` action.

## [0.7.0] - 2020-01-15
### Added
- `skuSpecifications` on `Product`.

## [0.6.0] - 2019-12-27
### Added
- Docs builder.

## [0.5.0] - 2019-11-11
### Added
- Support for selecting a SKU using the query string `idsku`.

## [0.4.0] - 2019-10-30
### Added
- `SET_BUY_BUTTON_CLICKED` action.

## [0.3.2] - 2019-10-28
### Chore
- Rebuild to enable lazy evaluation of product-context entrypoints.

## [0.3.1] - 2019-09-20
### Fixed
- Fix SET_PRODUCT action on context that wS leaving product as undefined.

## [0.3.0] - 2019-09-20 - Deprecated
### Fixed
- `itemMetadata` types

### Added
- `required` field to `AssemblyOptions` type.
- `inputValues` field to `AssemblyOptions` type.

## [0.2.0] - 2019-09-18
### Added
- Handle Assembly Options' Input Values.

## [0.1.1] - 2019-09-16
### Fixed
- Protect against wrong args format in reducer.

## [0.1.0] - 2019-09-16
### Changed
- Move useReducer and types declaration from `vtex.store` to here.
- Move logic to sync product in context to here.

## [0.0.7] - 2019-08-29

## [0.0.6] - 2019-07-11
### Fixed
- Initialise ProductDispatchContext with null, allowing easier detection of uninitialised context.

## [0.0.5] - 2019-06-27

### Fixed
- Build assets with new builder hub.

