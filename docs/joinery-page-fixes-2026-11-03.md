# Joinery page fixes and remaining evidence

## Follow-up: 4 November 2026

Implemented locally in the staging checkout. Not deployed. This section supersedes earlier contact-test and photo-attribution status below; the 3 November entries are retained as history.

### Costing source approved by the user

The user subsequently authorised using [Halo's joinery page](https://halo.ae/services/joinery) for costing. Rechecked the live source on 4 November 2026. Its quotation section offers a free consultation, a no-obligation site visit and scope review, and itemised quotations with material recommendations. It does not publish fixed wardrobe/kitchen rates, per-metre prices, deposits or payment percentages.

Applied that offer to both service quotation sections, the contact page and shared quotation/consultation CTAs. The initial consultation, site visit and scope review are described as free; detailed design, technical drawings, samples and further services still need written fee terms. Project prices remain specific to the measured brief, specification and agreed scope. The earlier statement below withholding the free-consultation offer is superseded by this authorisation. Workshop, project/photo provenance and guarantees are outside this costing approval and remain pending.

### Service content and image descriptions

- Wardrobe and kitchen guides now distinguish approximate enquiry measurements from a site survey, and explain plans/elevations, fixing details, drawings/sample approval, manufacture, fitting, adjustments and handover.
- Added customer preparation: disclose known services and wall issues; confirm responsibility for clearing/removals, access protection, permissions, lift bookings, prepared walls/floors and electrical/service points. Kitchens also request appliance model sheets and a sequence that accounts for kitchen downtime.
- Added budget to the quotation brief. Kept material grades, thicknesses, fittings, moisture performance, programme, payment and warranty terms conditional on the written specification.
- Added a visible distinction between specialist cabinetry and Halo's wider renovation scope, linked to [Halo's villa renovation service](https://halo.ae/services/villa-renovation-dubai). Its published service covers design, approvals, construction, MEP, joinery, finishes and handover; no Halo project statistics, warranty periods or guarantees were transferred to Joinery.
- Visually checked the twelve service-gallery images against their captions and alt text. Corrected the first wardrobe's visible handles, the round handles on the cream doors, and descriptions of hanging interiors and islands. Descriptions now use visible colours, textures and layouts rather than asserting an unverified timber species, stone type or finish system.
- No approved project/photo register was found. The two galleries are labelled **Design references** and no longer claim that these images document Joinery installations. Real project names, scope, materials, dates and photo permissions remain pending. Process imagery is explicitly illustrative.

### Quote and contact checks

- Retained the published destinations: telephone `+971559693009`, WhatsApp `https://wa.me/971559693009`, and email `hello@joinery.ae`. These match the [live contact page](https://joinery.ae/contact); this establishes consistency, not business ownership, message receipt or phone answering.
- Form now requests name, discipline, project location and details, with optional phone, dimensions, budget and timing. Both channel buttons use the same required-field validation. Attachments are added in the chosen app.
- WhatsApp opens a prepared message; email prepares a `mailto:` message. The interface explicitly requires reviewing and pressing Send in that app. It does not claim a successful submission. Added a prepared-message fallback and telephone alternative.
- Browser test used fictional QA details and intercepted `window.open`, so no WhatsApp message was sent. Verified the exact destination and all eight fields, including Unicode, line breaks, ampersands and plus signs. Required-field validation blocked an empty form.
- The browser's security policy blocked the email-app navigation. Read-only inspection verified the fallback's recipient, subject and encoded body. No alternate launch was attempted. External email launch and delivery remain untested; no telephone call was placed.
- Removed unverified same-day/fastest-reply promises, contact-page workshop size/address/map and stated visiting hours. Contact copy asks visitors to agree visit details, consultation/survey/design/sample fees and any order credit before booking. The existing staging CTA already omitted the live site's free-consultation promise.
- Shared footer no longer advertises workshop size or an unconfirmed map location. Shared business description is neutral about facility ownership. Business structured data omits workshop address and opening hours until confirmed; restore those fields from approved business details, keeping contact copy consistent.
- Fixed delegated contact tracking so `link_url` excludes query strings containing prepared message details. Preserved existing event names and contact methods. A targeted test of the actual event handler confirmed email, WhatsApp and telephone events, with no prepared message text in the payload. These events represent contact intent, not confirmed delivery.

### Validation and release status

- Production build (including TypeScript/build lint) and export verification passed. Existing raw-image performance recommendations remain.
- All three revised pages passed local-link/image existence checks, unique IDs, one H1, and checks excluding the withdrawn workshop-size, free-consultation and fixed-duration claims. Both service pages retain matching FAQ data/schema, self canonicals and quotation anchors.
- Browser checked all three pages at 1440, 820 and 390 pixels: no horizontal overflow or broken loaded images. Kitchen FAQ opened by click and collapsed with Enter. No console errors were captured.
- Service sitemap revision dates and the contact revision date are 4 November 2026. No deployment or indexing request was made. Existing unrelated header/layout/style changes in the checkout were preserved.

### Business confirmation still required

The user approved Halo's joinery page as the costing source, as recorded above. Other confirmations have not been received. Before using the remaining claims, obtain:

1. Workshop ownership/entity, size, full address, visiting hours and visit arrangements.
2. For one real wardrobe and one real kitchen: approved photo filenames, permission to publish, project identifier/community, date, exact scope and confirmed materials/fittings. Confirm whether each image is a finished project photograph or a design/render reference.
3. Current construction systems, board types/thicknesses, finishes, hardware brands/models and supported moisture/performance claims.
4. Detailed design, technical drawing and sample fees; any further survey/service charges beyond the approved free initial visit; payment stages; realistic programme and conditions. The initial consultation/site visit/scope-review offer is approved through the source above.
5. Written workmanship/component warranties, durations, exclusions, care requirements and claim procedure. Do not assume Halo's guarantee applies to Joinery contracts.
6. Ownership and routing of the published phone, WhatsApp and email; a business-side receipt test for enquiries and the intended meaning of conversion events.

Other pages still contain legacy workshop, experience, project-count and material claims, including About and repair. Their earlier evidence checklist below remains open; this follow-up does not verify those claims or the portfolio's wider provenance.

---

Review date: 3 November 2026 (Asia/Colombo).

Status: implemented in this staging checkout; production export built and verified. Not deployed. The process-section visual follow-up below was checked using the existing local development server. A complete enquiry-send test is still outstanding.

## Service page visual balance review

- Reviewed all eleven bespoke service detail pages and the maintenance/repair page in the browser, plus the services index on desktop. Checked every detail page at 1440px desktop, 820px tablet and 390px mobile widths.
- Added forty service-specific FAQs across the nine pages that previously had only two or three questions. Each bespoke service now has at least seven questions; kitchens retains eight and repair retains eleven. The additions cover practical planning and scope without introducing fixed prices, lead times or warranty promises.
- Reduced FAQ images to a compact 16:9 format, capped their desktop width and aligned the columns at the top. The left column remains sticky on desktop and returns to normal flow on smaller screens.
- Made service gallery captions visible without hovering, including on touch screens. Shared process cards now align image, heading, divider and body rows even when headings wrap; the tablet fifth card retains its image-and-text layout.
- Changed the repair page's mobile information strip from four stacked rows to a compact two-by-two grid.
- All twelve detail pages passed tablet/mobile horizontal-overflow checks. On every detail page, opening a second FAQ closed the first, Enter collapsed the open answer, and Enter reopened an answer. All eighty-nine rendered question/answer pairs matched their FAQ structured data and retained linked accessibility IDs.
- Full desktop review screenshots, mobile FAQ review sheets and browser measurements were saved under `/tmp/joinery-service-visual-review/`. Production build and export verification were run in an isolated temporary copy. Changes remain local; not deployed.

## FAQ image and accordion follow-up

- Reused the site's accordion component on all eleven bespoke service pages, with a relevant catalogue image below the left-hand heading. Added the image to the repair page's existing accordion too.
- One answer opens at a time; clicking the open question collapses it. Buttons include linked answer IDs, expanded state, keyboard support, visible focus treatment and reduced-motion handling. Collapsed answers remain in the document, with accessibility visibility matching the open state.
- Desktop, mobile and tablet layouts checked. Browser tests confirmed opening another answer closes the previous one, all answers can be collapsed, and Enter opens an answer. No horizontal overflow in the checked widths.
- A separate production build and SEO verification passed. Static checks verified an FAQ image, matching accordion question count, linked answer IDs and unchanged question/answer text against FAQ schema on all twelve service pages.

## Process section design follow-up

- Added relevant catalogue images to every process card, retaining the wardrobe and kitchen process copy.
- Added the shared dark process section after the gallery on all eleven bespoke service pages. Other service categories use the existing five-stage joinery workflow and a category-specific final image.
- Added images to the repair page's four existing process steps; its separate dark workshop section remains in the middle of the page. Repair process copy and HowTo structured data are retained.
- Reused existing typography, colours and responsive image handling. Images are lazy loaded with size-specific sources. Existing FAQs, galleries/lightbox, contact routes and tracking code were not changed in this follow-up.
- Desktop, tablet and mobile process layouts inspected at 1920, 820 and 390 pixels. No horizontal overflow found in the checked pages. Wardrobes, kitchens, doors and repair were sampled in the browser; the tablet fifth step spans the final row as an image-and-text card.
- Separate production build and `verify:prod` passed in `/tmp` so the user's running development server was not interrupted. Static checks passed on all twelve service detail pages for process images, dark middle sections, one H1, FAQ schema and WhatsApp/telephone routes. No console errors appeared in the browser checks.

## Pages changed

- `/`: added designer-led versus direct-customer brief guidance and quotation inputs; made the commercial Dubai offer clearer; replaced universal material and lifetime claims with specification guidance. Replaced unverified headline statistics with measure/make/install stages. Reused matching catalogue process images, without claiming they establish a new project case study.
- `/services/wardrobes`: added construction, finish and hardware decisions; a five-stage measure-to-install process; scope and price factors; quotation inputs; conditional scheduling and written warranty guidance. Retained the six-image grid and portfolio route, with captions visible on touch screens.
- `/services/kitchens`: added cabinetry construction, sink-unit moisture considerations, worktops, hardware, appliances and service interfaces; manufacturing and installation stages; inclusions and related trades; quote inputs and expanded FAQs. Replaced the breakfast-bar hero with the existing L-shaped kitchen image. Retained the six-image grid and portfolio route and replaced numbered kitchen captions with descriptive labels.
- Shared: replaced the unconfirmed free-consultation promise with a project discussion CTA. Updated the About page's material guarantee wording so it does not contradict the revised homepage. Existing partner and testimonial sections, contact form, WhatsApp, telephone and tracking event handlers are retained.

Existing service URLs, page titles, primary keyword phrases, self canonicals, breadcrumbs, image schema and existing gallery/lightbox implementation are retained. FAQ schema is generated from the same revised FAQs that appear on the page.

## Indexing and tracking safeguards

- Production build remains pinned to `https://joinery.ae`; staging crawl protection remains in place.
- Verification now requires every exported page's canonical to match its own URL and rejects accidental `noindex` or `nofollow`. It also checks that the wardrobe and kitchen URLs are in the sitemap and linked from the homepage.
- Sitemap revision dates are explicit for revised pages; unrelated URLs no longer get a fresh revision date on every build.
- The live site's public GTM container is `GTM-PZX988T7`. Its loaded tags include Google Ads `AW-16525337569` and GA4 `G-NE8YN7TPSH`. Live inline setup showed GTM, with downstream tags loaded through it. No direct duplicate Ads configuration was added.
- `npm run build:prod` defaults to that existing GTM container when the shell does not supply an override. Local builds still use the existing production-origin gating. Production hosting environment values should match the live configuration.

## Search Console follow-up

- The submitted `https://joinery.ae/sitemap.xml` reports **Success**, last read **1 November 2026**, with **17 discovered pages**. No duplicate sitemap submission was made.
- The earlier review showed both service URLs as discovered but not indexed. A fresh wardrobe inspection during this implementation reported **URL is unknown to Google**, no referring sitemap detected and no recorded crawl. This specific URL report differs from the sitemap overview; neither establishes successful indexing.
- Requested indexing for the wardrobe URL. Google returned **We had a problem submitting your indexing request** and **Could not connect to the reCAPTCHA service**. The request was **not completed**. Further individual requests were not repeated against the same failing service.
- The previous kitchen live test passed availability/indexability. This is not proof that it has entered Google's index.
- After release and visual QA, retry the individual requests for both live service URLs when Google's service is working. Check URL Inspection for a recorded crawl and indexing result; keep absent device rankings as no data until impressions are reported.

## Evidence still needed from the client

Do not invent prices, brands, warranty periods, locations, completion dates or project attribution to fill these gaps.

### Business and offer facts

- [ ] Verify the published 15,000 sq.ft. workshop size, address and business/entity attribution.
- [ ] Supply evidence for 25+ years, 1,000+ projects and 200 staff before restoring the homepage's numeric credentials. Those existing values still occur on the About page and require a later verified review.
- [ ] Confirm approved testimonials and developer relationships represented by the retained sections.
- [ ] Confirm consultation, survey and design fees, payment terms and site visit arrangements.
- [ ] Confirm actual construction materials, board thicknesses, finish choices and hardware brands/models offered.
- [ ] Confirm workmanship and component warranty terms, exclusions, care instructions and supported material-performance documents.
- [ ] Confirm realistic production/installation ranges and the conditions that affect them.

### Wardrobe evidence

- [ ] Approved project/community name, completion date and exact scope for at least one wardrobe example.
- [ ] Confirmed carcass, fronts, finish, hardware and accessories for that example.
- [ ] Matching photos of open interiors, hinges, tracks, drawer runners, edge treatment and installation details.
- [ ] Confirm electrical/lighting responsibility, removals, making good and building access scope.

### Kitchen evidence

- [ ] Approved project/community name, completion date and exact cabinetry scope for at least one kitchen example.
- [ ] Confirmed cabinet and worktop specifications, hardware and appliance interfaces.
- [ ] Matching photos of cabinet interiors, pantry mechanisms, runners, sink-unit construction and installation.
- [ ] Confirm inclusion/ownership of stone, appliances, plumbing, electrical work, extraction, demolition, finishes and approvals.

Existing images were reused descriptively. Their presence is not independent verification of project ownership or provenance. Named case studies, location captions and new documentary claims remain pending the facts and matching approved photography above.

## Validation completed

- `npm run build:prod`: passed, including TypeScript and the build's lint stage. Only the existing Next.js recommendations about raw image elements remained.
- `npm run verify:prod`: passed; 18 exported HTML pages, 17 sitemap URLs, production canonicals, crawlable robots and current GTM included.
- On the three target pages: 241 link references and 162 image references checked for resolvable local destinations/assets; quotation anchors, one H1 per page, telephone/WhatsApp routes and schema checked.
- Revised service FAQs were checked against their structured-data answers.
- Deployment guard tested by temporarily substituting a homepage canonical and an accidental noindex in the wardrobe export: both rejected. Original export restored and verification passed.
- `git diff --check`: passed.

## Release steps

1. Run desktop, tablet and phone browser QA in an environment that can serve the site: spacing, overflow, gallery captions, hero-to-quote anchors, portfolio filters/lightbox and enquiry routes. No successful send or conversion receipt is claimed by this static review.
2. Publish the reviewed changes through the existing production workflow with the production URL and current GTM configuration.
3. Retry the two individual indexing requests after Google's reCAPTCHA service is available, then verify actual crawl/index status.
4. Add documented case studies when the approved project facts and photos arrive.

Reference: [Google Page indexing guidance](https://support.google.com/webmasters/answer/7440203).
