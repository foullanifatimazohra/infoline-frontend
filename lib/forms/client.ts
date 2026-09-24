/**
 * Forms API client — Phase 3 handover (docs/backend/phase3-forms-api.md).
 *
 * Rules baked in from the handover:
 * - Submissions are sent FROM THE BROWSER (rate limiting is per visitor IP;
 *   server-side proxying would lock everyone out after 5 submissions).
 * - GraphQL returns HTTP 200 even on rejection — always read `success`.
 * - `validationErrors[].field` matches the input name exactly.
 * - Server error messages are English-only: never render them on /ar —
 *   map errors by field and show translated copy instead.
 * - Honeypot field `website` ships with every submission (empty for humans).
 * - Turnstile token is sent as `turnstileToken` (inert until the key is set).
 * - Choice fields take fixed keys, not UI labels (see CHOICE maps below).
 */

export const WP_GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_WPGRAPHQL_ENDPOINT ??
  "https://green-tarsier-764009.hostingersite.com/graphql";

export const WP_APPLY_ENDPOINT =
  process.env.NEXT_PUBLIC_WP_APPLY_ENDPOINT ??
  "https://green-tarsier-764009.hostingersite.com/wp-json/infoline/v1/apply";

export type InquiryAction = "service_inquiry" | "project_inquiry" | "media_inquiry";

/** Fixed keys per handover §3 — send the key, never the UI label. */
export const PROJECT_TYPES = [
  "new_build",
  "platform_migration",
  "custom_integration",
  "other",
] as const;

export const START_TIMELINES = [
  "ready_now",
  "1_3_months",
  "3_6_months",
  "scoping",
] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];
export type StartTimeline = (typeof START_TIMELINES)[number];

export type ValidationError = { field: string; message: string };

export type SubmitInquiryResult = {
  success: boolean;
  message: string;
  entryId: number;
  emailSent: boolean;
  validationErrors: ValidationError[];
};

type GraphQLResponse<T> = {
  data?: { submitInquiry?: T };
  errors?: { message: string }[];
};

const SUBMIT_INQUIRY_MUTATION = /* GraphQL */ `
  mutation SubmitInquiry($input: SubmitInquiryInput!) {
    submitInquiry(input: $input) {
      success
      message
      entryId
      emailSent
      validationErrors {
        field
        message
      }
    }
  }
`;

/**
 * Submit one of the three GraphQL inquiry forms.
 * Always resolves with the parsed payload; network failures throw.
 */
export async function submitInquiry(
  input: {
    action: InquiryAction;
    name: string;
    organisation: string;
    workEmail: string;
    country?: string;
    service?: string;
    projectType?: ProjectType;
    startTimeline?: StartTimeline;
    message?: string;
    website?: string;
    turnstileToken?: string;
  },
  { signal }: { signal?: AbortSignal } = {},
): Promise<SubmitInquiryResult> {
  const res = await fetch(WP_GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: SUBMIT_INQUIRY_MUTATION, variables: { input } }),
    signal,
  });

  if (!res.ok) {
    throw new Error(`Inquiry request failed: HTTP ${res.status}`);
  }

  const json = (await res.json()) as GraphQLResponse<SubmitInquiryResult>;

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join(" · "));
  }

  const payload = json.data?.submitInquiry;
  if (!payload) {
    throw new Error("Inquiry API returned no payload");
  }

  return {
    ...payload,
    validationErrors: payload.validationErrors ?? [],
  };
}

export type JobApplicationInput = {
  name: string;
  email: string;
  phone: string;
  /** Title of the role the candidate applied from. */
  position: string;
  message?: string;
  /** PDF, DOC or DOCX — max 5 MB (validated by the API). */
  cv: File;
  website?: string;
  turnstileToken?: string;
};

export type JobApplicationResult = SubmitInquiryResult & { action?: string };

/**
 * Job application via the REST endpoint (multipart — do NOT set Content-Type;
 * the browser must add the multipart boundary itself or the upload breaks).
 * HTTP 200 on success, 422 on rejection (status code is meaningful here).
 */
export async function submitJobApplication(
  input: JobApplicationInput,
  { signal }: { signal?: AbortSignal } = {},
): Promise<JobApplicationResult> {
  const form = new FormData();
  form.append("name", input.name);
  form.append("email", input.email);
  form.append("phone", input.phone);
  form.append("position", input.position);
  if (input.message) form.append("message", input.message);
  form.append("cv", input.cv);
  // Honeypot — always empty for real users.
  form.append("website", input.website ?? "");
  form.append("turnstileToken", input.turnstileToken ?? "");

  const res = await fetch(WP_APPLY_ENDPOINT, {
    method: "POST",
    body: form,
    signal,
  });

  let payload: JobApplicationResult | null = null;
  try {
    payload = (await res.json()) as JobApplicationResult;
  } catch {
    // Non-JSON error body — fall through to the status handling below.
  }

  if (!payload) {
    throw new Error(`Application request failed: HTTP ${res.status}`);
  }

  return {
    success: payload.success ?? res.ok,
    message: payload.message ?? "",
    entryId: payload.entryId ?? 0,
    emailSent: payload.emailSent ?? false,
    validationErrors: payload.validationErrors ?? [],
    action: payload.action,
  };
}

/** Shared helpers for UI layers. */

/** Group validation errors by field name for per-field rendering. */
export function errorsByField(errors: ValidationError[]) {
  const map = new Map<string, string[]>();
  for (const e of errors) {
    const list = map.get(e.field) ?? [];
    list.push(e.message);
    map.set(e.field, list);
  }
  return map;
}

/**
 * Classify a result into a UI state:
 * - "success"          stored (entryId > 0 or success with no field errors)
 * - "field_errors"     per-field validation issues to display
 * - "general_error"    rate limit / server error — show the message
 * (entryId === 0 with success === true means the honeypot caught a bot;
 *  humans should never see it — treat as success so bots stay convinced.)
 */
export function classifyInquiryResult(result: SubmitInquiryResult) {
  if (result.success && result.validationErrors.length === 0) {
    return "success" as const;
  }
  if (!result.success && result.validationErrors.length > 0) {
    return "field_errors" as const;
  }
  return "general_error" as const;
}
