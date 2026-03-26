import { useEffect, useState } from "react";

type StrapiArticle = {
  id: number;
  documentId?: string;
  title?: string;
  description?: string;
  attributes?: {
    title?: string;
    description?: string;
  };
};

type StrapiArticlesResponse = {
  data: StrapiArticle[];
};

type ArticleCard = {
  id: string;
  title: string;
  description: string;
};

const STRAPI_BASE_URL = import.meta.env.VITE_STRAPI_URL;
const STRAPI_API_TOKEN = import.meta.env.VITE_STRAPI_API_TOKEN?.trim();

const ARTICLES_ENDPOINT = `${STRAPI_BASE_URL}/api/articles`;

function mapArticle(article: StrapiArticle): ArticleCard {
  const source = article.attributes ?? article;

  return {
    id: article.documentId ?? String(article.id),
    title: source.title?.trim() || "Untitled article",
    description:
      source.description?.trim() ||
      "This article does not have a description yet.",
  };
}

export function ArticlesGrid() {
  const [articles, setArticles] = useState<ArticleCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(ARTICLES_ENDPOINT, {
          headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const result = (await response.json()) as StrapiArticlesResponse;
        setArticles(
          Array.isArray(result.data) ? result.data.map(mapArticle) : [],
        );
      } catch (fetchError) {
        if (
          fetchError instanceof DOMException &&
          fetchError.name === "AbortError"
        ) {
          return;
        }

        console.error("Error fetching articles:", fetchError);
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Could not load articles from the local Strapi instance.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <section className="rounded-4xl border border-white/60 bg-white/95 p-8 shadow-2xl shadow-indigo-950/10 backdrop-blur-sm">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-500">
            Content Feed
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-950">
            Latest articles from Strapi
          </h2>
        </div>
        <p className="max-w-md text-sm text-slate-600">
          Data is loaded from the local Strapi API at
          <span className="ml-1 font-semibold text-slate-900">
            {STRAPI_BASE_URL}
          </span>
        </p>
      </div>

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-5"
            >
              <div className="space-y-3">
                <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                <div className="h-6 w-3/4 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          <p className="font-semibold">Articles unavailable</p>
          <p className="mt-1">{error}</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
          No articles found in the local Strapi collection yet.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {articles.map((article) => (
            <article
              key={article.id}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="h-2 bg-linear-to-r from-indigo-500 via-sky-500 to-cyan-400" />
              <div className="space-y-4 p-5">
                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                  Article
                </span>
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-slate-950">
                    {article.title}
                  </h3>
                  <p className="mt-2 line-clamp-4 text-sm leading-6 text-slate-600">
                    {article.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
