# Infoline — Forms API Handover
**Phase 3 · Forms** · Backend: Amir Adel · For: Frontend · Issued: 21 Sep 2026

The forms API is ready for integration. The submission pipeline — validation, spam protection, storage, team notification and CV upload — has been verified on the live site. Connection details and CORS from the Phase 1 handover still apply.

## 1. Connection

There are two endpoints. Three forms go through GraphQL; the job application goes through REST because it carries a file.

| | |
|---|---|
| GraphQL | `https://green-tarsier-764009.hostingersite.com/graphql` — mutation `submitInquiry` |
| REST | `https://green-tarsier-764009.hostingersite.com/wp-json/infoline/v1/apply` |
| GraphQL request | POST, `Content-Type: application/json` |
| REST request | POST, `multipart/form-data` |
| Auth | None — both endpoints are public |
| CORS | Open — `access-control-allow-origin: *` |

## 2. The forms

| Form (UI) | action | Endpoint | Routed to |
|---|---|---|---|
| I need a service or solution | `service_inquiry` | GraphQL | Commercial team |
| I'm starting a new project | `project_inquiry` | GraphQL | Commercial team |
| Media and press inquiries | `media_inquiry` | GraphQL | Communications |
| Job application (Careers page) | — | REST `/apply` | HR |

"Book a call instead" is not a form. It is a link to a scheduling tool, handled on the frontend. Nothing is submitted to the API from that button.

"View open roles" is not a form either. It links to the Careers page, where the job application form lives.

Every submission is stored in the CMS under Inquiries before any email is sent, so a failed notification never loses a submission.

## 3. Read this before writing code

### Always check success

The API returns HTTP 200 from GraphQL even when a submission is rejected. Read `success`, never the status code alone.

| success | validationErrors | Meaning | Show the user |
|---|---|---|---|
| true | [] | Stored and routed | The confirmation state |
| false | has items | One or more fields invalid | Each error next to its field |
| false | [] | Rate limited or server error | The message as a general error |

### Validation errors are a list, per field

```json
"validationErrors": [
  { "field": "workEmail", "message": "Enter a valid email address." },
  { "field": "country",   "message": "This field is required." }
]
```

`field` matches the input name exactly, so you can map each error to its field. Validate on the frontend for a fast response, but treat the server as the source of truth — it always re-validates.

### Error messages are English only

The message strings are not translated. For the Arabic site, map errors by field and show your own translated text. Do not display the server message on Arabic pages.

### Submit from the browser, not the Next.js server

Rate limiting is per visitor IP: 5 submissions per form, per IP, every 10 minutes. If submissions are sent from the Next.js server, every visitor shares the server's IP and the limit locks out everyone after five submissions.

Every attempt counts toward the limit, including rejected ones. While testing, expect to hit it — wait ten minutes and it resets.

Send the request from the browser. CORS is open, so this works directly. If you need server-side submission for another reason, tell me first — it needs a config change on my side.

### Choice fields accept fixed keys only

`projectType` and `startTimeline` reject anything outside their list. Send the key, not the label shown on the button.

| Field | Key | UI label |
|---|---|---|
| projectType | `new_build` | New build |
| | `platform_migration` | Platform migration |
| | `custom_integration` | Custom integration |
| | `other` | Other |
| startTimeline | `ready_now` | Ready to start now |
| | `1_3_months` | Within 1–3 months |
| | `3_6_months` | Within 3–6 months |
| | `scoping` | Still scoping |

### One email field name

Every GraphQL form uses `workEmail`, including the media form where the label reads "Email". The job application uses `email`.

### Honeypot — add it to every form

Every form must include a hidden field named `website`. Real users never fill it; bots usually do. Hide it with CSS off-screen, not with `display: none` or `type="hidden"`, which some bots skip.

```html
<div style="position:absolute;left:-9999px" aria-hidden="true">
  <input name="website" tabindex="-1" autocomplete="off">
</div>
```

If `website` has any value, the API returns `success: true` and stores nothing. This is deliberate — the bot believes it succeeded. It also means `entryId: 0` on a `success: true` response indicates a caught bot.

### Turnstile — wire it now, it switches on later

Cloudflare Turnstile verification is built in but inactive until the secret key is set. Add the widget now and send its token as `turnstileToken`. While the key is unset the token is ignored, so nothing breaks; once it is set, submissions without a valid token are rejected.

### Populate "Choose service" from the API

Build the service dropdown from the services query rather than hardcoding it, so new services appear without a frontend change. Send the service title as `service`. If the dropdown allows several services, send them as one comma-separated string.

## 4. Form fields

### service_inquiry — I need a service or solution

| Field | Type | Required |
|---|---|---|
| name | text | Yes |
| organisation | text | Yes |
| workEmail | email | Yes |
| country | text | Yes |
| service | text | Yes |
| message | textarea | Yes |

### project_inquiry — I'm starting a new project

| Field | Type | Required |
|---|---|---|
| name | text | Yes |
| organisation | text | Yes |
| workEmail | email | Yes |
| country | text | Yes |
| projectType | choice | Yes |
| startTimeline | choice | Yes |
| message | textarea | Yes |

### media_inquiry — Media and press

| Field | Type | Required |
|---|---|---|
| name | text | Yes |
| organisation | text | No |
| workEmail | email | Yes |
| message | textarea | Yes |

### Job application — REST

| Field | Type | Required |
|---|---|---|
| name | text | Yes |
| email | email | Yes |
| phone | text | Yes |
| position | text | Yes |
| message | textarea | No |
| cv | file | Yes — PDF, DOC or DOCX, 5 MB max |

`position` should be the title of the role the candidate applied from, taken from the careers post they are viewing.

Limits on every text field: 200 characters for text, 5000 for textareas. Anything longer is rejected with a field error.

## 5. Ready requests

### Service inquiry

```graphql
mutation SubmitServiceInquiry($input: SubmitInquiryInput!) {
  submitInquiry(input: $input) {
    success
    message
    entryId
    emailSent
    validationErrors { field message }
  }
}
```

Variables:

```json
{
  "input": {
    "action": "service_inquiry",
    "name": "Jane Smith",
    "organisation": "Ministry of Example",
    "workEmail": "jane@example.gov.om",
    "country": "Oman",
    "service": "Contact Centre Outsourcing",
    "message": "Two or three sentences on the operation.",
    "website": "",
    "turnstileToken": ""
  }
}
```

The same mutation serves all three GraphQL forms — only action and the fields change.

### New project inquiry

```json
{
  "input": {
    "action": "project_inquiry",
    "name": "Jane Smith",
    "organisation": "Example Group",
    "workEmail": "jane@example.com",
    "country": "Oman",
    "projectType": "new_build",
    "startTimeline": "1_3_months",
    "message": "What we are building and what success looks like.",
    "website": "",
    "turnstileToken": ""
  }
}
```

### Media inquiry

```json
{
  "input": {
    "action": "media_inquiry",
    "name": "John Doe",
    "organisation": "Times of Oman",
    "workEmail": "john@example.com",
    "message": "Request for comment on...",
    "website": "",
    "turnstileToken": ""
  }
}
```

### Successful response

```json
{
  "data": {
    "submitInquiry": {
      "success": true,
      "message": "Inquiry submitted successfully.",
      "entryId": 9770,
      "emailSent": true,
      "validationErrors": []
    }
  }
}
```

`emailSent: false` still means the submission was stored — the team can see it in the CMS. Show the confirmation state either way.

### Rejected response

```json
{
  "data": {
    "submitInquiry": {
      "success": false,
      "message": "Please correct the highlighted fields.",
      "entryId": 0,
      "emailSent": false,
      "validationErrors": [
        { "field": "workEmail", "message": "Enter a valid email address." }
      ]
    }
  }
}
```

### Job application with CV

```ts
const form = new FormData();
form.append('name', name);
form.append('email', email);
form.append('phone', phone);
form.append('position', roleTitle);
form.append('message', message);
form.append('cv', fileInput.files[0]);
form.append('website', '');          // honeypot — always empty
form.append('turnstileToken', token);

const res  = await fetch(
  'https://green-tarsier-764009.hostingersite.com/wp-json/infoline/v1/apply',
  { method: 'POST', body: form }       // do not set Content-Type — the browser adds the boundary
);
const data = await res.json();
```

The response has the same shape as the GraphQL payload, plus `action`. The REST endpoint returns HTTP 200 on success and HTTP 422 on rejection, so here the status code is meaningful.

Do not set Content-Type manually for FormData — the browser must add the multipart boundary itself, and setting the header breaks the upload.

## 6. Suggested test pass

The rate limit counts every attempt per form, including rejected ones, so these steps will trip it. When a form starts returning a general error, wait ten minutes or switch to another form.

1. Submit each of the three GraphQL forms with valid data. Confirm the confirmation state renders and `entryId` is a real number.
2. Submit each form empty. Confirm every required field shows its own error in the right place.
3. Submit a malformed email. Confirm the error attaches to the email field.
4. Submit a project inquiry four times, pairing one projectType with one startTimeline each time, so every key is sent once.
5. Fill the honeypot field by hand and submit. Expect `success: true` with `entryId: 0`, and nothing stored.
6. Submit the same form six times in a row. The sixth returns `success: false` with an empty `validationErrors`. Show the message as a general error.
7. Submit a job application with a PDF, then with a DOCX, then with a JPG. The JPG must be rejected with an error on `cv`.
8. Submit a job application with no file. Expect an error on `cv`.
9. On the Arabic site, confirm errors show your translated text, not the English server message.

## 7. Change control

The mutation name, the action keys, the field names and the choice keys are frozen as of this handover. Any change is announced before it lands, never silently.

The form definitions live in version control under `wp-content/mu-plugins/infoline-forms.php`, so every change to a field, rule or choice list appears in the Git diff.

## 8. Tell me if you hit these

- A valid submission that returns a field error you did not expect.
- `success: false` with an empty `validationErrors` when you have not submitted repeatedly.
- A CV upload that fails with a file you believe is valid.
- A field the design needs that is not in the list above.
- Any need to submit from the server rather than the browser.
