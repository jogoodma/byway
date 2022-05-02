import { useState } from "react";
import { Form, useLoaderData } from "remix";
import type { ActionFunction, LoaderFunction } from "remix";
import { BywayMatches, findRequests } from "~/pico/matcher.server";
import ResultLayoutButtons from "~/components/ResultLayoutButtons";
import ResultCards from "~/components/ResultCards";
import ResultTable from "~/components/ResultTable";

type SearchIndexLoaderData = {
  term: string | null;
  matches: BywayMatches[];
};

/**
 * Reads the search term from the URL and returns the matches.
 * @param request - The request object.
 * @return The search term and the matches.
 */
export const loader: LoaderFunction = async ({
  request,
}): Promise<SearchIndexLoaderData> => {
  const url = new URL(request.url);
  const term = url.searchParams.get("term");
  const matches = await findRequests(term);
  return {
    term,
    matches,
  };
};

const SearchIndexRoute = () => {
  const results: SearchIndexLoaderData = useLoaderData();
  const [layout, setLayout] = useState("cards");

  return (
    <>
      <section className="mb-10 w-full flex justify-between">
        <div className="text-2xl">{results?.matches?.length ?? 0} results</div>
        <ResultLayoutButtons
          active={layout}
          onLayoutChange={(layout) => setLayout(layout)}
        />
      </section>
      {layout === "cards" ? (
        <ResultCards matches={results?.matches ?? []} />
      ) : null}
      {/*{layout === 'table' ? <ResultTable matches={results?.matches ?? []}/> : null }*/}
      <section>
        {results.matches.length === 0 && (
          <div className="card w-80 bg-gray-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">No results found</h2>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default SearchIndexRoute;
