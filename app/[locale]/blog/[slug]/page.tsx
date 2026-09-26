import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import SingleHero from "@/components/sections/blog/single-hero";
import Article from "@/components/sections/blog/article";
import { nextBlogPosts } from "@/lib/blog";
import { getBlogPosts, getBlogPostBySlug } from "@/lib/wp/api";
import { fetchLocalized } from "@/lib/wp/localized";

type Params = Promise<{ locale: string; slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchLocalized((l) => getBlogPostBySlug(slug, l));

  return {
    title: post ? `${post.title} — Infoline` : "Infoline",
    description: post?.excerpt,
    robots: post ? undefined : { index: false, follow: true },
  };
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await fetchLocalized((l) => getBlogPostBySlug(slug, l));

  if (!post) {
    // Soft 404 — themed, server-rendered, noindex (same reasoning as the
    // catch-all route: dynamic not-found boundaries stream no visible HTML
    // in Next 16).
    return <SoftNotFound />;
  }

  const posts = await fetchLocalized((l) => getBlogPosts(l));
  const morePosts = nextBlogPosts(posts, slug, 2).filter(
    (p) => p.slug !== slug,
  );

  return (
    <main className="overflow-x-clip">
      <SingleHero post={post} />
      <Article post={post} morePosts={morePosts} />
    </main>
  );
}

function SoftNotFound() {
  return (
    <main className="overflow-x-clip">
      <section className="flex min-h-[70vh] items-center bg-ink">
        <div className="mx-auto w-full max-w-360 px-6 py-28 lg:px-10">
          <NotFoundBody />
        </div>
      </section>
    </main>
  );
}

async function NotFoundBody() {
  const t = await getTranslations("Blog.page");

  return (
    <div className="flex flex-col items-start">
      <p className="font-mono text-[11.5px] font-medium uppercase tracking-[0.2em] text-lightblue-300">
        404
      </p>
      <h1 className="mt-5 max-w-[20ch] text-[40px] font-bold leading-[1.05] tracking-[-.03em] text-white lg:text-[48px]">
        {t("single.notFoundTitle")}
      </h1>
      <p className="mt-6 max-w-[52ch] text-[16px] leading-[26px] text-slate-200">
        {t("single.notFoundDescription")}
      </p>
      <Link
        href="/blog"
        className="mt-10 inline-flex items-center gap-2.5 rounded-md border border-white/18 px-6 py-3.5 text-[13px] font-semibold uppercase tracking-[0.11em] text-white transition-colors hover:border-white/40 hover:bg-white/[.04]"
      >
        {t("single.notFoundCta")}
      </Link>
    </div>
  );
}
