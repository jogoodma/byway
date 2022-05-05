import { Form, redirect } from "remix";
import type { ActionFunction } from "remix";
import { createStore } from "~/pico/store.server";
import type { BywayStore } from "~/pico/store.server";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const name = form.get("name");
  const description = form.get("description");

  if (typeof name !== "string" || typeof description !== "string") {
    throw new Error("Invalid form data");
  }
  const newStore = { name, description };
  await createStore({ store: newStore });
  return redirect("/stores/");
};

const NewStoreRoute = () => {
  return (
    <section>
      <h2 className="text-3xl">Create a new store</h2>
      <Form className="flex flex-col gap-5" method="post">
        <input
          className="input input-bordered input-lg w-full max-w-md"
          type="text"
          name="name"
          placeholder="Store Name"
        />
        <input
          className="input input-bordered input-lg w-full max-w-md"
          type="text"
          name="description"
          placeholder="Store Description"
        />
        <button className="btn btn-primary" type="submit">
          Create Store
        </button>
      </Form>
    </section>
  );
};

export default NewStoreRoute;
