import { Form, redirect, useParams, useLoaderData } from "remix";
import type { ActionFunction, LoaderFunction } from "remix";
import { getItem, updateItem } from "~/pico/store.server";
import type { BywayStoreItem } from "~/pico/store.server";

export const loader: LoaderFunction = async ({ params }) => {
  const { itemid } = params;
  const item = await getItem(itemid);
  return { item };
};

export const action: ActionFunction = async ({ request, params }) => {
  const { store, itemid = "" } = params;
  const formData = await request.formData();
  const item = {
    name: formData.get("name"),
    description: formData.get("description") ?? "",
    tags: formData.get("tags") ?? "",
  };
  await updateItem(itemid, item);
  return redirect(`/stores/${store}`);
};

const ItemEditRoute = () => {
  const { item } = useLoaderData();
  // Refactor this to use a shared item form with the $store.item.new route.
  return (
    <div>
      <h1>Edit Item</h1>
      <Form method="post" className="w-full max-w-lg">
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className="block tracking-wide text-gray-700 font-medium mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              name="name"
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="name"
              type="text"
              placeholder="Name of item"
              defaultValue={item.name}
            />
          </div>
          <div className="w-full px-3">
            <label
              className="block tracking-wide text-gray-700 font-medium mb-2"
              htmlFor="tags"
            >
              Tags
            </label>
            <input
              name="tags"
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="tags"
              type="text"
              placeholder="Comma delimited list of tags."
              defaultValue={item.tags.join(", ")}
            />
          </div>
          <div className="w-full px-3 form-control">
            <label className="label" htmlFor="description">
              <span className="block tracking-wide text-gray-700 font-medium mb-2">
                Description
              </span>
            </label>
            <textarea
              id="description"
              name="description"
              data-theme="light"
              className="textarea textarea-bordered h-24 bg-gray-200 focus:bg-white"
              placeholder="Item description"
              defaultValue={item.description}
            ></textarea>
          </div>
        </div>
        <button
          type="submit"
          role="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Update
        </button>
      </Form>
    </div>
  );
};

export default ItemEditRoute;
