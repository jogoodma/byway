// Set some defaults depending on if we are running in Docker vs. dev mode.
const STORE_PICO_BASE_URI =
  process.env.NODE_ENV === "production"
    ? "https://matcher:3000"
    : process.env?.STORE_PICO_BASE_URI
    ? process.env.STORE_PICO_BASE_URI
    : (() => {
        throw new Error("STORE_PICO_BASE_URI is not set");
      })();

const STORE_MANAGER_ECI = process.env?.STORE_MANAGER_ECI
  ? process.env?.STORE_MANAGER_ECI
  : (() => {
      throw new Error("STORE_MANAGER_ECI is not set");
    })();

export type BywayStore = {
  name: string;
  description?: string;
  publicEci?: string;
};

/**
 * Calls the listStores endpoint of the store manager Pico.
 *
 * @return {Promise<BywayStore[]>} A promise that resolves to an array of Byway stores.
 */
export const listStores = async (): Promise<BywayStore[]> => {
  const resp = await fetch(
    `${STORE_PICO_BASE_URI}/c/${STORE_MANAGER_ECI}/query/byway.store.manager/listStores`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );
  if (resp.ok) {
    return resp.json();
  }
  throw new Error("Error while listing stores");
};

export const createStore = async ({ store }: { store: BywayStore }) => {
  console.log("Creating store...", store);
  const resp = await fetch(
    `${STORE_PICO_BASE_URI}/c/${STORE_MANAGER_ECI}/event-wait/store/new`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "post",
      body: JSON.stringify(store),
    }
  );
  if (resp.ok) {
    return resp.json();
  }
  throw new Error("Error creating new store.");
};
