import { useEffect, useMemo, useRef, useState } from "react";
import { parseReadme } from "./parseReadme";

const PAGE_SIZE = 48;

function formatCount(number) {
  return new Intl.NumberFormat("en-US").format(number);
}

export default function App() {
  const [items, setItems] = useState([]);
  const [sections, setSections] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loadMoreRef = useRef(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadReadme() {
      try {
        setLoading(true);
        const response = await fetch("./README.md", { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`README load failed: HTTP ${response.status}`);
        }

        const markdown = await response.text();
        const parsed = parseReadme(markdown);
        if (isCancelled) return;

        setItems(parsed.items);
        setSections(parsed.sections);
        setError("");
      } catch (err) {
        if (isCancelled) return;
        setError(err.message || "Unknown error while loading README.");
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    loadReadme();
    return () => {
      isCancelled = true;
    };
  }, []);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();
    return items.filter((item) => {
      const matchesQuery =
        !normalizedQuery || item.searchBlob.includes(normalizedQuery);
      const matchesSection =
        !selectedSection || item.section === selectedSection;
      return matchesQuery && matchesSection;
    });
  }, [items, query, selectedSection]);

  const visibleItems = filteredItems.slice(0, visibleCount);
  const canLoadMore = visibleCount < filteredItems.length;

  useEffect(() => {
    if (loading || error || !canLoadMore || !loadMoreRef.current) return;

    const target = loadMoreRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        setVisibleCount((current) =>
          Math.min(current + PAGE_SIZE, filteredItems.length)
        );
      },
      { rootMargin: "700px 0px" }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [loading, error, canLoadMore, filteredItems.length]);

  function resetFilters() {
    setQuery("");
    setSelectedSection("");
    setVisibleCount(PAGE_SIZE);
  }

  function changeSection(section) {
    setSelectedSection(section);
    setVisibleCount(PAGE_SIZE);
  }

  function onQueryChange(value) {
    setQuery(value);
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <div className="page">
      <div className="noise" aria-hidden="true" />
      <div className="glow glow-1" aria-hidden="true" />
      <div className="glow glow-2" aria-hidden="true" />
      <div className="glow glow-3" aria-hidden="true" />

      <header className="hero container">
        <h1>OSINT Tools Discovery</h1>
        <p className="lead">
          Search and explore powerful Open Source Intelligence tools.
        </p>
      </header>

      <main className="container">
        <section className="filters">
          <label className="sr-only" htmlFor="search">
            Search tools
          </label>
          <div className="search-shell">
            <svg
              className="search-icon"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M11 4a7 7 0 1 0 4.9 12l4.5 4.5 1.4-1.4-4.5-4.5A7 7 0 0 0 11 4Zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z"
                fill="currentColor"
              />
            </svg>
            <input
              id="search"
              type="search"
              placeholder="Search for tools, categories, or keywords..."
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
            />
          </div>
        </section>

        <section className="meta-row centered">
          <p>
            {loading
              ? "Loading tools..."
              : `${formatCount(filteredItems.length)} tools available`}
          </p>
        </section>

        <section className="chips" aria-label="Quick category filters">
          <button
            type="button"
            className={`chip ${selectedSection === "" ? "active" : ""}`}
            onClick={() => changeSection("")}
          >
            All
          </button>
          {sections.map((section) => (
            <button
              type="button"
              key={section.name}
              className={`chip ${
                selectedSection === section.name ? "active" : ""
              }`}
              onClick={() => changeSection(section.name)}
            >
              {section.name}
            </button>
          ))}
          {(query || selectedSection) && (
            <button type="button" className="chip reset-chip" onClick={resetFilters}>
              Reset Filters
            </button>
          )}
        </section>

        {error ? (
          <section className="state error">
            <p>{error}</p>
            <p>Run with `npm run dev` and open the local URL from Vite.</p>
          </section>
        ) : null}

        {!error && loading ? (
          <section className="grid">
            {Array.from({ length: 12 }).map((_, index) => (
              <article className="card skeleton" key={`skeleton-${index}`} />
            ))}
          </section>
        ) : null}

        {!error && !loading && visibleItems.length === 0 ? (
          <section className="state empty">
            <p>No tools match this filter.</p>
          </section>
        ) : null}

        {!error && !loading && visibleItems.length > 0 ? (
          <section className="grid">
            {visibleItems.map((tool, index) => (
              <a
                className="card card-link"
                key={tool.id}
                href={tool.url}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`Open ${tool.name}`}
                style={{ "--delay": `${Math.min(index, 30) * 18}ms` }}
              >
                <p className="card-section">{tool.section}</p>
                <h2>{tool.name}</h2>
                <p className="card-description">
                  {tool.description || "No description provided."}
                </p>
                <span className="visit">Open Tool</span>
              </a>
            ))}
          </section>
        ) : null}

        {!loading && !error && (
          <section className="auto-load">
            {canLoadMore ? <p>Scroll to auto-load more tools...</p> : <p>End of results.</p>}
            <div ref={loadMoreRef} className="scroll-sentinel" aria-hidden="true" />
          </section>
        )}
      </main>
    </div>
  );
}
