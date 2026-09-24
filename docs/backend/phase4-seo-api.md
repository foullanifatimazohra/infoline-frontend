# Infoline — SEO API Handover
**Phase 4 · SEO** · Backend: Amir Adel · For: Frontend · Issued: 22 Sep 2026

SEO metadata is exposed on every post type, in both languages. Field names below were read from the live schema, and the values were checked against real content. Connection details from the Phase 1 handover still apply.

## 1. What is exposed

Yoast SEO is bridged into GraphQL, so every content node carries an `seo` object alongside its ACF fields. Nothing new needs to be connected — add `seo { … }` to any query you already have.

| | |
|---|---|
| Source | Yoast SEO, exposed through the WPGraphQL Yoast SEO Addon |
| Available on | Services, Solutions, Case Studies, Industries, Careers, Pages |
| Languages | Both — the seo object follows the language of the node |
| Redirects | None required — see section 6 |

## 2. The seo object

The fields you will actually use:

| Field | Use it for |
|---|---|
| title | The `<title>` tag |
| metaDesc | `<meta name="description">` |
| canonical | `<link rel="canonical">` |
| metaRobotsNoindex | `noindex` or `index` |
| metaRobotsNofollow | `nofollow` or `follow` |
| opengraphTitle | `og:title` |
| opengraphDescription | `og:description` |
| opengraphImage | `og:image` — an image node, use `sourceUrl` |
| schema { raw } | JSON-LD, as a ready-made string |
| breadcrumbs | Breadcrumb trail, as structured data you can render |
| fullHead | Every head tag Yoast would output, as one HTML string |

Also present: `focuskw`, `cornerstone`, `metaKeywords`, `opengraphType`, `opengraphSiteName`, `twitterTitle`, `twitterDescription`, `twitterImage`, `analysis`, `objectLastModified`.

## 3. Two ways to render the head

### Field by field — recommended

Map each field onto Next.js metadata yourself. More code, but you control every tag and can override anything.

### fullHead — the shortcut

`fullHead` returns the entire head block Yoast would have printed, as one HTML string. Inject it and you are done — but you cannot selectively override a tag, and you are injecting raw HTML.

Pick one and use it consistently. Mixing them produces duplicate tags, which is worse than either approach alone.

## 4. Read this before writing code

### Every page currently returns noindex

This is the single most important line in this document.

```json
"metaRobotsNoindex": "noindex"
```

Search engine visibility is switched off site-wide while we are in development, and Yoast reflects that on every node. This is expected right now and will change at launch.

Build the robots tag from the field rather than hardcoding index — when the setting flips at launch, your pages become indexable with no frontend change. But do not be surprised by noindex in testing, and do not treat it as a bug.

### Descriptions are empty

`metaDesc` and `opengraphDescription` come back as empty strings on all content, because no meta descriptions have been written yet. That is a content task, not a technical one.

Handle an empty description gracefully — either omit the tag or fall back to something sensible from the content. Do not render an empty `<meta name="description" content="">`.

### Empty string, not null

Unlike the ACF fields in the Phase 1 handover, Yoast fields return `""` when unset, not null. Check for falsy values rather than null specifically.

### URLs still point at the staging domain

Every absolute URL — canonical, the schema graph, breadcrumb items — currently carries the staging host:

```
https://green-tarsier-764009.hostingersite.com/services/omnichannel-platform/
```

These are corrected on my side when the site moves to its production domain. Do not rewrite them in the frontend — you would then have to undo it later. If you need absolute URLs before then, build them from your own site URL and the node's `uri`.

### Titles carry the site name already

`seo.title` returns `Omnichannel Platform - Infoline`, with the site name appended by Yoast's template. Do not append it again.

### The language is already correct

The seo object follows the language of the node it sits on. An Arabic node returns Arabic title and description, with no extra argument. Verified on live content.

## 5. Ready queries

### A page with its SEO

```graphql
query ServiceWithSeo($uri: ID!) {
  service(id: $uri, idType: URI) {
    title
    uri
    seo {
      title
      metaDesc
      canonical
      metaRobotsNoindex
      metaRobotsNofollow
      opengraphTitle
      opengraphDescription
      opengraphImage { sourceUrl altText }
      schema { raw }
    }
  }
}
```

### The fullHead shortcut

```graphql
query ServiceHead($uri: ID!) {
  service(id: $uri, idType: URI) {
    seo { fullHead }
  }
}
```

### Breadcrumbs

```graphql
query ServiceBreadcrumbs($uri: ID!) {
  service(id: $uri, idType: URI) {
    seo {
      breadcrumbs { text url }
      breadcrumbTitle
    }
  }
}
```

### SEO plus the translation link, for hreflang

```graphql
query ServiceSeoAndAlternates($uri: ID!) {
  service(id: $uri, idType: URI) {
    uri
    language { code }
    translations { uri language { code } }
    seo { title metaDesc canonical }
  }
}
```

### Rendering the JSON-LD

`schema.raw` is a JSON string, not an object. Inject it as-is:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: seo.schema.raw }}
/>
```

It already contains a `@graph` with WebPage, BreadcrumbList and WebSite. Do not parse and rebuild it, and do not add a second JSON-LD block for the same entities.

## 6. hreflang and redirects

### hreflang — build it from translations

There is no dedicated hreflang field. Use the `translations` field from the Phase 2 handover: it gives you the other language's uri directly.

For a page with an Arabic translation, output one alternate per language plus `x-default`. For a page with no translation, output only its own language — `translations` comes back empty and that is the signal.

Do not construct the Arabic URL by prefixing the English one with `/ar/`. Arabic slugs differ, as covered in the Phase 2 handover.

### Redirects — none needed

The URL structure of the rebuild matches the existing site, so no 301 map is required and nothing is exposed through the API for it.

If that turns out to be wrong — if the client's indexed URLs differ from the new ones — the cleanest place to handle it is `next.config.js` on your side rather than in WordPress. Tell me if you find a mismatch and we will decide together.

## 7. Suggested test pass

1. Render a service page and confirm title, canonical and the JSON-LD block appear in view-source.
2. Confirm the robots tag reads noindex and comes from the field, not a hardcoded value.
3. Render the Arabic version of the same page and confirm the title and description are Arabic.
4. Render a page with an empty metaDesc and confirm no empty description tag is emitted.
5. Validate the JSON-LD with Google's Rich Results Test. The staging URLs inside it are expected.
6. Render a page that has a translation and one that does not, and confirm hreflang is correct in both cases.
7. Confirm you are not emitting duplicate tags — pick either the field-by-field approach or fullHead, never both.

## 8. Not ready yet

| Status | Owner |
|---|---|
| Site-wide indexing | Off — every page returns noindex. Switches on at launch — Me, at launch |
| Meta descriptions | Empty across all content — Client / content |
| Production domain in URLs | Still the staging host in canonical and schema — Me, at cutover |
| Organisation schema | Not configured — no logo, social profiles or contact details in the graph — Me |
| JobPosting schema for careers | Not configured — Me |
| XML sitemaps | Yoast generates them on the WordPress side; not yet decided how they are served from the frontend — To decide |
| 301 redirect map | Not required — URL structure unchanged. To be confirmed against the client's indexed URLs — Client to confirm |

## 9. Change control

Field names come from Yoast and the WPGraphQL bridge, so they are stable and not something I will rename.

What will change, and I will tell you before it lands:

1. `metaRobotsNoindex` flips to `index` at launch. If you read it from the field, nothing breaks.
2. Absolute URLs switch to the production domain at cutover. Same — if you use them as given, nothing breaks.

Both are reasons to read these values from the API rather than hardcoding them.

## 10. Tell me if you hit these

- A page where `seo` comes back null rather than an object with empty strings.
- JSON-LD that fails validation for a reason other than the staging domain.
- An Arabic page returning English metadata.
- A tag the design or a stakeholder needs that Yoast is not providing.
- Any indexed URL on the current live site that does not match a URL in the rebuild — that is the redirect question, and it is cheaper to find now than after launch.
