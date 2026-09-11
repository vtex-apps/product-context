# STR-453 — evidence assets

**This branch is not meant to be merged.** It only hosts static images referenced
from [PR #88](https://github.com/vtex-apps/product-context/pull/88), because GitHub
does not accept file uploads through `gh`/the API — a PR body can only point at a URL.

| file | what it shows |
| --- | --- |
| `before-master.png` | `master`: SKU `310124175` ("White Slip On 41") is selected, but the gallery still renders SKU `35` ("Classic Pink") because `skuSelector.selectedImageVariationSKU` went stale. |
| `after-fix.png` | Same product, same flow, with the fix linked: the stale value is cleared and the gallery follows the selected SKU. |

Both frames were captured on `storecomponents` (`/classic-shoes/p`) at a 1280x760
viewport, running the identical scripted interaction against each environment:
pin an image variation on SKU `35`, then move the selection to SKU `310124175`.

## Follow-up: @mendescamara's review comment

@mendescamara flagged that the fix above could regress a different flow: clicking a
colour swatch while another variation (e.g. Size) is still unselected. `SKUSelector`
still calls `redirectToSku(null)` in that case (clearing `skuId` from the URL) even
though a valid image-variation pin was just set, and the guard added above would wipe
that pin because it can't tell an explicit selection from a query-string fallback. The
follow-up fix threads a `fromQueryString` flag from the provider into the reducer so
the pin is only cleared on genuine explicit selections.

| file | what it shows |
| --- | --- |
| `mendescamara-review-before.png` | Same reducer guard as above, **without** the `fromQueryString` follow-up. Flow: start at SKU `37` (Red/42, out of stock), deselect Size, click Green (ambiguous: SKU `35` Green/40 out of stock, SKU `310124227` Green/41 in stock). `skuId` is cleared from the URL, `selectedItem` falls back to SKU `310124175` (White/41) — and the pin is wrongly cleared too (`selectedImageVariationSKU: null`), so the gallery snaps back to White even though the shopper just clicked Green. |
| `mendescamara-review-after.png` | Identical flow, with the `fromQueryString` follow-up linked. `selectedItem` still falls back to SKU `310124175` (White/41) for price/stock purposes, but the pin is preserved (`selectedImageVariationSKU: "310124227"`), so the gallery correctly keeps showing the Green the shopper picked. |

Both frames were captured live on `storecomponents` (`/classic-shoes/p`), driving the
same SKU-selector click sequence against two dev workspaces linked with each commit
(the reducer test suite covers the same three cases at the unit level).

## Decision: the `fromQueryString` exception above was reverted

After reproducing `mendescamara-review-after.png` live, we (with the PR author)
decided the exception it depends on is the wrong call, and reverted it. Preserving
the pin in the fallback case reintroduces exactly the invariant the base fix
(`94c1cac`) exists to guarantee — the gallery must always match `selectedItem`, even
when `selectedItem` is itself just a fallback the shopper never explicitly chose.
`mendescamara-review-after.png` is kept here for the historical record of what the
rejected exception produced; it is **not** what shipped.

| file | what it shows |
| --- | --- |
| `mendescamara-review-final.png` | The shipped behaviour: same flow as above, pin **not** preserved. Pixel-identical to `mendescamara-review-before.png` — clearing the pin on this fallback is treated like any other item change. |
