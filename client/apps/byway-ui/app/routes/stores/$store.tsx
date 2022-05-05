import { useParams, useLoaderData, Link } from "remix";
import type { LoaderFunction } from "remix";
import { getStore, getStoreItems } from "~/pico/store.server";
import type { BywayStore, BywayStoreItem } from "~/pico/store.server";

export let loader: LoaderFunction = async ({ request, params }) => {
  const { store } = params;
  const storeData = store ? await getStore(store) : null;
  const items = store ? await getStoreItems(store) : [];

  return {
    store: storeData,
    items,
  };
};

const StoreRoute = () => {
  const { store: storeEci } = useParams();
  const { store, items }: { store: BywayStore; items: BywayStoreItem[] } =
    useLoaderData();

  return (
    <section className="w-full">
      <header>
        <h2 className="text-3xl">
          {store.name} - <span className="text-lg">{store.description}</span>
        </h2>
      </header>
      <Link to={`/stores/${storeEci}/item/new`}>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add Item
        </button>
      </Link>
      <ul>
        {items.map((item) => (
          <h3>
            {item.name} - {item.description}
          </h3>
        ))}
      </ul>
    </section>
  );
};

export default StoreRoute;
