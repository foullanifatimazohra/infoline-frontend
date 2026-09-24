# Infoline — WPGraphQL API Handover
**Phase 1 · English only** · Backend: Amir Adel · For: Frontend · Issued: 7 Sep 2026

The API is ready for integration testing. Everything below has been verified against live seed content, not assumed.

## 1. Connection

| | |
|---|---|
| Endpoint | `https://green-tarsier-764009.hostingersite.com/graphql` |
| Method | POST, `Content-Type: application/json` |
| Auth | None required for published content |
| Explorer | GraphQL IDE in wp-admin — login sent separately |

Verified reachable from outside the server. In the IDE, Ctrl+Space autocompletes fields and Docs opens the full schema.

Responses currently include an `extensions.debug` block. That is the dev debug mode and will be switched off before production — ignore it.

## 2. What is exposed

### Post types

| Content | Single | Plural | ACF groups |
|---|---|---|---|
| Services | `service` | `services` | serviceCoreContent, serviceProof |
| Solutions (pillars) | `solution` | `solutions` | solutionContent |
| Case Studies | `caseStudy` | `caseStudies` | caseStudyCoreContent
| Industries | `industry` | `industries` | industryCoreContent |
| Clients | `Client` | `Clients` | clientContent |
| Careers | `career` | `careers` | CareersCoreContent |
| Documents | `document` | `documents` | documentContent |

### Taxonomies

| On | Field | Terms |
|---|---|---|
| Service | `pillars` | 3 pillars |
| Service | `sectors` | 7 sectors |
| Case Study | `industrySectors` | 7 sectors |
| Document | `documentTypes` | 4 types |

### Options pages (hub / global content)

| Root field | ACF group |
|---|---|
| caseStudiesSettings | caseStudiesHub |
| industriesHubSettings | industriesHub |
| solutionsSettings | solutionsHubSettings |
| aboutSettings | companyProfile |

## 3. Read this before writing code

### Empty values are not consistent

This is the one thing most likely to break a build. Verified against live data:

| Field type | When empty returns |
|---|---|
| ACF repeater | null |
| ACF relationship | null |
| ACF text / textarea | null |
| Taxonomy connection | `{ "nodes": [] }` |

So guard every ACF field:

```ts
(service.serviceCoreContent.approachSteps ?? []).map(...)
```

Taxonomies are safe to map directly.

### Nothing is required

No field is marked required in the CMS, so an editor can publish an entry with every field empty — and one seed entry is exactly that. Treat every ACF field as nullable, including on published content.

### Relationship order is not guaranteed

Items come back in a different order than they were set in the admin. Do not rely on the returned order for anything the design depends on — tell me if you need a guaranteed order and I will handle it in the model.

### Naming

ACF field names are snake_case in the admin and camelCase in GraphQL: `problem_statement` → `problemStatement`.

Field types map as:

- image → `{ node { sourceUrl altText } }`
- repeater → list of objects with its sub-fields
- relationship → `{ nodes { ... on Service { title uri } } }`

### Two model notes

`solutionContent.services` is a plain text repeater, not a relationship — the pillar cards cannot link through to service pages yet. Flag it if the design needs real links and I will change it.

`results` exists in two groups with different sub-fields, deliberately:

- `caseStudyCoreContent.results` → `measure, before, after`
- `serviceProof.results` → `result, metricName, clientDescription`

They are separate GraphQL types. Don't share a component between them without checking.

### File sizes come back in bytes

`fileSize` on a file node is a raw byte count — 253676, not "253 KB". Format it on the frontend so Arabic and English each render their own number formatting.

If a file has not been uploaded, the whole node is null. Check the node before reading `mediaItemUrl`, or the download card will throw.

## 4. Seed content

16 entries, all published. Edge cases are intentional — they exist to break the layout early.

| Type | Entries | Edge case included |
|---|---|---|
| Services | 5 | Quality & Analytics — every repeater empty, no image; one 100-char title with 10-row repeaters |
| Solutions | 4 | Empty Pillar — empty services repeater |
| Case Studies | 3 | Minimal case study — every field null, no taxonomy, no relationships |
| Industries | 4 | Empty Industry — all repeaters empty |

Only *Cutting average handle time for a national utility* has relationships set. The others return null on purpose.

Content is placeholder, not client copy. Figures are written as `[RESULT: -00%]` because the wireframes deliberately carry no invented client metrics. Everything is deleted before production.

## 5. Ready queries

### Service (single)

```graphql
query ServiceByUri($uri: ID!) {
  service(id: $uri, idType: URI) {
    title
    uri
    serviceCoreContent {
      problemStatement
      serviceImage { node { sourceUrl altText } }
      expertCtaLabel
      expertCtaUrl
      faqCtaLabel
      faqCtaUrl
      approachSteps {
        title
        description
      }
      capabilities {
        capability
      }
    }
    serviceProof {
      results {
        result
        metricName
        clientDescription
      }
      relatedCaseStudy { nodes { ... on CaseStudy { title uri } } }
      faqs {
        question
        answer
      }
      ctaHeading
      ctaDescription
      ctaLabel
      ctaUrl
    }
  }
}
```

Variables: `{ "uri": "/services/contact-centre-outsourcing/" }`

### Services (listing)

```graphql
query Services($first: Int = 12, $after: String) {
  services(first: $first, after: $after) {
    pageInfo { hasNextPage endCursor }
    nodes {
      title
      uri
      pillars { nodes { name slug } }
      serviceCoreContent { problemStatement }
    }
  }
}
```

### Case study (single)

```graphql
query CaseStudyByUri($uri: ID!) {
  caseStudy(id: $uri, idType: URI) {
    title
    uri
    industrySectors { nodes { name slug } }
    caseStudyCoreContent {
      featuredResult
      resultMetric
      clientName
      engagementLength
      scale
      heroMetrics {
        metric
        measure
      }
      heroImage { node { sourceUrl altText } }
      challenge
      approach
      results {
        measure
        before
        after
      }
      clientQuote
      quoteName
      quoteTitle
      quoteOrganisation
      ctaHeading
      ctaDescription
      ctaLabel
      ctaUrl
      relatedServices { nodes { ... on Service { title uri } } }
    }
  }
}
```

### Solution / pillar (single)

```graphql
query SolutionByUri($uri: ID!) {
  solution(id: $uri, idType: URI) {
    title
    uri
    solutionContent {
      icon { node { sourceUrl altText } }
      pillarLabel
      problemStatement
      services {
        service
      }
      ctaLabel
      ctaUrl
    }
  }
}
```

### All Solution Posts

```graphql
query SolutionsValidation {
  solutions(first: 100) {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      databaseId
      title
      slug
      uri
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      solutionContent {
        icon {
          node {
            sourceUrl
            altText
          }
        }
        pillarLabel
        problemStatement
        services {
          service
        }
        ctaLabel
        ctaUrl
      }
    }
  }
}
```

### Full Solution Post — CX Operations

```graphql
query {
  solution(
    id: "/solutions/cx-operations/"
    idType: URI
  ) {
    databaseId
    title
    slug
    uri
    featuredImage {
      node {
        sourceUrl
        altText
      }
    }
    solutionContent {
      icon {
        node {
          sourceUrl
          altText
        }
      }
      pillarLabel
      problemStatement
      services {
        service
      }
      ctaLabel
      ctaUrl
    }
  }
}
```

### Page Settings — SolutionsHubSettings

```graphql
query SolutionsSettingsValidation {
  solutionsSettings {
    solutionsHubSettings {
      solutionsHeading
      solutionsIntro
    }
  }
}
```

### Industry (single)

```graphql
query IndustryByUri($uri: ID!) {
  industry(id: $uri, idType: URI) {
    title
    uri
    industryCoreContent {
      industryIntro
      heroImage { node { sourceUrl altText } }
      ctaLabel
      ctaUrl
      procurementItems {
        itemTitle
        itemDescription
      }
      sectorServices {
        service { nodes { ... on Service { title uri } } }
        serviceDescription
      }
      securityFaqs {
        question
        answer
      }
      ctaHeading
      ctaDescription
      proofMetric
      proofPoint
    }
  }
}
```

### All Industry Posts

```graphql
query IndustriesValidation {
  industries(first: 100) {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      databaseId
      title
      slug
      uri
      content
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      industryCoreContent {
        industryIntro
        heroImage {
          node {
            sourceUrl
            altText
          }
        }
        ctaLabel
        ctaUrl
        procurementItems {
          itemTitle
          itemDescription
        }
        sectorServices {
          service {
            nodes {
              ... on Service {
                title
                uri
              }
            }
          }
          serviceDescription
        }
        securityFaqs {
          question
          answer
        }
        ctaHeading
        ctaDescription
        proofMetric
        proofPoint
      }
    }
  }
}
```

### Full Industry Post

```graphql
query {
  industry(
    id: "/industry/telecom-technology/"
    idType: URI
  ) {
    databaseId
    title
    slug
    uri
    content
    featuredImage {
      node {
        sourceUrl
        altText
      }
    }
    industryCoreContent {
      industryIntro
      heroImage {
        node {
          sourceUrl
          altText
        }
      }
      ctaLabel
      ctaUrl
      procurementItems {
        itemTitle
        itemDescription
      }
      sectorServices {
        service {
          nodes {
            ... on Service {
              databaseId
              title
              slug
              uri
            }
          }
        }
        serviceDescription
      }
      securityFaqs {
        question
        answer
      }
      ctaHeading
      ctaDescription
      proofMetric
      proofPoint
    }
  }
}
```

### Clients

```graphql
query ValidateClients {
  clients {
    nodes {
      id
      databaseId
      slug
      title
      clientContent {
        clientName
        clientLogo {
          node {
            id
            sourceUrl
            altText
          }
        }
      }
    }
  }
}
```

### Careers (listing)

```graphql
query Careers {
  careers(first: 50) {
    nodes {
      id
      databaseId
      slug
      title
      uri
      careersCoreContent {
        headline
        cultureStatement
        cultureImage { node { sourceUrl altText } }
        employeeVoices {
          quote
          name
          role
          employeePhoto { node { sourceUrl altText } }
        }
        benefits {
          benefit
        }
        portalDescription
        portalLabel
        portalUrl
        discipline
        location
        jobType
      }
    }
  }
}
```

For a single job, use `career(id: $uri, idType: URI)` with the same selection.

### Company profile downloads (About page)

```graphql
query CompanyProfile {
  aboutSettings {
    companyProfile {
      sectionHeading
      sectionIntro
      profileEnLabel
      profileEnFile { node { mediaItemUrl fileSize mimeType } }
      profileArLabel
      profileArFile { node { mediaItemUrl fileSize mimeType } }
    }
  }
}
```

### Media Center documents

```graphql
query Documents($first: Int = 20) {
  documents(first: $first, where: { language: EN }) {
    nodes {
      title
      uri
      documentTypes { nodes { name slug } }
      documentContent {
        documentFile { node { mediaItemUrl fileSize mimeType } }
        summary
        documentDate
        thumbnail { node { sourceUrl altText } }
      }
    }
  }
}
```

### Hub / global content

```graphql
query Hubs {
  caseStudiesSettings {
    caseStudiesHub {
      hubHeadin
      hubIntro
      ctaHeading
      ctaDescription
      ctaLabel
      ctaUrl
    }
  }
  industriesHubSettings {
    industriesHub {
      hubHeading
      hubIntro
      ctaHeading
      ctaDescription
      ctaLabel
      ctaUrl
    }
  }
  solutionsSettings {
    solutionsHubSettings {
      solutionsHeading
      solutionsIntro
    }
  }
}
```

## 6. Suggested test pass

1. Render a service page from *Contact Centre Outsourcing* — full content, all repeaters populated.
2. Render *Quality & Analytics* — every repeater is null. Nothing should throw.
3. Render the long-title RPO entry — 100+ character title, 10-row repeaters. Check wrapping and overflow.
4. Render *Minimal case study* — every field null. Nothing should throw.
5. Render the case studies listing with taxonomy filtering by `industrySectors`.
6. Render the solutions hub from `solutionsSettings` plus the four pillars.
7. Confirm *Cutting average handle time* shows its two related services.
8. Render the About page download cards, formatting `fileSize` into MB, and confirm a missing file degrades gracefully.

## 7. Not ready yet

| Status | |
|---|---|
| Arabic / WPML layer | Not configured — English only |
| Draft & preview mode | Auth not implemented; published content only |
| Forms (5) and Odoo integration | Not Ready |
| Media Center documents | Not Ready |
| Insights / FAQ post types | Not created |
| Careers fields | Post type exists, no field group |
| SEO metadata and redirects | Not exposed yet |

Please build routing so it can take a locale, even though we are English-only today. The Arabic layer is coming and this avoids a rework.

## 8. Change control

Field and type names are frozen as of this handover. Any change is announced before it lands, never silently. Schema definitions are in version control under `wp-content/mu-plugins/acf-json/`, so every change appears in the Git diff.

### Frozen names

Two things that would silently break your build, so they will not change:

1. Options page titles — the GraphQL root field name is derived from the page title.
2. ACF field names — renaming a field orphans its stored content.

## 9. Tell me if you hit these

- A field in the schema returning null when the admin clearly shows content.
- A uri that does not match the route you expect.
- CORS errors on client-side requests. Server-side fetches are unaffected; this has not been fully verified from a third-party origin yet.
- Any field you need that is not in the model. This is much cheaper to fix now than after templates are built.
