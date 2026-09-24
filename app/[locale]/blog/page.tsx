import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Hero from "@/components/sections/blog/hero";
import Featured from "@/components/sections/blog/featured";
import Updates from "@/components/sections/blog/updates";
import Cta from "@/components/sections/blog/cta";
import { getBlogPost, type BlogPost } from "@/lib/blog";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Blog.page");

  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default async function BlogPage() {
  // Server-side resolution — t.raw() from a server getTranslations() reads the
  // root namespace, avoiding the client-hook namespace scoping gotcha.
  const t = await getTranslations();
  const posts = t.raw("Blog.posts") as BlogPost[];

  const featured = getBlogPost(posts, "copc-audit") ?? posts[0];

  return (
    <main className="overflow-x-clip">
      <Hero />
      <Featured post={featured} />
      <Updates posts={posts} />
      <Cta />
    </main>
  );
}
