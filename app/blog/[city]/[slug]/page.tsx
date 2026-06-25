import { notFound } from "next/navigation";
import { use } from "react";
import type { Metadata } from 'next';
import BlogPageLayout from "@/features/seo-landing/components/blog-page-layout";
import { getAllBlogEntries, getBlogContent, type BlogContent } from "@/features/seo-landing/content";
import { createPageMetadata } from '@/lib/seo';

interface PageProps {
    params: Promise<{ city: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { city, slug } = await params;
    const content = getBlogContent(city, slug);
    if (!content) return {} satisfies Metadata;

    return createPageMetadata({
        title: content.title,
        description: content.description,
        keywords: content.keywords,
        path: `/blog/${city}/${slug}`,
    });
}

export function generateStaticParams() {
    return getAllBlogEntries();
}

export default function BlogCitySlugPage({ params }: PageProps) {
    const { city, slug } = use(params);
    const content: BlogContent | undefined = getBlogContent(city, slug);
    if (!content) return notFound();
    return (
        <BlogPageLayout
            title={content.title}
            description={content.description}
            sections={content.sections}
        />
    );
}
