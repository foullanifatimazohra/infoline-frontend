import ThemedNotFound from "@/components/sections/not-found/themed";

/**
 * Locale-aware 404 boundary fallback. Renders the same themed coming-soon
 * content as the catch-all page for any request that reaches the not-found
 * boundary inside a locale (e.g. notFound() thrown deeper in the tree).
 */
export default function NotFoundPage() {
  return <ThemedNotFound />;
}
