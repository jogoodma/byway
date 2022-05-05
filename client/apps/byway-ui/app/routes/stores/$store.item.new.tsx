import { Form } from "remix";
import { redirect } from "remix";
import type { ActionFunction } from "remix";
import { newItem } from "~/pico/store.server";
import type { BywayStoreItem } from "~/pico/store.server";

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const { store: storeEci } = params;
  const item: BywayStoreItem = {
    name: formData.get("name"),
    tags: formData.get("tags") ?? "",
    description: formData.get("description") ?? "",
  };
  if (
    typeof item.name !== "string" ||
    typeof item.description !== "string" ||
    typeof item.tags !== "string" ||
    typeof storeEci !== "string"
  ) {
    throw new Error("Invalid form data");
  }
  await newItem({ storeEci, item });
  return redirect(`/stores/${storeEci}`);
};

const NewItemRoute = () => {
  return (
    <main className="m-10 p-10 bg-white rounded-lg">
      <h1 className="text-slate-600 text-4xl mb-4">New Item</h1>

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
            ></textarea>
          </div>
        </div>
        <button
          type="submit"
          role="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add
        </button>
      </Form>
    </main>
  );
};

export default NewItemRoute;
