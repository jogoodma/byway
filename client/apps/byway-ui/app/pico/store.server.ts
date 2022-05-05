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

export type BywayStoreItem = {
  id: string;
  name: string;
  description?: string;
  tags: string[];
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

/**
 * Calls the getStore endpoint of the store entity Pico.
 *
 * @return {Promise<BywayStore>} A promise that resolves to a Byway store.
 */
export const getStore = async (storeEci: string): Promise<BywayStore> => {
  const resp = await fetch(
    `${STORE_PICO_BASE_URI}/c/${storeEci}/query/byway.store.entity/getStore`,
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
  throw new Error("Error while fetching store metadata.");
};

/**
 * Calls the getItems endpoint of the store entity Pico.
 *
 * @return {Promise<BywayStoreItem[]>} A promise that resolves to an array of Byway store items.
 */
export const getStoreItems = async (
  storeEci: string
): Promise<BywayStoreItem[]> => {
  const resp = await fetch(
    `${STORE_PICO_BASE_URI}/c/${storeEci}/query/byway.store.entity/getItems`,
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
  throw new Error("Error while fetching store items.");
};

export const newItem = async ({
  storeEci,
  item,
}: {
  storeEci: string;
  item: BywayStoreItem;
}) => {
  const resp = await fetch(
    `${STORE_PICO_BASE_URI}/c/${storeEci}/event-wait/item/new`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "post",
      body: JSON.stringify(item),
    }
  );
  if (resp.ok) {
    return resp.json();
  }
  throw new Error("Error creating new item.");
};

/**
 * Calls the getItem endpoint of the item entity Pico.
 *
 * @return {Promise<BywayStoreItem>} A promise that resolves to an array of Byway store items.
 */
export const getItem = async (itemEci: string): Promise<BywayStoreItem> => {
  console.log("Fetching item...", itemEci);
  const resp = await fetch(
    `${STORE_PICO_BASE_URI}/c/${itemEci}/query/byway.store.item/getItem`,
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
  throw new Error("Error while fetching store item.");
};

/**
 * Calls the 'item:update' event endpoint of the item entity Pico.
 *
 * @return {Promise} A promise that resolves to a Byway directive response.
 */
export const updateItem = async (
  itemEci: string,
  item: BywayStoreItem
): Promise<any> => {
  const resp = await fetch(
    `${STORE_PICO_BASE_URI}/c/${itemEci}/event-wait/item/update`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(item),
    }
  );
  if (resp.ok) {
    return resp.json();
  }
  throw new Error("Error while updating store item.");
};
/**
 *
 * Calls the 'item:delete' event endpoint of the store entity Pico.
 *
 * @return {Promise} A promise that resolves to a Byway directive response.
 */
export const deleteItem = async (
  storeEci: string,
  id: string
): Promise<any> => {
  console.log("Deleting item...", storeEci, id);
  const resp = await fetch(
    `${STORE_PICO_BASE_URI}/c/${storeEci}/event-wait/item/delete`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ id }),
    }
  );
  if (resp.ok) {
    return resp.json();
  }
  throw new Error("Error while updating store item.");
};
