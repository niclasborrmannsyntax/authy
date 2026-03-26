import { useEffect, useState } from "react";
import { ArticlesCard } from "./ArticlesCard";
import type { Article } from "../../models/Article";

type StrapiArticlesResponse = {
  data: Article[];
};

const STRAPI_BASE_URL =
  import.meta.env.VITE_STRAPI_URL?.replace(/\/$/, "") ??
  "http://localhost:1337";
const STRAPI_API_TOKEN = import.meta.env.VITE_STRAPI_API_TOKEN?.trim();
const ARTICLES_ENDPOINT = `${STRAPI_BASE_URL}/api/articles?populate=*`;

export function ArticlesGrid() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchArticles = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(ARTICLES_ENDPOINT, {
          headers: {
            ...(STRAPI_API_TOKEN
              ? { Authorization: `Bearer ${STRAPI_API_TOKEN}` }
              : {}),
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const result = (await response.json()) as StrapiArticlesResponse;
        console.log("Fetched articles:", result.data);
        setArticles(result.data);
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

    void fetchArticles();

    return () => controller.abort();
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
              <div className="mb-4 h-40 animate-pulse rounded-2xl bg-slate-200" />
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
            <ArticlesCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </section>
  );
}
