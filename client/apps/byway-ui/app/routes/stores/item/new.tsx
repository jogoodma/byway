import { Form } from "remix";
import { redirect } from "remix";
import type { ActionFunction } from "remix";
import { NumberInput, Textarea } from "@mantine/core";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  return redirect("/stores");
};

const NewItem = () => {
  return (
    <main className="m-10 p-10 bg-white rounded-lg">
      <h1 className="text-slate-600 text-4xl mb-4">New Item</h1>

      <Form method="post" className="w-full max-w-lg">
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-name"
            >
              Name
            </label>
            <input
              name="name"
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-name"
              type="text"
              placeholder="e.g. Power drill"
            />
          </div>
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-description"
            >
              Description
            </label>
            <Textarea
              autosize
              minRows={2}
              maxRows={5}
              name="description"
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-description"
              placeholder="Item description"
            />
          </div>
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-price"
            >
              Price
            </label>
            <input
              name="price"
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-price"
              type="text"
              placeholder="e.g. 10.33"
            />
          </div>
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-quantity"
            >
              Quantity
            </label>
            <NumberInput
              id="grid-quantity"
              defaultValue={1}
              min={0}
              placeholder="Number of items"
              required
            />
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

export default NewItem;
