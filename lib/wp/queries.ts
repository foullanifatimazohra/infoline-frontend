/**
 * GraphQL documents, verbatim from the handover §5 (plus listing/hub variants
 * verified against the live endpoint). Field/type names are frozen per §8 —
 * if the backend announces a change, it changes here first.
 */

/* --------------------------------- Service -------------------------------- */

export const SERVICE_BY_URI = /* GraphQL */ `
  query ServiceByUri($uri: ID!) {
    service(id: $uri, idType: URI) {
      title
      uri
      serviceCoreContent {
        problemStatement
        serviceImage {
          node {
            sourceUrl
            altText
          }
        }
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
        relatedCaseStudy {
          nodes {
            ... on CaseStudy {
              title
              uri
            }
          }
        }
        faqs {
          question
          answer
        }
        ctaHeading
        ctaDescription
        ctaLabel
        ctaUrl
      }
      pillars {
        nodes {
          name
          slug
        }
      }
      sectors {
        nodes {
          name
          slug
        }
      }
    }
  }
`;

export const SERVICES_LIST = /* GraphQL */ `
  query Services($first: Int = 12, $after: String, $language: LanguageCodeFilterEnum) {
    services(first: $first, after: $after, where: { language: $language }) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        title
        uri
        pillars {
          nodes {
            name
            slug
          }
        }
        serviceCoreContent {
          problemStatement
        }
      }
    }
  }
`;

/* ------------------------------- Case study ------------------------------- */

export const CASE_STUDY_BY_URI = /* GraphQL */ `
  query CaseStudyByUri($uri: ID!) {
    caseStudy(id: $uri, idType: URI) {
      title
      uri
      industrySectors {
        nodes {
          name
          slug
        }
      }
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
        heroImage {
          node {
            sourceUrl
            altText
          }
        }
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
        relatedServices {
          nodes {
            ... on Service {
              title
              uri
            }
          }
        }
      }
    }
  }
`;

/* ---------------------------- Solution / pillar --------------------------- */

export const SOLUTION_BY_URI = /* GraphQL */ `
  query SolutionByUri($uri: ID!) {
    solution(id: $uri, idType: URI) {
      title
      uri
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
`;

/* -------------------------------- Industry -------------------------------- */

export const INDUSTRY_BY_URI = /* GraphQL */ `
  query IndustryByUri($uri: ID!) {
    industry(id: $uri, idType: URI) {
      title
      uri
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
`;

/* --------------------------------- Clients -------------------------------- */

export const CAREERS_LIST = /* GraphQL */ `
  query Careers($first: Int, $language: LanguageCodeFilterEnum) {
    careers(first: $first, where: { language: $language }) {
      nodes {
        title
        slug
        uri
        date
      }
    }
  }
`;

export const CLIENTS = /* GraphQL */ `
  query Clients($language: LanguageCodeFilterEnum) {
    clients(first: 100, where: { language: $language }) {
      nodes {
        id
        databaseId
        slug
        title
        content {
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
`;

/* ---------------------------- Hubs / options ------------------------------ */

/**
 * NOTE: `hubHeadin` (no `g`) is the real field name in the live schema —
 * verified against the endpoint. It is a typo in the CMS, not here.
 */
export const HUBS = /* GraphQL */ `
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
`;
