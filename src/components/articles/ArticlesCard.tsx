import type { Article } from "../../models/Article";

const STRAPI_BASE_URL =
  import.meta.env.VITE_STRAPI_URL?.replace(/\/$/, "") ??
  "http://localhost:1337";

/// Types
export interface ArticleCardData {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  thumbnailAlt: string;
  topics: string[];
}

/// Helpers
function toAbsoluteMediaUrl(url?: string) {
  if (!url) {
    return null;
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `${STRAPI_BASE_URL}${url}`;
}

function mapArticle(article: Article): ArticleCardData {
  const thumbnailUrl =
    toAbsoluteMediaUrl(article.image?.formats?.large?.url) ??
    toAbsoluteMediaUrl(article.image?.url);
  const topics = Array.isArray(article.topics)
    ? article.topics
        .map((topic) => topic.Title?.trim())
        .filter((topic): topic is string => Boolean(topic))
    : [];

  return {
    id: article.documentId || String(article.id),
    title: article.title?.trim() || "Untitled article",
    description:
      article.description?.trim() ||
      "This article does not have a description yet.",
    thumbnailUrl,
    thumbnailAlt:
      article.image?.alternativeText || article.title || "Article image",
    topics,
  };
}

export function ArticlesCard({ article }: { article: Article }) {
  const cardData = mapArticle(article);
  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-40 overflow-hidden bg-slate-100">
        {cardData.thumbnailUrl ? (
          <img
            src={cardData.thumbnailUrl}
            alt={cardData.thumbnailAlt}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            No image
          </div>
        )}
      </div>
      <div className="h-2 bg-linear-to-r from-indigo-500 via-sky-500 to-cyan-400" />
      <div className="space-y-4 p-5">
        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
          Article
        </span>
        <div>
          <h3 className="text-xl font-bold tracking-tight text-slate-950">
            {cardData.title}
          </h3>
          {cardData.topics.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {cardData.topics.map((topic) => (
                <span
                  key={`${cardData.id}-${topic}`}
                  className="inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200"
                >
                  {topic}
                </span>
              ))}
            </div>
          ) : null}
          <p className="mt-2 line-clamp-4 text-sm leading-6 text-slate-600">
            {cardData.description}
          </p>
        </div>
      </div>
    </article>
  );
}
