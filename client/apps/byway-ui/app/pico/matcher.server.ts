// Set some defaults depending on if we are running in Docker vs. dev mode.
const MATCHER_PICO_BASE_URI =
  process.env.NODE_ENV === "production"
    ? "https://matcher:3000"
    : process.env?.MATCHER_PICO_BASE_URI
    ? process.env.MATCHER_PICO_BASE_URI
    : (() => {
        throw new Error("MATCHER_PICO_BASE_URI is not set");
      })();

const MATCHER_MANAGER_ECI = process.env?.MATCHER_MANAGER_ECI
  ? process.env?.MATCHER_MANAGER_ECI
  : (() => {
      throw new Error("MATCHER_MANAGER_ECI is not set");
    })();

export type BywayMatches = {
  id: string;
  name: string;
  description?: string;
  tags: string[];
  price: number;
};

/**
 * Calls the findRequestsByTag endpoint of the matcher Pico.
 *
 * @param term {string} The term(s) to search for.
 * @return {Promise<BywayMatches[]>} A promise that resolves to an array of Byway matches.
 */
export const findRequests = async (
  term: string | null
): Promise<BywayMatches[]> => {
  const resp = await fetch(
    `${MATCHER_PICO_BASE_URI}/c/${MATCHER_MANAGER_ECI}/query/byway.matcher.matcher/findRequestByTag`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ tags: term }),
    }
  );
  if (resp.ok) {
    return resp.json();
  }
  throw new Error("Error while searching for requests");
};
