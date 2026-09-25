# UAE joinery keyword planner

This is the project-local version of the Google Ads Keyword Planner workflow used by the fit-out permits project. It intentionally excludes that project's credentials and its unrelated permit queries.

## One-time setup

1. Copy `.env.example` to `.env`.
2. Add credentials for the approved Google Ads manager/customer account. Keep this file private.
3. Run `make keywords`. It creates the local `.venv-keywords` environment the
   first time, then retrieves a fresh catalog.

Every run writes a dated JSON catalog with UAE English search volumes, competition and top-of-page CPC in AED. The catalog is ignored by Git; retain snapshots locally so that the next content decision can compare demand rather than overwrite it.

`page_keyword_map.csv` is the implementation brief. It assigns one principal search intent to each indexable page; supporting terms belong in helpful copy, headings, image alt text and internal links only where they naturally describe the work.

## Editorial rules

- Do not create pages just by changing a Dubai-area name or swapping keywords.
- Publish a page only when it has real project photography, a specific process or a useful decision for the buyer.
- Keep claims verifiable. A workshop visit, drawing detail and a clear scope will outlast exaggerated "number one" language.
- When a new guide or case study is published, add its target term to the latest catalog's `used` list so future work does not duplicate it.
