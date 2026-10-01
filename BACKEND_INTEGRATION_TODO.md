# Backend Integration - Component Updates

## ✅ Pages Updated (Fetching Data)
- ✅ `/solutions` → Fetches SOLUTIONS_QUERY
- ✅ `/industries` → Fetches INDUSTRIES_QUERY  
- ✅ `/about` → Fetches COMPANY_PROFILE_QUERY
- ✅ `/` (home) → Fetches CLIENTS_QUERY
- ✅ `/contact` → Fetches SERVICES_QUERY

## 📝 Components Needing Updates

### 1. **Solutions Page**

#### `components/sections/solutions/catalogue.tsx`
```tsx
// Change from:
const services = t.raw("catalogue.services") as Service[];

// To:
export default function Catalogue({ solutions }: { solutions: any[] }) {
  const mappedServices = solutions.map(s => ({
    id: s.slug,
    number: s.databaseId,
    title: s.title,
    image: s.featuredImage?.node?.sourceUrl,
    // ... map other fields
  }));
  // Use mappedServices instead of hardcoded services
}
```

---

### 2. **Industries Page**

#### `components/sections/industries/sectors.tsx`
```tsx
// Change from:
const sectors = t.raw("sectors.items") as Sector[];

// To:
export default function Sectors({ industries }: { industries: any[] }) {
  const mappedSectors = industries.map(i => ({
    id: i.slug,
    number: i.databaseId,
    title: i.title,
    image: i.featuredImage?.node?.sourceUrl,
    // ... map other fields from industryCoreContent
  }));
  // Use mappedSectors instead of hardcoded sectors
}
```

---

### 3. **About Page**

#### `components/sections/about/documents.tsx`
```tsx
// Change from:
const documents = t.raw("documents.list");

// To:
export default function Documents({ companyProfile }: { companyProfile: any }) {
  const downloads = [
    {
      label: companyProfile?.profileEnLabel,
      url: companyProfile?.profileEnFile?.node?.mediaItemUrl,
      size: companyProfile?.profileEnFile?.node?.fileSize,
    },
    {
      label: companyProfile?.profileArLabel,
      url: companyProfile?.profileArFile?.node?.mediaItemUrl,
      size: companyProfile?.profileArFile?.node?.fileSize,
    },
  ].filter(d => d.url); // Remove null entries
  
  // Format fileSize: bytes to MB
  // size / (1024 * 1024)
}
```

---

### 4. **Home Page**

#### `components/sections/home/partners-logos.tsx`
```tsx
// Change from:
const logos = t.raw("partners.logos");

// To:
export default function PartnersLogos({ clients }: { clients: any[] }) {
  const logos = clients.map(c => ({
    name: c.clientContent?.clientName,
    logo: c.clientContent?.clientLogo?.node?.sourceUrl,
    alt: c.clientContent?.clientLogo?.node?.altText,
  }));
  // Use logos in marquee/carousel
}
```

---

### 5. **Contact Forms**

#### `components/sections/contact/form.tsx`
```tsx
// Add form submission:
const handleSubmit = async (formData) => {
  const response = await graphqlRequest(SUBMIT_INQUIRY, {
    input: {
      action: "service_inquiry", // or project_inquiry, media_inquiry
      ...formData,
      website: "", // honeypot
      turnstileToken: "", // add Turnstile later
    }
  });
  
  if (response.submitInquiry.success) {
    // Show confirmation
  } else {
    // Show validation errors
    response.submitInquiry.validationErrors.forEach(err => {
      setFieldError(err.field, err.message);
    });
  }
};

// For job application (REST):
const handleJobSubmit = async (formData, cvFile) => {
  const form = new FormData();
  form.append('name', formData.name);
  form.append('email', formData.email);
  form.append('phone', formData.phone);
  form.append('position', roleTitle);
  form.append('message', formData.message);
  form.append('cv', cvFile);
  form.append('website', ''); // honeypot
  form.append('turnstileToken', token);
  
  const response = await submitJobApplication(form);
};
```

---

## 🔒 Forms Implementation

### Important Notes:
1. **Always submit from browser, NOT server** (rate limiting per IP)
2. **Check `success` field**, not HTTP status
3. **Add honeypot field** `website` (hidden)
4. **Add Turnstile token** (currently inactive, enable later)
5. **Rate limit:** 5 submissions per IP per 10 minutes

### Form Validation:
- Validate frontend for UX
- Trust server for security (re-validates)
- Map errors to fields: `validationErrors[].field`
- Show `message` as general error if `success: false` with empty errors

---

## 🎨 SEO Integration

Add to all pages with content:
```tsx
import { SOLUTION_BY_URI_QUERY, INDUSTRY_BY_URI_QUERY } from '@/lib/queries';

// In your page fetch:
const data = await graphqlRequest(query, variables);

// In metadata:
export async function generateMetadata() {
  const seo = data.solution.seo; // or industry.seo, etc.
  
  return {
    title: seo.title,
    description: seo.metaDesc || undefined, // omit if empty
    robots: `${seo.metaRobotsNoindex ? 'noindex' : 'index'}, ${seo.metaRobotsNofollow ? 'nofollow' : 'follow'}`,
    openGraph: {
      title: seo.opengraphTitle,
      description: seo.opengraphDescription,
      images: seo.opengraphImage?.sourceUrl,
    },
  };
}

// In layout/component:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: seo.schema.raw }}
/>
```

---

## 📊 Implementation Priority

1. **High Priority** (Affects UX)
   - [ ] Catalogue component (Solutions)
   - [ ] Sectors component (Industries)
   - [ ] PartnersLogos component (Home)
   - [ ] Documents component (About)

2. **Medium Priority** (Forms)
   - [ ] Contact form submissions
   - [ ] Job application submission
   - [ ] Validation error handling

3. **Low Priority** (SEO)
   - [ ] SEO metadata on pages
   - [ ] JSON-LD schema injection

---

## ✨ Testing Checklist

- [ ] Solutions page displays backend data
- [ ] Industries page displays backend data
- [ ] Home page shows partner logos
- [ ] About page has downloadable PDFs
- [ ] Contact form submits successfully
- [ ] Form validation errors display
- [ ] Job application accepts file uploads
- [ ] SEO tags render in HTML
