import { useLoaderData, redirect, Link } from "remix";
import type { ActionFunction, LoaderFunction, LinksFunction } from "remix";
import { listStores } from "~/pico/store.server";
import type { BywayStore } from "~/pico/store.server";

export let loader: LoaderFunction = async () => {
  const stores = await listStores();
  return stores ? stores : [];
};

const StoresIndexRoute = () => {
  const stores: BywayStore[] = useLoaderData();
  return (
    <>
      {stores.map((store) => {
        return (
          <div
            key={store.publicEci}
            className="card w-96 bg-primary text-primary-content"
          >
            <div className="card-body">
              <h2 className="card-title">{store.name}</h2>
              <p>{store.description}</p>
              <div className="card-actions justify-end">
                <Link to={`/stores/${store.publicEci}`}>
                  <button className="btn">View Store Items</button>
                </Link>
              </div>
            </div>
          </div>
        );
      })}
      <div className="card w-96 border-2 text-slate-500">
        <div className="card-body">
          <h2 className="card-title">New store</h2>
          <div className="card-actions justify-end">
            <Link to="/stores/new">
              <button className="btn">Add a new store</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
export default StoresIndexRoute;
