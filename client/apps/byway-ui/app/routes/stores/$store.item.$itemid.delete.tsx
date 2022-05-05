import { Form, Link, redirect, useParams, useLoaderData } from "remix";
import type { ActionFunction, LoaderFunction } from "remix";
import { getItem, deleteItem } from "~/pico/store.server";
import type { BywayStoreItem } from "~/pico/store.server";

export const loader: LoaderFunction = async ({ params }) => {
  const { itemid } = params;
  const item = await getItem(itemid);
  return { item };
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const id = formData.get("id");
  const { store, itemid: itemEci } = params;
  await deleteItem(store, id);
  return redirect(`/stores/${store}`);
};

const ItemDeleteRoute = () => {
  const { store, itemid } = useParams();
  const { item } = useLoaderData();
  // Refactor this to use a shared item form with the $store.item.new route.
  return (
    <section>
      <div className="hero min-h- bg-gray-200 rounded-lg">
        <div className="hero-content text-center">
          <div className="max-w-xl">
            <h1 className="text-5xl font-bold text-black">
              Delete {item.name}?
            </h1>
            <p className="py-6">Are you sure you want to delete this item?</p>
            <Form method="post">
              <input type="hidden" name="id" value={item.id} />
              <button type="submit" className="btn btn-error">
                DELETE
              </button>
              <Link to={`/stores/${store}`}>
                <button className="ml-8 btn btn-success">Keep</button>
              </Link>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ItemDeleteRoute;
