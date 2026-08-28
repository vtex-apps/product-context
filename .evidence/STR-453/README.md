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
