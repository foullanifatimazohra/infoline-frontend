# Company Demo — Deployment Audit

Read-only audit of the company-hosted Demo against the latest approved frontend source.

**Target:** https://demo.infoline.om/
**Approved source:** branch `feature/home-2-redesign`, commit `a7bff33` (2026-11-08)
**Audit date:** 2026-11-09
**Method:** HTTP requests, local Git history, desktop Chrome, and 390px same-origin iframe (verified `innerWidth` 390, `(max-width:767px)` matched).

Evidence labels: **CONFIRMED** (observed or measured), **INFERRED** (indirect, from source or bundles), **NOT VERIFIED** (not tested or insufficient evidence).

## 1. Executive Summary

- **Assessment:** the Demo appears current. Everything verified matches the approved implementation.
- **Confidence:** medium-high.
- **Confirmed regressions:** none.
- **Limitations:** the deployed SHA cannot be established, the protected Preview could not be compared side by side, and several features were not checked (section 5).

## 2. Deployment Identity

| Item | Result |
| --- | --- |
| Hosting | Cloudflare in front of a self-hosted Node.js app (`ss-product-id: paas-nodejs-v1`), not Vercel. CONFIRMED |
| Caching | HTML served `no-store`, `cf-cache-status: DYNAMIC`. CONFIRMED |
| Latest approved SHA | `a7bff33` |
| Deployed SHA | **UNKNOWN**. No commit SHA, `dpl_` ID or readable build ID is exposed. |

The milestone is INFERRED from feature markers and shipped bundles. A specific SHA is not inferred from feature presence.

**Evidence required from IT**

- The commit SHA or CI/deployment record for the build running behind `demo.infoline.om`.
- `.next/BUILD_ID` or the build log, plus deployment timestamp and source branch.
- Confirmation that the build used the same environment values as the Preview.
- Optional: an `x-build-sha` header or `/version` endpoint on a future deploy.

## 3. Feature Verification

| Feature | Result | Evidence |
| --- | --- | --- |
| Homepage: four statistics and "Customer transactions a year" | PASS | CONFIRMED in EN desktop: 22 yrs, 68, 400+, 6M+. AR renders four statistics. |
| Homepage: company year 2004 | PASS | CONFIRMED EN and AR. At 390px the Arabic label is one line (24px high, 24px line-height); EN wraps to two lines as in the desktop render. |
| Solutions: mobile accordion | PASS | CONFIRMED at 390px: 8 `aria-expanded` items, no `role="tab"`, no overflow. Clicking item 03 opened it and closed 01; the panel follows its row in the DOM. EN only; the AR accordion was not clicked. |
| Solutions: ninth service | PASS | CONFIRMED: "Managed Branch & Retail Services" is a separate link to `/en/solutions/managed-branch-retail` in the hero index and catalogue (EN and AR). The page loads at 390px. Matches source (`hero.tsx`, `managed-branch.tsx`). |
| Industries mobile cards (homepage) and RTL icons | PASS | CONFIRMED at 390px in EN and AR: icon 40px, 21px from the start edge, vertically centred when collapsed, same side when expanded; titles wrap to 1-2 lines; no overflow. A 2px `scrollHeight` flag in Arabic has no visible clipping in the screenshot. |
| Partners marquee and mobile sizing | PASS | CONFIRMED: pills measure 100×44px, marquee moves (first logo −72px to −115px in 2s, EN). NOT VERIFIED at 375px. AR marquee motion not re-tested. |
| About: Omanisation year 2026 | PASS | CONFIRMED in served HTML. |
| Careers: controls | PASS | CONFIRMED EN and AR at 390px: four disabled Apply buttons, one line each (AR label "قدّم الآن"), disabled Talent Network button, no `<form>`. |
| Video closing bands | PASS (partial) | CONFIRMED: Case Studies band video plays (`paused: false`, no media error) and the MP4 is served (200/206). INFERRED for About, Insights, Industries and Careers: component and asset are in the shipped JS, but the lazily loaded video was not observed on each page. |
| Case Studies overlay `#1C97D4` at 16% | INFERRED | `bg-[#1c97d4]/16` is in the shipped JS. Computed colour NOT VERIFIED. |
| Typography | PARTIAL | CONFIRMED: home hero H1 weight 900; body font Avenir (EN), Tajawal (AR). Heading weights on other pages NOT VERIFIED. |
| EN/AR responsive | PASS within scope | `lang`/`dir` correct, no horizontal overflow, no visible Next.js error overlay at 390px (EN and AR) on the pages listed above. |

## 4. Asset and Runtime Health

- **Next.js assets:** all 27 distinct `/_next/static` JS and CSS files linked from the fetched pages returned 200. No old-HTML/new-JS mismatch observed. CONFIRMED.
- **Images and video:** 80 home-page `/assets/*` images returned 200 (one timeout, `partners/fluentgrid.png`, returned 200 on retry). The closing-band MP4 is served as `video/mp4`. No broken images in the 390px iframe checks. CONFIRMED.
- **Routing:** `/` redirects 307 to `/en`; `/ar`, `/en/solutions`, `/en/about`, `/en/insights`, `/en/industries`, `/en/case-studies`, `/en/careers`, `/ar/careers` return 200. `/en/zzz` returns 200 (soft 404, a known decision recorded in commit `26997aa`). CONFIRMED.
- **Hidden `/logo.png` element:** top-level pages contained one `<img src="/logo.png" alt="">` as a direct child of `<body>`, `display: none`. It is absent from served HTML, JSON-LD, resource timing and the repository, and absent in iframe loads. The URL returns 404. Classified as **probable browser-extension injection, not a confirmed application defect** (INFERRED; the injecting extension was not identified). The real logo loads from `assets/logo.svg` (200).
- **Console and hydration errors:** NOT VERIFIED.

## 5. Known Limitations

- No verified deployed commit SHA.
- No authenticated side-by-side comparison with the protected Preview (returns 302).
- Not checked: Insights background pattern, animated Case Studies counters, About Scale & Credentials placeholder, heading weights beyond home, console and hydration errors, 375px viewport, AR Solutions accordion interaction, `/industries` page icons.
- No evidence of complete pixel-perfect parity. No screenshot diff was run.

## 6. Outstanding Client Dependencies

- Final English content approval.
- Approved Arabic translations.
- About Scale & Credentials content.
- Four Careers application destinations (Apply buttons remain disabled).
- Talent Network destination (remains disabled).

## 7. Final Verdict

| Item | Verdict |
| --- | --- |
| Feature parity | PASS within the verified scope |
| Confirmed regressions | None |
| Exact deployment identity | UNVERIFIED |
| Confidence | Medium-high |

Commit `a7bff33` is not claimed to be deployed; only that the Demo's observable behaviour matches it within the scope above.
